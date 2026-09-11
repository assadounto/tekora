"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        result?.details?.fieldErrors?.password?.[0] ??
        result?.details?.fieldErrors?.email?.[0] ??
        result?.details?.fieldErrors?.name?.[0] ??
        (result?.error === "EMAIL_IN_USE" ? "An account with this email already exists." : null) ??
        "We could not create your account.";
      setError(message);
      setLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      window.location.href = "/sign-in?created=1";
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form className="authForm" onSubmit={submit}>
      <label>
        Full name
        <input name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your full name" />
      </label>
      <label>
        Email address
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </label>
      <label>
        Password
        <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
      </label>
      <label>
        Confirm password
        <input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" placeholder="Enter password again" />
      </label>
      <p className="authPasswordHint">Use at least 8 characters with a letter and a number.</p>
      {error ? <p className="formError">{error}</p> : null}
      <button disabled={loading} type="submit" className="primaryButton">
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
