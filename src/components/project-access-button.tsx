"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProjectAccessButton({
  projectId,
  slug,
  access,
  price,
  currency,
  loggedIn,
  hasAccess,
  isOwner,
}: {
  projectId: string;
  slug: string;
  access: "FREE" | "PAID";
  price: number | null;
  currency: string;
  loggedIn: boolean;
  hasAccess: boolean;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isOwner) {
    return <Link className="premiumPrimaryCta" href={`/projects/manage/${projectId}`}>Manage project →</Link>;
  }

  if (hasAccess) {
    return <Link className="premiumPrimaryCta" href="/dashboard#my-projects">Open in dashboard →</Link>;
  }

  if (!loggedIn) {
    return <Link className="premiumPrimaryCta" href="/sign-in">Sign in to get project →</Link>;
  }

  if (access === "PAID") {
    return <Link className="premiumPrimaryCta" href={`/projects/${slug}/checkout`}>Buy project · {currency} {((price ?? 0) / 100).toFixed(2)} →</Link>;
  }

  async function acquire() {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/v1/projects/${projectId}/access`, { method: "POST" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Could not add this project.");
      setLoading(false);
      return;
    }
    router.push("/dashboard#my-projects");
    router.refresh();
  }

  return (
    <div>
      <button className="premiumPrimaryCta" type="button" onClick={acquire} disabled={loading}>{loading ? "Adding project..." : "Add free project →"}</button>
      {error ? <p className="formError">{error}</p> : null}
    </div>
  );
}
