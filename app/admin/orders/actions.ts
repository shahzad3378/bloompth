"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "");

  if (
    !orderId ||
    !allowedStatuses.includes(
      status as (typeof allowedStatuses)[number]
    )
  ) {
    throw new Error("Invalid order update.");
  }

  const supabaseAdmin = createAdminClient();

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select(
      "id, product_id, quantity, status, stock_deducted"
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(
      orderError?.message || "Order not found."
    );
  }

  const quantity = Number(order.quantity || 0);

  if (status === "completed" && !order.stock_deducted) {
    const { data: product, error: productError } =
      await supabaseAdmin
        .from("products")
        .select("id, stock")
        .eq("id", order.product_id)
        .single();

    if (productError || !product) {
      throw new Error(
        productError?.message || "Product not found."
      );
    }

    const currentStock = Number(product.stock || 0);

    if (currentStock < quantity) {
      throw new Error(
        `Insufficient stock. Available stock is ${currentStock}.`
      );
    }

    const { error: stockUpdateError } =
      await supabaseAdmin
        .from("products")
        .update({
          stock: currentStock - quantity,
        })
        .eq("id", order.product_id);

    if (stockUpdateError) {
      throw new Error(stockUpdateError.message);
    }

    const { error: orderUpdateError } =
      await supabaseAdmin
        .from("orders")
        .update({
          status: "completed",
          stock_deducted: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

    if (orderUpdateError) {
      throw new Error(orderUpdateError.message);
    }
  } else if (
    status !== "completed" &&
    order.stock_deducted
  ) {
    const { data: product, error: productError } =
      await supabaseAdmin
        .from("products")
        .select("id, stock")
        .eq("id", order.product_id)
        .single();

    if (productError || !product) {
      throw new Error(
        productError?.message || "Product not found."
      );
    }

    const currentStock = Number(product.stock || 0);

    const { error: stockRestoreError } =
      await supabaseAdmin
        .from("products")
        .update({
          stock: currentStock + quantity,
        })
        .eq("id", order.product_id);

    if (stockRestoreError) {
      throw new Error(stockRestoreError.message);
    }

    const { error: orderUpdateError } =
      await supabaseAdmin
        .from("orders")
        .update({
          status,
          stock_deducted: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

    if (orderUpdateError) {
      throw new Error(orderUpdateError.message);
    }
  } else {
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/seller/orders");
  revalidatePath("/seller/products");
  revalidatePath("/products");
}
