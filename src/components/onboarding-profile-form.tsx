"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const roleMap: Record<string, string> = {
  learner: "LEARNER",
  creator: "CREATOR",
  mentor: "MENTOR",
  employer: "EMPLOYER",
  professional: "PROFESSIONAL",
};

export function OnboardingProfileForm({ role }: { role: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      name: String(form.get("name") ?? ""),
      username: String(form.get("username") ?? ""),
      roles: [roleMap[role] ?? "LEARNER"],
      institution: String(form.get("institution") ?? "") || undefined,
      program: String(form.get("program") ?? "") || undefined,
      level: String(form.get("level") ?? "") || undefined,
      goal: String(form.get("goal") ?? "") || undefined,
      skills: String(form.get("skills") ?? "").split(",").map(v => v.trim()).filter(Boolean),
      interests: String(form.get("interests") ?? "").split(",").map(v => v.trim()).filter(Boolean),
    };

    const response = await fetch("/api/v1/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.message ?? "We could not create your Tekora identity.");
      setLoading(false);
      return;
    }

    router.push("/sign-in?created=1");
  }

  return (
    <form className="authForm twoColumnForm" onSubmit={submit}>
      <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
      <label>Full name<input name="name" required placeholder="Your name" /></label>
      <label>Username<input name="username" required placeholder="tekora-handle" /></label>
      <label>Institution or company<input name="institution" placeholder="Accra Technical University" /></label>
      <label>Field / program<input name="program" placeholder="Electrical Engineering" /></label>
      <label>Level<input name="level" placeholder="Final year, professional..." /></label>
      <label className="fullSpan">Skills you already have<input name="skills" placeholder="Arduino, React, Solar PV" /></label>
      <label className="fullSpan">What do you want to learn?<input name="interests" placeholder="IoT, Embedded Systems, AI" /></label>
      <label className="fullSpan">What do you want to achieve?<textarea name="goal" rows={5} placeholder="I want to build real projects and find an internship." /></label>
      {error ? <p className="formError fullSpan">{error}</p> : null}
      <button disabled={loading} className="primaryButton fullSpan" type="submit">
        {loading ? "Creating your Tekora identity..." : "Create my Tekora identity"}
      </button>
    </form>
  );
}
