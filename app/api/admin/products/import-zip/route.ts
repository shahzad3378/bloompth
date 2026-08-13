import { NextResponse } from "next/server";
import JSZip from "jszip";
import * as XLSX from "xlsx";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAccount, isActiveAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ExcelRow = Record<string, unknown>;

type PreparedProduct = {
  rowNumber: number;
  title: string;
  slug: string;
  category: string;
  price: number;
  sale_price: number | null;
  stock: number;
  image: string | null;
  featured: boolean;
  status: string;
};

const SUPPORTED_IMAGE_TYPES = /\.(jpg|jpeg|png|webp)$/i;
const MAX_PRODUCTS = 1000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function normalizeBoolean(value: unknown) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return ["true", "1", "yes", "y"].includes(normalized);
}

function getCell(
  row: ExcelRow,
  possibleNames: string[]
): unknown {
  const normalizedEntries = Object.entries(row).map(
    ([key, value]) => [
      key.trim().toLowerCase().replace(/\s+/g, "_"),
      value,
    ]
  );

  for (const possibleName of possibleNames) {
    const normalizedPossibleName = possibleName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    const foundEntry = normalizedEntries.find(
      ([key]) => key === normalizedPossibleName
    );

    if (foundEntry) {
      return foundEntry[1];
    }
  }

  return "";
}

function normalizeFileName(value: string) {
  return (
    value
      .replace(/\\/g, "/")
      .split("/")
      .pop()
      ?.trim()
      .toLowerCase() ?? ""
  );
}

function getMimeType(fileName: string) {
  const extension = fileName
    .split(".")
    .pop()
    ?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";

    case "png":
      return "image/png";

    case "webp":
      return "image/webp";

    default:
      return "application/octet-stream";
  }
}

function createStorageFileName(
  slug: string,
  originalFileName: string
) {
  const extension =
    originalFileName
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const uniquePart = crypto.randomUUID().slice(0, 8);

  return `${slug}-${uniquePart}.${extension}`;
}

export async function POST(request: Request) {
  const account = await getCurrentAccount();

  if (!isActiveAdmin(account)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 403 }
    );
  }

  const errors: string[] = [];
  const uploadedStoragePaths: string[] = [];

  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "ZIP file nahi mili.",
        },
        {
          status: 400,
        }
      );
    }

    if (!uploadedFile.name.toLowerCase().endsWith(".zip")) {
      return NextResponse.json(
        {
          success: false,
          message: "Sirf ZIP file allowed hai.",
        },
        {
          status: 400,
        }
      );
    }

    const zipBuffer = await uploadedFile.arrayBuffer();
    const zip = await JSZip.loadAsync(zipBuffer);

    const zipEntries = Object.values(zip.files).filter(
      (entry) => !entry.dir
    );

    const excelEntry = zipEntries.find((entry) => {
      const fileName = entry.name.toLowerCase();

      return (
        fileName.endsWith(".xlsx") &&
        !fileName.includes("__macosx") &&
        !fileName.startsWith("~$")
      );
    });

    if (!excelEntry) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ZIP ke andar products.xlsx file nahi mili.",
        },
        {
          status: 400,
        }
      );
    }

    const imageEntries = zipEntries.filter((entry) => {
      return (
        SUPPORTED_IMAGE_TYPES.test(entry.name) &&
        !entry.name.toLowerCase().includes("__macosx")
      );
    });

    const imageEntryMap = new Map(
      imageEntries.map((entry) => [
        normalizeFileName(entry.name),
        entry,
      ])
    );

    const excelBuffer = await excelEntry.async("arraybuffer");

    const workbook = XLSX.read(excelBuffer, {
      type: "array",
    });

    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return NextResponse.json(
        {
          success: false,
          message: "Excel file mein sheet nahi mili.",
        },
        {
          status: 400,
        }
      );
    }

    const worksheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json<ExcelRow>(
      worksheet,
      {
        defval: "",
        raw: false,
      }
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Excel file mein product rows nahi mile.",
        },
        {
          status: 400,
        }
      );
    }

    if (rows.length > MAX_PRODUCTS) {
      return NextResponse.json(
        {
          success: false,
          message: `Ek import mein maximum ${MAX_PRODUCTS} products allowed hain.`,
        },
        {
          status: 400,
        }
      );
    }

    const preparedProducts: PreparedProduct[] = [];

    rows.forEach((row, index) => {
      const rowNumber = index + 2;

      const title = String(
        getCell(row, ["title"])
      ).trim();

      const manuallyEnteredSlug = String(
        getCell(row, ["slug"])
      ).trim();

      const slug = slugify(
        manuallyEnteredSlug || title
      );

      const category =
        String(
          getCell(row, ["category"])
        ).trim() || "Uncategorized";

      const priceValue = String(
        getCell(row, ["price"])
      ).trim();

      const salePriceValue = String(
        getCell(row, [
          "sale_price",
          "sale price",
          "salePrice",
        ])
      ).trim();

      const stockValue = String(
        getCell(row, ["stock"])
      ).trim();

      const imageName = String(
        getCell(row, ["image"])
      ).trim();

      const featured = normalizeBoolean(
        getCell(row, ["featured"])
      );

      const requestedStatus = String(
        getCell(row, ["status"])
      )
        .trim()
        .toLowerCase();

      const status =
        requestedStatus === "active"
          ? "active"
          : "draft";

      const price = Number(priceValue);

      const salePrice =
        salePriceValue === ""
          ? null
          : Number(salePriceValue);

      const stock =
        stockValue === ""
          ? 0
          : Number(stockValue);

      if (!title) {
        errors.push(
          `Row ${rowNumber}: title missing hai.`
        );
        return;
      }

      if (!slug) {
        errors.push(
          `Row ${rowNumber}: valid slug generate nahi ho saka.`
        );
        return;
      }

      if (!Number.isFinite(price) || price < 0) {
        errors.push(
          `Row ${rowNumber}: price invalid hai.`
        );
        return;
      }

      if (
        salePrice !== null &&
        (!Number.isFinite(salePrice) ||
          salePrice < 0)
      ) {
        errors.push(
          `Row ${rowNumber}: sale_price invalid hai.`
        );
        return;
      }

      if (!Number.isFinite(stock) || stock < 0) {
        errors.push(
          `Row ${rowNumber}: stock invalid hai.`
        );
        return;
      }

      if (
        salePrice !== null &&
        salePrice > price
      ) {
        errors.push(
          `Row ${rowNumber}: sale_price regular price se zyada hai.`
        );
        return;
      }

      preparedProducts.push({
        rowNumber,
        title,
        slug,
        category,
        price,
        sale_price: salePrice,
        stock: Math.floor(stock),
        image: imageName || null,
        featured,
        status,
      });
    });

    if (preparedProducts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Koi valid product import ke liye available nahi hai.",
          imported: 0,
          skipped: rows.length,
          imagesUploaded: 0,
          errors,
        },
        {
          status: 400,
        }
      );
    }

    const duplicateSlugsInExcel = new Set<string>();
    const seenSlugs = new Set<string>();

    for (const product of preparedProducts) {
      if (seenSlugs.has(product.slug)) {
        duplicateSlugsInExcel.add(product.slug);
      }

      seenSlugs.add(product.slug);
    }

    const uniquePreparedProducts =
      preparedProducts.filter((product) => {
        if (
          duplicateSlugsInExcel.has(product.slug)
        ) {
          errors.push(
            `Row ${product.rowNumber}: duplicate slug "${product.slug}" Excel mein multiple times hai.`
          );

          return false;
        }

        return true;
      });

    if (uniquePreparedProducts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Saare products duplicate ya invalid thay.",
          imported: 0,
          skipped: rows.length,
          imagesUploaded: 0,
          errors,
        },
        {
          status: 400,
        }
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data: existingProducts, error: existingError } =
      await supabaseAdmin
        .from("products")
        .select("slug")
        .in(
          "slug",
          uniquePreparedProducts.map(
            (product) => product.slug
          )
        );

    if (existingError) {
      return NextResponse.json(
        {
          success: false,
          message: existingError.message,
          imported: 0,
          skipped: rows.length,
          imagesUploaded: 0,
          errors,
        },
        {
          status: 500,
        }
      );
    }

    const existingSlugs = new Set(
      (existingProducts ?? []).map((product) =>
        String(product.slug).toLowerCase()
      )
    );

    const productsToProcess =
      uniquePreparedProducts.filter((product) => {
        if (existingSlugs.has(product.slug)) {
          errors.push(
            `Row ${product.rowNumber}: slug "${product.slug}" already exists.`
          );

          return false;
        }

        return true;
      });

    if (productsToProcess.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Saare valid products database mein already exist karte hain.",
          imported: 0,
          skipped: rows.length,
          imagesUploaded: 0,
          errors,
        },
        {
          status: 400,
        }
      );
    }

    const databaseProducts: Array<{
      title: string;
      slug: string;
      category: string;
      price: number;
      sale_price: number | null;
      stock: number;
      image: string | null;
      featured: boolean;
      status: string;
    }> = [];

    let imagesUploaded = 0;

    for (const product of productsToProcess) {
      let publicImageUrl: string | null = null;

      if (product.image) {
        const normalizedImageName =
          normalizeFileName(product.image);

        const imageEntry =
          imageEntryMap.get(normalizedImageName);

        if (!imageEntry) {
          errors.push(
            `Row ${product.rowNumber}: image "${product.image}" ZIP mein nahi mili.`
          );

          continue;
        }

        const imageBuffer =
          await imageEntry.async("uint8array");

        if (imageBuffer.byteLength > MAX_IMAGE_SIZE) {
          errors.push(
            `Row ${product.rowNumber}: image "${product.image}" 5 MB se zyada hai.`
          );

          continue;
        }

        const storageFileName =
          createStorageFileName(
            product.slug,
            product.image
          );

        const storagePath = `imports/${storageFileName}`;

        const { error: uploadError } =
          await supabaseAdmin.storage
            .from("products")
            .upload(storagePath, imageBuffer, {
              contentType: getMimeType(
                product.image
              ),
              cacheControl: "3600",
              upsert: false,
            });

        if (uploadError) {
          errors.push(
            `Row ${product.rowNumber}: image upload failed — ${uploadError.message}`
          );

          continue;
        }

        uploadedStoragePaths.push(storagePath);
        imagesUploaded += 1;

        const { data: publicUrlData } =
          supabaseAdmin.storage
            .from("products")
            .getPublicUrl(storagePath);

        publicImageUrl =
          publicUrlData.publicUrl;
      }

      databaseProducts.push({
        title: product.title,
        slug: product.slug,
        category: product.category,
        price: product.price,
        sale_price: product.sale_price,
        stock: product.stock,
        image: publicImageUrl,
        featured: product.featured,
        status: product.status,
      });
    }

    if (databaseProducts.length === 0) {
      if (uploadedStoragePaths.length > 0) {
        await supabaseAdmin.storage
          .from("products")
          .remove(uploadedStoragePaths);
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "Images ya product data ki wajah se koi product import nahi ho saka.",
          imported: 0,
          skipped: rows.length,
          imagesUploaded: 0,
          errors,
        },
        {
          status: 400,
        }
      );
    }

    const { error: insertError } =
      await supabaseAdmin
        .from("products")
        .insert(databaseProducts);

    if (insertError) {
      if (uploadedStoragePaths.length > 0) {
        await supabaseAdmin.storage
          .from("products")
          .remove(uploadedStoragePaths);
      }

      return NextResponse.json(
        {
          success: false,
          message: `Database insert failed: ${insertError.message}`,
          imported: 0,
          skipped: rows.length,
          imagesUploaded: 0,
          errors,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Products aur images successfully import ho gaye.",
      imported: databaseProducts.length,
      skipped:
        rows.length - databaseProducts.length,
      imagesUploaded,
      errors,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "ZIP import complete nahi ho saka.",
        imported: 0,
        skipped: 0,
        imagesUploaded: 0,
        errors,
      },
      {
        status: 500,
      }
    );
  }
}
