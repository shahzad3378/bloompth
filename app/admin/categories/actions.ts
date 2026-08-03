"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: "active" | "inactive";
};

export type CategoryActionResult = {
  success: boolean;
  message: string;
};

export async function createCategory(
  input: CreateCategoryInput
): Promise<CategoryActionResult> {
  const name = input.name.trim();
  const slug = input.slug.trim().toLowerCase();

  if (!name) {
    return {
      success: false,
      message: "Category name required hai.",
    };
  }

  if (!slug) {
    return {
      success: false,
      message: "Category slug required hai.",
    };
  }

  const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!validSlugPattern.test(slug)) {
    return {
      success: false,
      message:
        "Slug mein sirf lowercase letters, numbers aur hyphens use karein.",
    };
  }

  if (input.status !== "active" && input.status !== "inactive") {
    return {
      success: false,
      message: "Invalid category status.",
    };
  }

  const { data: existingCategory, error: checkError } =
    await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

  if (checkError) {
    console.error("Category slug check error:", checkError);

    return {
      success: false,
      message: `Unable to verify category: ${checkError.message}`,
    };
  }

  if (existingCategory) {
    return {
      success: false,
      message:
        "Ye slug pehle se mojood hai. Category name ya slug change karein.",
    };
  }

  const { error: insertError } = await supabaseAdmin
    .from("categories")
    .insert({
      name,
      slug,
      description: input.description?.trim() || null,
      image: input.image || null,
      status: input.status,
    });

  if (insertError) {
    console.error("Create category error:", insertError);

    if (insertError.code === "23505") {
      return {
        success: false,
        message:
          "Ye slug pehle se mojood hai. Category name ya slug change karein.",
      };
    }

    return {
      success: false,
      message: insertError.message || "Category save nahi ho saki.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
  revalidatePath("/");

  return {
    success: true,
    message: "Category successfully create ho gayi.",
  };
}