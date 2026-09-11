"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { projectFields } from "@/modules/projects/catalog";

export function ProjectIntakeForm({ mode }: { mode: "request" | "create" }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [access, setAccess] = useState("FREE");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    if (mode === "request") {
      const budgetGhs = Number(form.get("budget") ?? 0);
      const response = await fetch("/api/v1/project-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(form.get("title") ?? ""),
          field: String(form.get("field") ?? ""),
          area: String(form.get("area") ?? "") || undefined,
          difficulty: String(form.get("difficulty") ?? "INTERMEDIATE").toUpperCase(),
          description: String(form.get("description") ?? ""),
          support: String(form.get("support") ?? "") || undefined,
          budget: budgetGhs > 0 ? Math.round(budgetGhs * 100) : undefined,
          currency: "GHS",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/sign-in");
          return;
        }
        setError(result?.error ?? "Could not submit project request.");
        setLoading(false);
        return;
      }
      setSaved(true);
      setLoading(false);
      event.currentTarget.reset();
      return;
    }

    const priceGhs = Number(form.get("price") ?? 0);
    const payload = {
      title: String(form.get("title") ?? ""),
      summary: String(form.get("description") ?? ""),
      description: String(form.get("support") ?? "") || undefined,
      field: String(form.get("field") ?? ""),
      area: String(form.get("area") ?? "") || undefined,
      difficulty: String(form.get("difficulty") ?? "INTERMEDIATE").toUpperCase(),
      modes: form.getAll("modes").map(String),
      access,
      price: access === "PAID" ? Math.round(priceGhs * 100) : undefined,
      currency: "GHS",
    };

    const response = await fetch("/api/v1/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        router.push("/sign-in");
        return;
      }
      if (response.status === 403) {
        router.push("/dashboard");
        return;
      }
      setError(result?.issues?.fieldErrors?.price?.[0] ?? result?.error ?? "Could not create project.");
      setLoading(false);
      return;
    }

    router.push(`/projects/manage/${result.project.id}`);
    router.refresh();
  }

  return (
    <form className="projectIntakeForm" onSubmit={submit}>
      <div className="projectFormGrid">
        <label>Project title or idea<input name="title" required placeholder="e.g. Smart irrigation system" /></label>
        <label>Field<select name="field" required defaultValue=""><option value="" disabled>Select field</option>{projectFields.map(field => <option key={field}>{field}</option>)}</select></label>
        <label>Area / specialization<input name="area" placeholder="e.g. Power Systems, Mobile Apps" /></label>
        <label>Difficulty<select name="difficulty" defaultValue="INTERMEDIATE"><option value="SIMPLE">Simple</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></label>
        <label>Budget (GHS)<input name="budget" type="number" min="0" step="0.01" placeholder="e.g. 500" /></label>
        <label className="full">What should the project do?<textarea name="description" required rows={5} placeholder="Describe the problem, idea or expected result." /></label>
        <label className="full">What help or detail should the project include?<textarea name="support" rows={4} placeholder="Components, circuit, code, MATLAB, fabrication, documentation, kit..." /></label>

        {mode === "create" ? (
          <>
            <fieldset className="full projectModeFieldset">
              <legend>How can people build it?</legend>
              <label><input type="checkbox" name="modes" value="GUIDED" defaultChecked /> Guided</label>
              <label><input type="checkbox" name="modes" value="DIY" /> DIY</label>
              <label><input type="checkbox" name="modes" value="KIT_READY" /> Kit-ready</label>
            </fieldset>

            <fieldset className="full projectModeFieldset">
              <legend>Project access</legend>
              <label><input type="radio" name="access" value="FREE" checked={access === "FREE"} onChange={() => setAccess("FREE")} /> Free</label>
              <label><input type="radio" name="access" value="PAID" checked={access === "PAID"} onChange={() => setAccess("PAID")} /> Paid</label>
            </fieldset>

            {access === "PAID" ? <label className="full">Project price (GHS)<input name="price" type="number" min="1" step="0.01" required placeholder="e.g. 50.00" /></label> : null}
          </>
        ) : null}
      </div>
      <button className="premiumPrimaryCta" type="submit" disabled={loading}>{loading ? (mode === "request" ? "Submitting request..." : "Creating project...") : mode === "request" ? "Submit project request →" : "Create project draft →"}</button>
      {error ? <p className="formError">{error}</p> : null}
      {saved ? <p className="projectFormSuccess">Request submitted. You can continue browsing while Tekora reviews the idea and budget.</p> : null}
    </form>
  );
}
