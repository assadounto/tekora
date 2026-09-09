import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="authShell">
      <section className="authCard">
        <Link href="/" className="brandMark">TEKORA</Link>
        <div>
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Continue building your future.</h1>
          <p className="muted">Sign in to continue your courses, projects, circles and opportunities.</p>
        </div>

        <form className="authForm">
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" />
          </label>
          <button type="button" className="primaryButton">Sign in</button>
        </form>

        <p className="authFooter">
          New to Tekora? <Link href="/onboarding">Create your account</Link>
        </p>
      </section>
    </main>
  );
}
