"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { findCountry } from "@/lib/countries";
import { CUSTOMER_COUNTRY_COOKIE } from "@/lib/customer-currency";
import { createClient } from "@/lib/supabase/server";

export async function setCustomerCountry(formData: FormData) {
  const country = findCountry(String(formData.get("country") || ""));

  if (!country) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(CUSTOMER_COUNTRY_COOKIE, country.name, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.updateUser({
      data: { country: country.name },
    });

    await supabase
      .from("profiles")
      .update({ country: country.name })
      .eq("id", user.id);
  }

  revalidatePath("/", "layout");
}
