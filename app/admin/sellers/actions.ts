"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateSellerStatus(
  sellerId: string,
  status: "active" | "rejected" | "pending"
) {
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
