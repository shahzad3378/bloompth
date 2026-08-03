import {
  AlertCircle,
  Settings2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import SettingsForm, {
  type WebsiteSettings,
} from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

const defaultSettings: WebsiteSettings = {
  id: "main",
  company_name: "BloomPath",
  tagline: "Source smarter. Grow faster.",
  phone: null,
  whatsapp: null,
  email: null,
  address: null,
  business_hours: null,
  facebook_url: null,
  instagram_url: null,
  linkedin_url: null,
  tiktok_url: null,
  youtube_url: null,
  maps_url: null,
  footer_text: "© 2026 BloomPath. All rights reserved.",
  updated_at: new Date().toISOString(),
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("website_settings")
    .select(
      `
        id,
        company_name,
        tagline,
        phone,
        whatsapp,
        email,
        address,
        business_hours,
        facebook_url,
        instagram_url,
        linkedin_url,
        tiktok_url,
        youtube_url,
        maps_url,
        footer_text,
        updated_at
      `
    )
    .eq("id", "main")
    .maybeSingle();

  const settings = data
    ? (data as WebsiteSettings)
    : defaultSettings;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Settings2 size={27} />
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
            Website Management
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Website Settings
          </h1>

          <p className="mt-2 leading-7 text-slate-500">
            Manage BloomPath contact details, social links and general
            website information.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle size={21} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-black">
              Unable to load saved settings
            </p>

            <p className="mt-1 text-sm font-semibold">
              {error.message}
            </p>
          </div>
        </div>
      )}

      <SettingsForm settings={settings} />
    </div>
  );
}