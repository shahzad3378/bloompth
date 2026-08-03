"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsActionResult = {
  success: boolean;
  message: string;
};

function getOptionalText(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

export async function updateWebsiteSettings(
  formData: FormData
): Promise<SettingsActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to update settings.",
    };
  }

  const companyName = getOptionalText(formData, "company_name");

  if (!companyName) {
    return {
      success: false,
      message: "Company name is required.",
    };
  }

  const settings = {
    id: "main",
    company_name: companyName,
    tagline: getOptionalText(formData, "tagline"),
    phone: getOptionalText(formData, "phone"),
    whatsapp: getOptionalText(formData, "whatsapp"),
    email: getOptionalText(formData, "email"),
    address: getOptionalText(formData, "address"),
    business_hours: getOptionalText(formData, "business_hours"),
    facebook_url: getOptionalText(formData, "facebook_url"),
    instagram_url: getOptionalText(formData, "instagram_url"),
    linkedin_url: getOptionalText(formData, "linkedin_url"),
    tiktok_url: getOptionalText(formData, "tiktok_url"),
    youtube_url: getOptionalText(formData, "youtube_url"),
    maps_url: getOptionalText(formData, "maps_url"),
    footer_text: getOptionalText(formData, "footer_text"),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("website_settings")
    .upsert(settings, {
      onConflict: "id",
    });

  if (error) {
    console.error("Settings update error:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");

  return {
    success: true,
    message: "Website settings saved successfully.",
  };
}