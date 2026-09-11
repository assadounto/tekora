"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PurchaseButton({
  targetType,
  targetId,
  label,
  className = "premiumPrimaryCta",
}: {
  targetType: "PROJECT" | "COURSE";
  targetId: string;
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/v1/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) {
        router.push("/sign-in");
        return;
      }
      setError(result.error === "PAYSTACK_NOT_CONFIGURED" ? "Payment is not configured yet." : "Could not start checkout.");
      setLoading(false);
      return;
    }
    if (result.alreadyHasAccess && result.redirect) {
      router.push(result.redirect);
      router.refresh();
      return;
    }
    if (result.authorizationUrl) window.location.href = result.authorizationUrl;
  }

  return (
    <div>
      <button type="button" className={className} onClick={checkout} disabled={loading}>{loading ? "Opening secure checkout..." : label}</button>
      {error ? <p className="formError">{error}</p> : null}
    </div>
  );
}
