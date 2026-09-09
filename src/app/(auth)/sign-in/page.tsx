import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="authShell">
      <section className="authCard">
        <Link href="/" className="brandMark">TEKORA</Link>
        <div>
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Continue building your future.</h1>
          <p className="muted">Use your Tekora email to continue to your learning identity.</p>
        </div>
        <SignInForm />
        <p className="authFooter">New to Tekora? <Link href="/onboarding">Create your account</Link></p>
      </section>
    </main>
  );
}