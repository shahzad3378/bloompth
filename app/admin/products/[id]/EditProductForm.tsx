"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { countries, currencyForCountryName } from "@/lib/countries";

type Product = {
  id: string | number;
  title: string | null;
  slug: string | null;
  description: string | null;
  category: string | null;
  origin_country?: string | null;
  stock_country?: string | null;
  currency_code?: string | null;
  price: number | string | null;
  sale_price: number | string | null;
  stock: number | null;
  min_order_qty: number | null;
  image: string | null;
  images?: string[] | null;
  featured: boolean | null;
  status: string | null;
  created_at: string | null;
};

type EditProductFormProps = {
  product: Product;
};

export default function EditProductForm({
  product,
}: EditProductFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState(product.title ?? "");
  const [slug, setSlug] = useState(product.slug ?? "");
  const [description, setDescription] = useState(
    product.description ?? ""
  );
  const [category, setCategory] = useState(product.category ?? "");
  const [originCountry, setOriginCountry] = useState(product.origin_country ?? "");
  const [stockCountry, setStockCountry] = useState(product.stock_country ?? "");
  const currencyCode = currencyForCountryName(stockCountry);
  const [price, setPrice] = useState(
    product.price !== null && product.price !== undefined
      ? String(product.price)
      : ""
  );
  const [salePrice, setSalePrice] = useState(
    product.sale_price !== null &&
      product.sale_price !== undefined
      ? String(product.sale_price)
      : ""
  );
  const [stock, setStock] = useState(
    String(product.stock ?? 0)
  );

  const [minOrderQty, setMinOrderQty] = useState(
    String(product.min_order_qty ?? 1)
  );
  const [featured, setFeatured] = useState(
    Boolean(product.featured)
  );
  const [status, setStatus] = useState(
    product.status ?? "active"
  );

  const [currentImages, setCurrentImages] = useState<string[]>(
    product.images?.length ? product.images : product.image ? [product.image] : []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    return () => imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [imagePreviews]);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleImageChange(fileList: FileList | null) {
    setErrorMessage("");
    setSuccessMessage("");
    const files = Array.from(fileList ?? []);

    if (files.length > 3) {
      setErrorMessage("Maximum 3 product images select karein.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maximumFileSize = 5 * 1024 * 1024;
    const invalidFile = files.find(
      (file) => !allowedTypes.includes(file.type) || file.size > maximumFileSize
    );

    if (invalidFile) {
      setErrorMessage(
        !allowedTypes.includes(invalidFile.type)
          ? "Sirf JPG, PNG ya WebP images upload karein."
          : "Har image ka size 5 MB se zyada nahi hona chahiye."
      );
      return;
    }

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function getStoragePathFromPublicUrl(imageUrl: string) {
    const marker =
      "/storage/v1/object/public/product-images/";

    const markerIndex = imageUrl.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(
      imageUrl.substring(markerIndex + marker.length)
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const cleanTitle = title.trim();
    const cleanSlug = generateSlug(slug);
    const parsedPrice = price === "" ? null : Number(price);
    const parsedSalePrice =
      salePrice === "" ? null : Number(salePrice);
    const parsedStock = Number(stock);
    const parsedMinOrderQty = Number(minOrderQty);

    if (!stockCountry || !currencyCode) {
      setErrorMessage("Stock available country select karein.");
      setLoading(false);
      return;
    }

    if (!cleanTitle) {
      setErrorMessage("Product name required hai.");
      setLoading(false);
      return;
    }

    if (!cleanSlug) {
      setErrorMessage("Product slug required hai.");
      setLoading(false);
      return;
    }

    if (
      parsedPrice !== null &&
      (!Number.isFinite(parsedPrice) || parsedPrice < 0)
    ) {
      setErrorMessage("Price valid honi chahiye.");
      setLoading(false);
      return;
    }

    if (
      parsedSalePrice !== null &&
      (!Number.isFinite(parsedSalePrice) ||
        parsedSalePrice < 0)
    ) {
      setErrorMessage("Sale price valid honi chahiye.");
      setLoading(false);
      return;
    }

    if (
      parsedPrice !== null &&
      parsedSalePrice !== null &&
      parsedSalePrice > parsedPrice
    ) {
      setErrorMessage(
        "Sale price regular price se zyada nahi ho sakti."
      );
      setLoading(false);
      return;
    }

    if (
      !Number.isFinite(parsedStock) ||
      parsedStock < 0 ||
      !Number.isInteger(parsedStock)
    ) {
      setErrorMessage(
        "Stock zero ya us se zyada whole number hona chahiye."
      );
      setLoading(false);
      return;
    }

    if (
      !Number.isFinite(parsedMinOrderQty) ||
      parsedMinOrderQty < 1 ||
      !Number.isInteger(parsedMinOrderQty)
    ) {
      setErrorMessage(
        "Minimum order quantity kam az kam 1 whole number honi chahiye."
      );
      setLoading(false);
      return;
    }

    let updatedImages = currentImages;
    const newlyUploadedPaths: string[] = [];

    if (imageFiles.length > 0) {
      updatedImages = [];

      for (const file of imageFiles) {
        const extensionFromName = file.name.split(".").pop()?.toLowerCase();
        const extension =
          extensionFromName && ["jpg", "jpeg", "png", "webp"].includes(extensionFromName)
            ? extensionFromName
            : "jpg";
        const filePath = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          if (newlyUploadedPaths.length) {
            await supabase.storage.from("product-images").remove(newlyUploadedPaths);
          }
          setErrorMessage(`Image upload failed: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        newlyUploadedPaths.push(filePath);
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        updatedImages.push(publicUrlData.publicUrl);
      }
    }

    const updatedImageUrl = updatedImages[0] ?? null;

    const { error: updateError } = await supabase
      .from("products")
      .update({
        title: cleanTitle,
        slug: cleanSlug,
        description: description.trim() || null,
        category: category.trim() || null,
        origin_country: originCountry || null,
        stock_country: stockCountry,
        currency_code: currencyCode,
        price: parsedPrice,
        sale_price: parsedSalePrice,
        stock: parsedStock,
        min_order_qty: parsedMinOrderQty,
        image: updatedImageUrl,
        images: updatedImages,
        featured,
        status,
      })
      .eq("id", product.id);

    if (updateError) {
      if (newlyUploadedPaths.length) {
        await supabase.storage
          .from("product-images")
          .remove(newlyUploadedPaths);
      }

      if (updateError.code === "23505") {
        setErrorMessage(
          "Ye slug pehle se mojood hai. Slug change karein."
        );
      } else {
        setErrorMessage(updateError.message);
      }

      setLoading(false);
      return;
    }

    if (imageFiles.length > 0) {
      const oldPaths = currentImages
        .map(getStoragePathFromPublicUrl)
        .filter((path): path is string => Boolean(path));
      if (oldPaths.length) {
        const { error: removeError } = await supabase.storage
          .from("product-images")
          .remove(oldPaths);
        if (removeError) console.error("Old image remove error:", removeError);
      }
    }

    setCurrentImages(updatedImages);
    setImageFiles([]);
    setImagePreviews([]);

    setSuccessMessage(
      "Product successfully update ho gaya hai."
    );
    setLoading(false);

    router.refresh();
  }

  async function handleRemoveCurrentImage() {
    if (currentImages.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Kya aap current product image remove karna chahte hain?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const oldImagePaths = currentImages
      .map(getStoragePathFromPublicUrl)
      .filter((path): path is string => Boolean(path));

    const { error: updateError } = await supabase
      .from("products")
      .update({
        image: null,
        images: [],
      })
      .eq("id", product.id);

    if (updateError) {
      setErrorMessage(updateError.message);
      setLoading(false);
      return;
    }

    if (oldImagePaths.length) {
      const { error: removeError } = await supabase.storage
        .from("product-images")
        .remove(oldImagePaths);
      if (removeError) console.error("Image storage remove error:", removeError);
    }

    setCurrentImages([]);
    setImageFiles([]);
    setImagePreviews([]);

    setSuccessMessage("Product image remove ho gayi hai.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="title"
            className="text-sm font-bold text-slate-700"
          >
            Product Name *
          </label>

          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="slug"
            className="text-sm font-bold text-slate-700"
          >
            Slug *
          </label>

          <input
            id="slug"
            type="text"
            required
            value={slug}
            onChange={(event) =>
              setSlug(generateSlug(event.target.value))
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Product URL: /products/
            {slug || "product-slug"}
          </p>
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-sm font-bold text-slate-700"
          >
            Category
          </label>

          <input
            id="category"
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="originCountry" className="text-sm font-bold text-slate-700">Country of origin</label>
            <select id="originCountry" value={originCountry} onChange={(event) => setOriginCountry(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="">Select origin country</option>
              {countries.map((country) => <option key={country.code} value={country.name}>{country.flag} {country.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="stockCountry" className="text-sm font-bold text-slate-700">Stock available in</label>
            <select id="stockCountry" required value={stockCountry} onChange={(event) => setStockCountry(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="">Select stock country</option>
              {countries.map((country) => <option key={country.code} value={country.name}>{country.flag} {country.name}</option>)}
            </select>
            <p className="mt-1 text-xs text-slate-500">Price currency: {currencyCode || "select a country"}</p>
          </div>
        </div>

        <div>
          <label
            htmlFor="stock"
            className="text-sm font-bold text-slate-700"
          >
            Stock
          </label>

          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) =>
              setStock(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="minOrderQty"
            className="text-sm font-bold text-slate-700"
          >
            Minimum Order Quantity
          </label>

          <input
            id="minOrderQty"
            type="number"
            min="1"
            step="1"
            value={minOrderQty}
            onChange={(event) =>
              setMinOrderQty(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="text-sm font-bold text-slate-700"
          >
            Price ({currencyCode || "—"})
          </label>

          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="salePrice"
            className="text-sm font-bold text-slate-700"
          >
            Sale Price ({currencyCode || "—"})
          </label>

          <input
            id="salePrice"
            type="number"
            min="0"
            step="0.01"
            value={salePrice}
            onChange={(event) =>
              setSalePrice(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="images"
            className="text-sm font-bold text-slate-700"
          >
            Product Images (up to 3)
          </label>

          <input
            id="images"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => handleImageChange(event.target.files)}
            className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-bold file:text-emerald-700"
          />

          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG ya WebP. Maximum 3 images, har image 5 MB tak. Nayi images purani gallery replace karengi.
          </p>
        </div>

        {(imagePreviews.length > 0 || currentImages.length > 0) && (
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-bold text-slate-700">
              {imagePreviews.length > 0 ? `New Image Preview (${imagePreviews.length}/3)` : `Current Images (${currentImages.length}/3)`}
            </p>
            <div className="flex flex-wrap gap-3">
              {(imagePreviews.length > 0 ? imagePreviews : currentImages).map((image, index) => (
                <div key={image} className="h-32 w-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <img src={image} alt={`Product image ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            {currentImages.length > 0 && imagePreviews.length === 0 && (
              <button type="button" disabled={loading} onClick={handleRemoveCurrentImage} className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60">
                Remove All Images
              </button>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="text-sm font-bold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="text-sm font-bold text-slate-700"
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(event.target.checked)
              }
              className="h-4 w-4 accent-emerald-600"
            />

            <span className="text-sm font-bold text-slate-700">
              Featured Product
            </span>
          </label>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            router.push("/admin/products")
          }
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Updating Product..."
            : "Update Product"}
        </button>
      </div>
    </form>
  );
}
