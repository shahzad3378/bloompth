"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
  }

  function handleImageChange(file: File | null) {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Sirf JPG, PNG ya WebP image upload karein.");
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (file.size > maxSize) {
      setErrorMessage("Image ka size 5 MB se zyada nahi hona chahiye.");
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setErrorMessage("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Category name required hai.");
      setLoading(false);
      return;
    }

    if (!slug.trim()) {
      setErrorMessage("Category slug required hai.");
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;
    let uploadedFilePath: string | null = null;

    if (imageFile) {
      const rawExtension = imageFile.name.split(".").pop()?.toLowerCase();
      const fileExtension =
        rawExtension && ["jpg", "jpeg", "png", "webp"].includes(rawExtension)
          ? rawExtension
          : "jpg";

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
        });

      if (uploadError) {
        setErrorMessage(`Image upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      uploadedFilePath = filePath;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const result = await createCategory({
      name,
      slug,
      description: description.trim() || null,
      image: imageUrl,
      status,
    });

    if (!result.success) {
      if (uploadedFilePath) {
        await supabase.storage
          .from("product-images")
          .remove([uploadedFilePath]);
      }

      setErrorMessage(result.message);
      setLoading(false);
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
          Categories
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Add New Category
        </h1>

        <p className="mt-2 text-slate-500">
          Create a new product category with image and visibility settings.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="text-sm font-bold text-slate-700"
            >
              Category Name *
            </label>

            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Electronics"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="slug"
              className="text-sm font-bold text-slate-700"
            >
              Slug *
            </label>

            <input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={(event) =>
                setSlug(generateSlug(event.target.value))
              }
              placeholder="electronics"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Category URL: /categories/{slug || "category-slug"}
            </p>
          </div>

          <div>
            <label
              htmlFor="status"
              className="text-sm font-bold text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "active" | "inactive")
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="image"
              className="text-sm font-bold text-slate-700"
            >
              Category Image
            </label>

            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                handleImageChange(event.target.files?.[0] || null)
              }
              className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-bold file:text-emerald-700 hover:file:bg-emerald-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG ya WebP. Maximum size 5 MB.
            </p>
          </div>

          {imagePreview && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-bold text-slate-700">
                Image Preview
              </p>

              <div className="h-56 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="text-sm font-bold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write category details..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/admin/categories")}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading & Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}