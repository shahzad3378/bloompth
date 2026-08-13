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
    message: "Product deleted successfully.",
  };
}
