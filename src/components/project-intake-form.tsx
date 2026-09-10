"use client";

import { FormEvent, useState } from "react";
import { projectFields } from "@/modules/projects/catalog";

export function ProjectIntakeForm({ mode }: { mode: "request" | "create" }) {
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item = Object.fromEntries(form.entries());
    const key = mode === "request" ? "tekora_project_requests" : "tekora_user_projects";
    const current = JSON.parse(localStorage.getItem(key) ?? "[]");
    current.unshift({ ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(current));
    setSaved(true);
    event.currentTarget.reset();
  }

  return (
    <form className="projectIntakeForm" onSubmit={submit}>
      <div className="projectFormGrid">
        <label>Project title or idea<input name="title" required placeholder="e.g. Smart irrigation system" /></label>
        <label>Field<select name="field" required defaultValue=""><option value="" disabled>Select field</option>{projectFields.map(field => <option key={field}>{field}</option>)}</select></label>
        <label>Difficulty<select name="difficulty" defaultValue="Intermediate"><option>Simple</option><option>Intermediate</option><option>Advanced</option></select></label>
        <label>Budget<input name="budget" placeholder="e.g. GHS 500" /></label>
        <label className="full">What should the project do?<textarea name="description" required rows={5} placeholder="Describe the problem, idea or expected result." /></label>
        <label className="full">What help do you need?<textarea name="support" rows={4} placeholder="Components, circuit, code, MATLAB, fabrication, documentation, kit..." /></label>
      </div>
      <button className="premiumPrimaryCta" type="submit">{mode === "request" ? "Submit project request →" : "Create my project →"}</button>
      {saved ? <p className="projectFormSuccess">Saved for this prototype. We can connect this flow to the Tekora database next.</p> : null}
    </form>
  );
}
