"use client";

import { useTransition } from "react";
import { updateRequestStatus } from "@/app/admin/requests/actions";

type Props = {
  id: string;
  currentStatus: string;
};

export default function RequestStatusForm({
  id,
  currentStatus,
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-slate-900">
        Update Status
      </h2>

      <select
        defaultValue={currentStatus}
        disabled={pending}
        className="mt-4 w-full rounded-xl border border-slate-300 p-3"
        onChange={(e) => {
          const value = e.target.value;

          startTransition(async () => {
            await updateRequestStatus(id, value);
          });
        }}
      >
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Closed">Closed</option>
      </select>

      {pending && (
        <p className="mt-3 text-sm text-emerald-600">
          Updating...
        </p>
      )}
    </div>
  );
}