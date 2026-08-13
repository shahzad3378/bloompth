"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export async function updateSellerStatus(
  sellerId: string,
  status: "active" | "rejected" | "pending"
) {
  await requireAdmin();

  const supabaseAdmin = createAdminClient();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ status })
    .eq("id", sellerId)
    .eq("role", "seller");

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sellers");
}
