"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export type DeleteProductResult = {
  success: boolean;
  message: string;
};

export async function deleteProduct(
  productId: string
): Promise<DeleteProductResult> {
  try {
    await requireAdmin();

    const id = Number(productId);

    if (!Number.isInteger(id) || id <= 0) {
      return {
        success: false,
        message: "Invalid product ID.",
      };
    }

    const supabaseAdmin = createAdminClient();

    const { data: product, error: productLoadError } =
      await supabaseAdmin
        .from("products")
        .select("id, image")
        .eq("id", id)
        .maybeSingle();

    if (productLoadError) {
      return {
        success: false,
        message: productLoadError.message,
      };
    }

    if (!product) {
      return {
        success: false,
        message: "Product nahi mila.",
      };
    }

    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return {
        success: false,
        message: deleteError.message,
      };
    }

    if (
      product.image &&
      typeof product.image === "string" &&
      product.image.includes(
        "/storage/v1/object/public/products/"
      )
    ) {
      const storagePath = product.image
        .split("/storage/v1/object/public/products/")[1]
        ?.split("?")[0];

      if (storagePath) {
        await supabaseAdmin.storage
          .from("products")
          .remove([decodeURIComponent(storagePath)]);
      }
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product successfully delete ho gaya.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Product delete nahi ho saka.",
    };
  }
}
