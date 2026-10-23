"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { countries, currencyForCountryName } from "@/lib/countries";

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [stockCountry, setStockCountry] = useState("");
  const currencyCode = currencyForCountryName(stockCountry);
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("0");
const [minOrderQty, setMinOrderQty] = useState("1");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("active");

  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [imagePreviews]);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(generateSlug(value));
  }

  function handleImageChange(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);

    if (files.length > 3) {
      setErrorMessage("Maximum 3 product images select karein.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    const invalidFile = files.find(
      (file) => !allowedTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFile) {
      setErrorMessage(
        !allowedTypes.includes(invalidFile.type)
          ? "Sirf JPG, PNG ya WebP images upload karein."
          : "Har image ka size 5 MB se zyada nahi hona chahiye."
      );
      return;
    }

    setErrorMessage("");
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function handleVideoChange(file: File | null) {
    setErrorMessage("");
    if (!file) { setVideoFile(null); return; }
    if (!["video/mp4", "video/webm"].includes(file.type) || file.size > 20 * 1024 * 1024) {
      setErrorMessage("MP4/WebM video 20 MB tak upload karein.");
      return;
    }
    const url = URL.createObjectURL(file);
    const checker = document.createElement("video");
    checker.preload = "metadata";
    checker.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (checker.duration < 8 || checker.duration > 10) {
        setErrorMessage("Product promo video 8 se 10 seconds ki honi chahiye.");
        setVideoFile(null);
      } else setVideoFile(file);
    };
    checker.onerror = () => {
      URL.revokeObjectURL(url);
      setErrorMessage("Video duration read nahi ho saki. MP4 ya WebM try karein.");
    };
    checker.src = url;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const parsedPrice = price ? Number(price) : null;
    const parsedSalePrice = salePrice ? Number(salePrice) : null;
    const parsedStock = Number(stock);
const parsedMinOrderQty = Number(minOrderQty);

    if (!title.trim()) {
      setErrorMessage("Product name required hai.");
      setLoading(false);
      return;
    }

    if (!slug.trim()) {
      setErrorMessage("Product slug required hai.");
      setLoading(false);
      return;
    }

    if (!stockCountry || !currencyCode) {
      setErrorMessage("Stock available country select karein.");
      setLoading(false);
      return;
    }

    if (parsedPrice !== null && parsedPrice < 0) {
      setErrorMessage("Price negative nahi ho sakti.");
      setLoading(false);
      return;
    }

    if (parsedSalePrice !== null && parsedSalePrice < 0) {
      setErrorMessage("Sale price negative nahi ho sakti.");
      setLoading(false);
      return;
    }

    if (
      parsedPrice !== null &&
      parsedSalePrice !== null &&
      parsedSalePrice > parsedPrice
    ) {
      setErrorMessage("Sale price regular price se zyada nahi ho sakti.");
      setLoading(false);
      return;
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setErrorMessage("Stock valid aur zero ya us se zyada hona chahiye.");
      setLoading(false);
      return;
    }

    if (
      !Number.isFinite(parsedMinOrderQty) ||
      parsedMinOrderQty < 1 ||
      !Number.isInteger(parsedMinOrderQty)
    ) {
      setErrorMessage("Minimum order quantity kam az kam 1 honi chahiye.");
      setLoading(false);
      return;
    }

    const uploadedFilePaths: string[] = [];
    const imageUrls: string[] = [];

    for (const file of imageFiles) {
      const rawExtension = file.name.split(".").pop()?.toLowerCase();
      const fileExtension =
        rawExtension && ["jpg", "jpeg", "png", "webp"].includes(rawExtension)
          ? rawExtension
          : "jpg";
      const filePath = `products/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        if (uploadedFilePaths.length) {
          await supabase.storage.from("product-images").remove(uploadedFilePaths);
        }
        setErrorMessage(`Image upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      uploadedFilePaths.push(filePath);
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      imageUrls.push(publicUrlData.publicUrl);
    }

    const imageUrl = imageUrls[0] ?? null;
    let videoUrl: string | null = null;
    let videoPath: string | null = null;
    if (videoFile) {
      const extension = videoFile.type === "video/webm" ? "webm" : "mp4";
      videoPath = `products/${slug.trim()}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const { error: videoUploadError } = await supabase.storage.from("product-videos").upload(videoPath, videoFile, { cacheControl: "3600", upsert: false, contentType: videoFile.type });
      if (videoUploadError) {
        if (uploadedFilePaths.length) await supabase.storage.from("product-images").remove(uploadedFilePaths);
        setErrorMessage(`Video upload failed: ${videoUploadError.message}`);
        setLoading(false);
        return;
      }
      videoUrl = supabase.storage.from("product-videos").getPublicUrl(videoPath).data.publicUrl;
    }

    const { error: insertError } = await supabase.from("products").insert({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      category: category.trim() || null,
      origin_country: originCountry || null,
      stock_country: stockCountry,
      currency_code: currencyCode,
      price: parsedPrice,
      sale_price: parsedSalePrice,
      stock: parsedStock,
  min_order_qty: parsedMinOrderQty,
      image: imageUrl,
      images: imageUrls,
      video_url: videoUrl,
      featured,
      status,
    });

    if (insertError) {
      if (uploadedFilePaths.length) {
        await supabase.storage.from("product-images").remove(uploadedFilePaths);
      }
      if (videoPath) await supabase.storage.from("product-videos").remove([videoPath]);

      if (insertError.code === "23505") {
        setErrorMessage(
          "Ye slug pehle se mojood hai. Product name ya slug change karein."
        );
      } else {
        setErrorMessage(insertError.message);
      }

      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
          Products
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Add New Product
        </h1>

        <p className="mt-2 text-slate-500">
          Add a new product with pricing, stock and image.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="text-sm font-bold text-slate-700"
            >
              Product Name *
            </label>

            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Wireless Earbuds"
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
              placeholder="wireless-earbuds"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Product URL: /products/{slug || "product-slug"}
            </p>
          </div>

          <div>
            <label
              htmlFor="category"
              className="text-sm font-bold text-slate-700"
            >
              Category
            </label>

            <input
              id="category"
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Electronics"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="originCountry" className="text-sm font-bold text-slate-700">Country of origin</label>
              <select id="originCountry" value={originCountry} onChange={(event) => setOriginCountry(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">Select origin country</option>
                {countries.map((country) => <option key={country.code} value={country.name}>{country.flag} {country.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="stockCountry" className="text-sm font-bold text-slate-700">Stock available in</label>
              <select id="stockCountry" required value={stockCountry} onChange={(event) => setStockCountry(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">Select stock country</option>
                {countries.map((country) => <option key={country.code} value={country.name}>{country.flag} {country.name}</option>)}
              </select>
              <p className="mt-1 text-xs text-slate-500">Price currency: {currencyCode || "select a country"}</p>
            </div>
          </div>

          <div>
            <label
              htmlFor="stock"
              className="text-sm font-bold text-slate-700"
            >
              Stock
            </label>

            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="minOrderQty"
              className="text-sm font-bold text-slate-700"
            >
              Minimum Order Quantity
            </label>

            <input
              id="minOrderQty"
              type="number"
              min="1"
              step="1"
              value={minOrderQty}
              onChange={(event) => setMinOrderQty(event.target.value)}
              placeholder="1"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="text-sm font-bold text-slate-700"
            >
              Price ({currencyCode || "—"})
            </label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="79.00"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="salePrice"
              className="text-sm font-bold text-slate-700"
            >
              Sale Price ({currencyCode || "—"})
            </label>

            <input
              id="salePrice"
              type="number"
              min="0"
              step="0.01"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}
              placeholder="69.00"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="productVideo" className="text-sm font-bold text-slate-700">Product Promo Video (8–10 sec)</label>
            <input id="productVideo" type="file" accept="video/mp4,video/webm" onChange={(event) => handleVideoChange(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-bold file:text-emerald-700" />
            <p className="mt-2 text-xs text-slate-500">MP4/WebM, 8–10 seconds, maximum 20 MB. Catalog mein product photo ki jagah muted video chalegi.</p>
            {videoFile && <p className="mt-2 text-xs font-semibold text-emerald-700">Selected: {videoFile.name}</p>}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="images"
              className="text-sm font-bold text-slate-700"
            >
              Product Images (up to 3)
            </label>

            <input
              id="images"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleImageChange(event.target.files)}
              className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-bold file:text-emerald-700 hover:file:bg-emerald-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG ya WebP. Maximum 3 images, har image 5 MB tak. Pehli image product cover hogi.
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-bold text-slate-700">
                Image Preview ({imagePreviews.length}/3)
              </p>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={preview} className="h-32 w-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img src={preview} alt={`Product preview ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
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
              placeholder="Write product details..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
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
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />

              <span className="text-sm font-bold text-slate-700">
                Featured Product
              </span>
            </label>
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
            onClick={() => router.push("/admin/products")}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading & Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
