"use client";

import { useState, useTransition } from "react";
import {
  Building2,
  Clock3,
  ExternalLink,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
} from "lucide-react";

import {
  updateWebsiteSettings,
  type SettingsActionResult,
} from "@/app/admin/settings/actions";

export type WebsiteSettings = {
  id: string;
  company_name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  business_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  maps_url: string | null;
  footer_text: string | null;
  updated_at: string;
};

type SettingsFormProps = {
  settings: WebsiteSettings;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export default function SettingsForm({
  settings,
}: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState<SettingsActionResult | null>(
    null
  );

  function handleSubmit(formData: FormData) {
    setResult(null);

    startTransition(async () => {
      const response = await updateWebsiteSettings(formData);
      setResult(response);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {result && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-bold ${
            result.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {result.message}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Building2 size={23} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Company Information
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Update the company name and public website tagline.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-black text-slate-700">
            Company Name
            <input
              name="company_name"
              type="text"
              required
              defaultValue={settings.company_name}
              placeholder="BloomPath"
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700">
            Website Tagline
            <input
              name="tagline"
              type="text"
              defaultValue={settings.tagline ?? ""}
              placeholder="Source smarter. Grow faster."
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Phone size={23} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Contact Information
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              These details can later be displayed in the website header,
              footer and contact section.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-black text-slate-700">
            <span className="flex items-center gap-2">
              <Phone size={16} />
              Phone Number
            </span>

            <input
              name="phone"
              type="text"
              defaultValue={settings.phone ?? ""}
              placeholder="+971 50 123 4567"
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700">
            <span className="flex items-center gap-2">
              <MessageCircle size={16} />
              WhatsApp Number
            </span>

            <input
              name="whatsapp"
              type="text"
              defaultValue={settings.whatsapp ?? ""}
              placeholder="971501234567"
              className={inputClassName}
            />

            <span className="mt-2 block text-xs font-semibold text-slate-400">
              Country code ke saath number likhein. Example: 971501234567
            </span>
          </label>

          <label className="text-sm font-black text-slate-700">
            <span className="flex items-center gap-2">
              <Mail size={16} />
              Email Address
            </span>

            <input
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
              placeholder="info@bloompath.com"
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700">
            <span className="flex items-center gap-2">
              <Clock3 size={16} />
              Business Hours
            </span>

            <input
              name="business_hours"
              type="text"
              defaultValue={settings.business_hours ?? ""}
              placeholder="Monday to Saturday, 9:00 AM – 6:00 PM"
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700 sm:col-span-2">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Office Address
            </span>

            <textarea
              name="address"
              rows={3}
              defaultValue={settings.address ?? ""}
              placeholder="Dubai, United Arab Emirates"
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700 sm:col-span-2">
            <span className="flex items-center gap-2">
              <Globe2 size={16} />
              Google Maps URL
            </span>

            <input
              name="maps_url"
              type="url"
              defaultValue={settings.maps_url ?? ""}
              placeholder="https://maps.google.com/..."
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            Social Media Links
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Jo social media account available na ho, us field ko empty rehne
            dein.
          </p>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-black text-slate-700">
            <span className="flex items-center gap-2">
              <ExternalLink size={16} />
              Facebook URL
            </span>

            <input
              name="facebook_url"
              type="url"
              defaultValue={settings.facebook_url ?? ""}
              placeholder="https://facebook.com/..."
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700">
            <span className="flex items-center gap-2">
              <ExternalLink size={16} />
              Instagram URL
            </span>

            <input
              name="instagram_url"
              type="url"
              defaultValue={settings.instagram_url ?? ""}
              placeholder="https://instagram.com/..."
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700">
            <span className="flex items-center gap-2">
              <ExternalLink size={16} />
              LinkedIn URL
            </span>

            <input
              name="linkedin_url"
              type="url"
              defaultValue={settings.linkedin_url ?? ""}
              placeholder="https://linkedin.com/company/..."
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700">
            TikTok URL
            <input
              name="tiktok_url"
              type="url"
              defaultValue={settings.tiktok_url ?? ""}
              placeholder="https://tiktok.com/@..."
              className={inputClassName}
            />
          </label>

          <label className="text-sm font-black text-slate-700 sm:col-span-2">
            <span className="flex items-center gap-2">
              <ExternalLink size={16} />
              YouTube URL
            </span>

            <input
              name="youtube_url"
              type="url"
              defaultValue={settings.youtube_url ?? ""}
              placeholder="https://youtube.com/@..."
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">
          Footer Settings
        </h2>

        <label className="mt-6 block text-sm font-black text-slate-700">
          Footer Copyright Text

          <input
            name="footer_text"
            type="text"
            defaultValue={settings.footer_text ?? ""}
            placeholder="© 2026 BloomPath. All rights reserved."
            className={inputClassName}
          />
        </label>
      </section>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-w-44 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-black text-white shadow-xl transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}