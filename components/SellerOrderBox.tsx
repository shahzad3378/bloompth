"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type SellerOrderBoxProps = {
  productId: string;
  productTitle: string;
  unitPrice: number | null;
  stock: number;
  minimumOrderQty: number;
};

export default function SellerOrderBox({
  productId,
  productTitle,
  unitPrice,
  stock,
  minimumOrderQty,
}: SellerOrderBoxProps) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(
    Math.max(minimumOrderQty, 1)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const total = useMemo(() => {
    if (unitPrice === null) return null;
    return quantity * unitPrice;
  }, [quantity, unitPrice]);

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(minimumOrderQty, current - 1)
    );
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(stock, current + 1)
    );
  }

  function handleQuantityChange(value: number) {
    if (!Number.isFinite(value)) return;

    setQuantity(
      Math.min(
        stock,
        Math.max(minimumOrderQty, Math.floor(value))
      )
    );
  }

  const canOrder =
    stock > 0 &&
    quantity >= minimumOrderQty &&
    quantity <= stock &&
    unitPrice !== null &&
    total !== null;

  async function handlePlaceOrder() {
    if (!canOrder || unitPrice === null || total === null) {
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Please login to your seller account.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      !profile ||
      profile.role !== "seller"
    ) {
      setMessage("Seller account could not be verified.");
      setIsSubmitting(false);
      return;
    }

    if (profile.status !== "active") {
      setMessage(
        "Your seller account must be approved before placing orders."
      );
      setIsSubmitting(false);
      return;
    }

    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        seller_id: user.id,
        product_id: Number(productId),
        product_title: productTitle,
        quantity,
        unit_price: unitPrice,
        total_amount: total,
        status: "pending",
      });

    if (orderError) {
      setMessage(orderError.message);
      setIsSubmitting(false);
      return;
    }

    setMessage("Order placed successfully.");

    setTimeout(() => {
      router.push("/seller/orders");
      router.refresh();
    }, 700);
  }

  return (
    <div className="mt-7 border-t border-slate-200 pt-6">
      <div className="rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Order Quantity
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Minimum {minimumOrderQty} units
            </p>
          </div>

          <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= minimumOrderQty}
              className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={17} />
            </button>

            <input
              type="number"
              min={minimumOrderQty}
              max={stock}
              value={quantity}
              onChange={(event) =>
                handleQuantityChange(Number(event.target.value))
              }
              className="h-11 w-20 border-x border-slate-300 text-center font-black text-slate-950 outline-none"
            />

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= stock}
              className="flex h-11 w-11 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={17} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Order Total
            </p>

            <p className="mt-1 text-2xl font-black text-slate-950">
              {total !== null
                ? `AED ${total.toFixed(2)}`
                : "Contact for Price"}
            </p>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {quantity} units
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-xl p-4 text-sm font-bold ${
            message === "Order placed successfully."
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message === "Order placed successfully." && (
            <CheckCircle2 size={18} />
          )}

          {message}
        </div>
      )}

      <button
        type="button"
        disabled={!canOrder || isSubmitting}
        onClick={handlePlaceOrder}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <ShoppingCart size={19} />
        {isSubmitting ? "Placing Order..." : "Place Order"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-500">
        Available stock: {stock} units
      </p>
    </div>
  );
}
