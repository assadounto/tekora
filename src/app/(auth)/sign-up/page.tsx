import Link from "next/link";
import { RegisterForm } from "@/components/register-form";
import "../../auth-experience.css";

export default function SignUpPage() {
  return (
    <main className="tekoraAuthPage">
      <section className="tekoraAuthStory">
        <Link href="/" className="tekoraAuthBrand">
          <span className="tekoraAuthBrandMark">T</span>
          <span>Tekora</span>
        </Link>

        <div className="tekoraAuthStoryBody">
          <span className="tekoraAuthEyebrow">CREATE YOUR TEKORA ACCOUNT</span>
          <h1>Find projects.<span>Build real skills.</span></h1>
          <p>Create one account for your project library, courses, purchases and project requests. Tekora marketplace content is published by the admin.</p>

          <div className="tekoraAuthProof">
            <article><span>01</span><strong>Browse</strong><small>Explore practical projects and structured courses.</small></article>
            <article><span>02</span><strong>Unlock</strong><small>Add free content or securely buy paid access.</small></article>
            <article><span>03</span><strong>Build</strong><small>Keep everything connected to your Tekora account.</small></article>
          </div>
        </div>

        <span className="tekoraAuthStoryFooter">Projects first. Practical by design.</span>
      </section>

      <section className="tekoraAuthPanel">
        <div className="tekoraAuthCard">
          <div className="tekoraAuthCardHeader">
            <span className="tekoraAuthEyebrow">CREATE ACCOUNT</span>
            <h2>Start with the basics.</h2>
            <p>You can add your university, programme and interests later from your account.</p>
          </div>

          <RegisterForm />

          <p className="tekoraAuthFootnote">Already have an account? <Link href="/sign-in">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
