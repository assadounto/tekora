"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProjectPublishButton({ projectId, slug, published }: { projectId: string; slug: string; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function publish() {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/v1/projects/${projectId}/publish`, { method: "POST" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Could not publish project.");
      setLoading(false);
      return;
    }
    router.push(`/projects/${slug}`);
    router.refresh();
  }

  if (published) {
    return <button type="button" className="premiumPrimaryCta" onClick={() => router.push(`/projects/${slug}`)}>View public project →</button>;
  }

  return (
    <div>
      <button type="button" className="premiumPrimaryCta" onClick={publish} disabled={loading}>{loading ? "Publishing..." : "Publish to marketplace →"}</button>
      {error ? <p className="formError">{error}</p> : null}
    </div>
  );
}
