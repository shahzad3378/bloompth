import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Product = {
  id: string | number;
  title: string | null;
  slug: string | null;
  category: string | null;
  price: number | string | null;
  sale_price: number | string | null;
  stock: number | null;
  image: string | null;
  featured: boolean | null;
  status: string | null;
  created_at: string | null;
};

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        `
          id,
          title,
          slug,
          category,
          price,
          sale_price,
          stock,
          image,
          featured,
          status,
          created_at
        `
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    const products = (data ?? []) as Product[];

    const headers = [
      "id",
      "title",
      "slug",
      "category",
      "price",
      "sale_price",
      "stock",
      "image",
      "featured",
      "status",
      "created_at",
    ];

    const rows = products.map((product) =>
      [
        product.id,
        product.title,
        product.slug,
        product.category,
        product.price,
        product.sale_price,
        product.stock,
        product.image,
        product.featured,
        product.status,
        product.created_at,
      ]
        .map(escapeCsvValue)
        .join(",")
    );

    const csvContent = [
      headers.join(","),
      ...rows,
    ].join("\n");

    const date = new Date().toISOString().slice(0, 10);
    const filename = `bloompath-products-${date}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Products export nahi ho sake.",
      },
      {
        status: 500,
      }
    );
  }
}