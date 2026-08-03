"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateRequestStatus(
  id: string,
  status: string
) {
  const supabase = await createClient();

  await supabase
    .from("product_requests")
    .update({ status })
    .eq("id", id);

  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
}