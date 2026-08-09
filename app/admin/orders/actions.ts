"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export async function updateOrderStatus(formData: FormData) {
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

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/seller/orders");
}
