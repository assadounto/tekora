"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["REVIEWING", "APPROVED", "DECLINED", "FULFILLED"] as const;

type Status = "SUBMITTED" | typeof statuses[number];

function label(value: string) {
  return value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export function AdminRequestStatus({ requestId, currentStatus }: { requestId: string; currentStatus: Status }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function update(status: typeof statuses[number]) {
    setLoading(status);
    setError("");
    const response = await fetch(`/api/v1/admin/project-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Could not update request.");
      setLoading(null);
      return;
    }
    setLoading(null);
    router.refresh();
  }

  return <div><div className="adminRequestActions">{statuses.map(status => <button className={currentStatus === status ? "active" : ""} type="button" onClick={() => update(status)} disabled={Boolean(loading)} key={status}>{loading === status ? "Saving..." : label(status)}</button>)}</div>{error ? <p className="formError">{error}</p> : null}</div>;
}
