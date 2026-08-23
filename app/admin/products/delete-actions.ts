"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth";

export type DeleteProductResult = {
  success: boolean;
  message: string;
};

export async function deleteProduct(
  productId: string
): Promise<DeleteProductResult> {
  await requireAdmin();

  if (!productId) {
    return {
      success: false,
      message: "Product ID is missing.",
    };
  }

  // Check whether this product has already been used in an order.
  const { count, error: orderCheckError } = await supabaseAdmin
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (orderCheckError) {
    console.error("Product order check error:", orderCheckError);

    return {
      success: false,
      message: "Could not verify product order history.",
    };
  }

  // Preserve historical orders by archiving used products.
  if ((count ?? 0) > 0) {
    const { data, error: archiveError } = await supabaseAdmin
      .from("products")
      .update({ status: "inactive" })
      .eq("id", productId)
      .select("id");

    if (archiveError) {
      console.error("Product archive error:", archiveError);

      return {
        success: false,
        message: archiveError.message || "Product could not be archived.",
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Product was not found or could not be archived.",
      };
    }

    revalidatePath("/admin/products");
    revalidatePath("/");

    return {
      success: true,
      message:
        "Product has order history, so it was archived instead of permanently deleted.",
    };
  }

  // Products with no order history can be permanently deleted.
  const { data, error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", productId)
    .select("id");

  if (error) {
    console.error("Product delete error:", error);

    return {
      success: false,
      message: error.message || "Product could not be deleted.",
    };
  }

  if (!data || data.length === 0) {
    return {
      success: false,
      message: "Product was not found or could not be deleted.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");

  return {
    success: true,
    message: "Product deleted permanently.",
  };
}
