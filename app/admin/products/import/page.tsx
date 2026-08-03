"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileArchive,
  Loader2,
  Upload,
} from "lucide-react";

type ImportResult = {
  success: boolean;
  message: string;
  imported?: number;
  skipped?: number;
  imagesUploaded?: number;
  errors?: string[];
};

export default function ImportProductsPage() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    setResult(null);

    if (!file) {
      setZipFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setZipFile(null);

      setResult({
        success: false,
        message: "Sirf ZIP file select karein.",
      });

      event.target.value = "";
      return;
    }

    setZipFile(file);
  }

  async function handleImport() {
    if (!zipFile) {
      setResult({
        success: false,
        message: "Pehle ZIP file select karein.",
      });

      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", zipFile);

      const response = await fetch(
        "/api/admin/products/import-zip",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = (await response.json()) as ImportResult;

      setResult(data);

      if (response.ok && data.success) {
        setZipFile(null);
      }
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Import request fail ho gayi.",
      });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <h1 className="mt-6 text-3xl font-black text-slate-950">
          Import Products
        </h1>

        <p className="mt-2 text-slate-500">
          Excel file aur product images ko ek ZIP mein upload
          karein.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <FileArchive size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              Upload ZIP File
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              ZIP mein products.xlsx aur images folder hona
              chahiye.
            </p>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
          <Upload size={36} className="text-emerald-600" />

          <span className="mt-4 font-black text-slate-900">
            Choose ZIP File
          </span>

          <span className="mt-2 text-sm text-slate-500">
            products.xlsx + images folder
          </span>

          <input
            type="file"
            accept=".zip,application/zip"
            onChange={handleFileChange}
            disabled={isImporting}
            className="hidden"
          />
        </label>

        {zipFile && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-bold text-emerald-900">
              {zipFile.name}
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              {(zipFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={!zipFile || isImporting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isImporting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Importing Products...
            </>
          ) : (
            <>
              <Upload size={20} />
              Start Product Import
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-black text-amber-900">
          ZIP Structure
        </h2>

        <pre className="mt-4 overflow-x-auto rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">
{`BloomPath-Import.zip
├── products.xlsx
└── images/
    └── test.jpg`}
        </pre>
      </div>

      {result && (
        <div
          className={`rounded-2xl border p-6 ${
            result.success
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle2
                size={24}
                className="shrink-0 text-emerald-700"
              />
            ) : (
              <AlertCircle
                size={24}
                className="shrink-0 text-red-700"
              />
            )}

            <div>
              <p
                className={`font-black ${
                  result.success
                    ? "text-emerald-900"
                    : "text-red-900"
                }`}
              >
                {result.message}
              </p>

              {typeof result.imported === "number" && (
                <p className="mt-2 text-sm font-semibold">
                  Products imported: {result.imported}
                </p>
              )}

              {typeof result.imagesUploaded === "number" && (
                <p className="mt-1 text-sm font-semibold">
                  Images uploaded: {result.imagesUploaded}
                </p>
              )}

              {typeof result.skipped === "number" && (
                <p className="mt-1 text-sm font-semibold">
                  Rows skipped: {result.skipped}
                </p>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="mt-4 space-y-1 rounded-xl bg-white/70 p-4 text-sm text-red-800">
                  {result.errors.map((error, index) => (
                    <p key={`${error}-${index}`}>
                      • {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}