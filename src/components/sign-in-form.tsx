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
      email: String(form.get("email") ?? "").trim().toLowerCase(),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form className="authForm" onSubmit={submit}>
      <label>
        Email address
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </label>
      <label>
        Password
        <input name="password" type="password" required autoComplete="current-password" placeholder="Enter your password" />
      </label>
      {error ? <p className="formError">{error}</p> : null}
      <button disabled={loading} type="submit" className="primaryButton">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
