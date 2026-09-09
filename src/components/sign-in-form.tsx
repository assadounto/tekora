"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      redirect: false,
    });

    if (result?.error) {
      setError("We could not find a Tekora account with that email.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form className="authForm" onSubmit={submit}>
      <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
      {error ? <p className="formError">{error}</p> : null}
      <button disabled={loading} type="submit" className="primaryButton">
        {loading ? "Signing in..." : "Continue"}
      </button>
    </form>
  );
}
