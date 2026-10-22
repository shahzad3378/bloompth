"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, ImagePlus, Loader2, PackageSearch, X } from "lucide-react";
import { countries } from "@/lib/countries";
import { supabase } from "@/lib/supabase";

type FormState = {
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  productName: string;
  quantity: string;
  country: string;
  city: string;
  message: string;
};
type CatalogProduct = { id: number; title: string };
type RequestProductFormProps = { initialCountry: string };
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function RequestProductForm({ initialCountry }: RequestProductFormProps) {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product") ?? "";
  const productIdFromUrl = searchParams.get("productId") ?? "";
  const [requestKind, setRequestKind] = useState<"catalog" | "custom">(productIdFromUrl ? "catalog" : "custom");
  const [selectedProductId, setSelectedProductId] = useState(productIdFromUrl);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [form, setForm] = useState<FormState>({
    customerName: "", companyName: "", email: "", phone: "",
    productName: productFromUrl, quantity: "1", country: initialCountry, city: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      const { data } = await supabase.from("products").select("id, title").eq("status", "active").order("title");
      if (!active) return;
      const options = (data ?? []) as CatalogProduct[];
      setCatalogProducts(options);
      const fromUrl = options.find((item) => String(item.id) === productIdFromUrl);
      if (fromUrl) setForm((current) => ({ ...current, productName: fromUrl.title }));
    };
    void loadProducts();
    return () => { active = false; };
  }, [productIdFromUrl]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const chooseKind = (kind: "catalog" | "custom") => {
    setRequestKind(kind);
    setPhotoFile(null);
    setErrorMessage("");
    if (kind === "catalog") {
      const match = catalogProducts.find((item) => String(item.id) === selectedProductId);
      setForm((current) => ({ ...current, productName: match?.title ?? "" }));
    } else {
      setSelectedProductId("");
      setForm((current) => ({ ...current, productName: productFromUrl && !productIdFromUrl ? productFromUrl : "" }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setErrorMessage("");

    const quantity = Number(form.quantity);
    const selectedProduct = catalogProducts.find((item) => String(item.id) === selectedProductId);
    const productName = requestKind === "catalog" ? selectedProduct?.title ?? "" : form.productName.trim();

    if (!form.customerName.trim() || !form.phone.trim() || !form.country.trim() || !form.city.trim() || !productName) {
      setErrorMessage("Please complete your name, phone, country, city and product details.");
      setSubmitting(false);
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      setErrorMessage("Quantity must be at least 1.");
      setSubmitting(false);
      return;
    }
    if (requestKind === "custom" && !form.message.trim()) {
      setErrorMessage("Please describe the custom product, including its size, material, colour or specifications.");
      setSubmitting(false);
      return;
    }
    if (requestKind === "custom" && !photoFile) {
      setErrorMessage("Please upload a product photo for a custom product request.");
      setSubmitting(false);
      return;
    }
    if (photoFile && (!ACCEPTED_IMAGE_TYPES.includes(photoFile.type) || photoFile.size > MAX_IMAGE_SIZE)) {
      setErrorMessage("Upload a JPG, PNG or WebP image up to 5 MB.");
      setSubmitting(false);
      return;
    }

    let imagePath: string | null = null;
    if (photoFile) {
      const extension = photoFile.type === "image/jpeg" ? "jpg" : photoFile.type === "image/png" ? "png" : "webp";
      imagePath = `incoming/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("product-request-images").upload(imagePath, photoFile, {
        contentType: photoFile.type,
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) {
        setErrorMessage(`Product photo could not be uploaded: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }
    }

    const { error } = await supabase.from("product_requests").insert({
      customer_name: form.customerName.trim(),
      company_name: form.companyName.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim(),
      product_id: requestKind === "catalog" && selectedProduct ? selectedProduct.id : null,
      product_name: productName,
      quantity,
      country: form.country.trim(),
      city: form.city.trim(),
      message: form.message.trim() || null,
      image_path: imagePath,
      status: "New",
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    setPhotoFile(null);
    setForm({
      customerName: "", companyName: "", email: "", phone: "",
      productName: productFromUrl, quantity: "1", country: initialCountry, city: "", message: "",
    });
    setSelectedProductId(productIdFromUrl);
    setRequestKind(productIdFromUrl ? "catalog" : "custom");
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white"><CheckCircle2 size={30} /></div>
        <h2 className="mt-5 text-2xl font-black text-slate-950">Request submitted successfully</h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">Thank you. The BloomPath team will review your request and contact you using the information provided.</p>
        <button type="button" onClick={() => setSuccess(false)} className="mt-6 rounded-xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-emerald-600">Submit Another Request</button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><PackageSearch size={24} /></div>
        <div><h2 className="text-xl font-black text-slate-950">Product Requirement</h2><p className="mt-1 text-sm leading-6 text-slate-500">Complete the form and our team will contact you.</p></div>
      </div>

      <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-5 sm:grid-cols-2">
        <label><span className="text-sm font-bold text-slate-700">Full Name *</span><input required type="text" value={form.customerName} onChange={(event) => updateField("customerName", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Your full name" /></label>
        <label><span className="text-sm font-bold text-slate-700">Phone / WhatsApp *</span><input required type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" placeholder="+971 50 123 4567" /></label>
        <label><span className="text-sm font-bold text-slate-700">Company Name</span><input type="text" value={form.companyName} onChange={(event) => updateField("companyName", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Your business name" /></label>
        <label><span className="text-sm font-bold text-slate-700">Email</span><input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" placeholder="name@example.com" /></label>

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-bold text-slate-700">What product do you need? *</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${requestKind === "catalog" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
              <input type="radio" name="request-kind" checked={requestKind === "catalog"} onChange={() => chooseKind("catalog")} className="mt-1 accent-emerald-600" />
              <span><b className="block text-sm text-slate-900">A product in the BloomPath catalog</b><small className="mt-1 block text-slate-500">Choose the exact listed product.</small></span>
            </label>
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${requestKind === "custom" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
              <input type="radio" name="request-kind" checked={requestKind === "custom"} onChange={() => chooseKind("custom")} className="mt-1 accent-emerald-600" />
              <span><b className="block text-sm text-slate-900">A custom product / not listed</b><small className="mt-1 block text-slate-500">Add full specifications and upload a photo.</small></span>
            </label>
          </div>
        </fieldset>

        {requestKind === "catalog" ? (
          <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Select catalog product *</span><select required value={selectedProductId} onChange={(event) => { const id = event.target.value; setSelectedProductId(id); updateField("productName", catalogProducts.find((item) => String(item.id) === id)?.title ?? ""); }} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"><option value="">Choose a product</option>{catalogProducts.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}</select>{productIdFromUrl && <small className="mt-1 block text-slate-500">The product you selected is prefilled. Confirm it before submitting.</small>}</label>
        ) : (
          <>
            <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Custom Product Name *</span><input required type="text" value={form.productName} onChange={(event) => updateField("productName", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" placeholder="What product should we source?" /></label>
            <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Product photo *</span><span className="mt-1 block text-sm text-slate-500">Upload a JPG, PNG or WebP image, up to 5 MB.</span><span className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4"><ImagePlus className="shrink-0 text-emerald-700" size={20} /><input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)} className="min-w-0 flex-1 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-bold file:text-emerald-700" />{photoFile && <button type="button" aria-label="Remove photo" onClick={() => setPhotoFile(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={17} /></button>}</span>{photoFile && <small className="mt-1 block truncate text-slate-600">Selected: {photoFile.name}</small>}</label>
          </>
        )}

        <label><span className="text-sm font-bold text-slate-700">Quantity *</span><input required type="number" min="1" value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /></label>
        <label><span className="text-sm font-bold text-slate-700">Country *</span><select required value={form.country} onChange={(event) => updateField("country", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"><option value="">Select country</option>{countries.map((country) => <option key={country.code} value={country.name}>{country.name}</option>)}</select><small className="mt-1 block text-slate-500">Preselected from your location; you can change it.</small></label>
        <label><span className="text-sm font-bold text-slate-700">City *</span><input required type="text" value={form.city} onChange={(event) => updateField("city", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Your city" /></label>

        <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">{requestKind === "custom" ? "Full Product Specifications *" : "Additional Details"}</span><textarea required={requestKind === "custom"} rows={5} value={form.message} onChange={(event) => updateField("message", event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" placeholder={requestKind === "custom" ? "Describe size, material, colour, model, target price and any other requirements." : "Tell us about target price or delivery requirements."} /></label>
      </div>

      {errorMessage && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</div>}
      <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? <><Loader2 size={18} className="animate-spin" />Submitting Request</> : <>Submit Product Request<ArrowRight size={18} /></>}
      </button>
    </form>
  );
}
