import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";
import "../../auth-experience.css";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const params = await searchParams;

  return (
    <main className="tekoraAuthPage">
      <section className="tekoraAuthStory">
        <Link href="/" className="tekoraAuthBrand">
          <span className="tekoraAuthBrandMark">T</span>
          <span>Tekora</span>
        </Link>

        <div className="tekoraAuthStoryBody">
          <span className="tekoraAuthEyebrow">WELCOME BACK</span>
          <h1>Your projects and courses.<span>One Tekora account.</span></h1>
          <p>Sign in to continue your project library, purchased courses, requests and progress from any device.</p>

          <div className="tekoraAuthProof">
            <article><span>01</span><strong>Projects</strong><small>Free and purchased builds stay in your library.</small></article>
            <article><span>02</span><strong>Courses</strong><small>Keep your learning and progress attached to your account.</small></article>
            <article><span>03</span><strong>Requests</strong><small>Submit project ideas and track what you asked Tekora to build.</small></article>
          </div>
        </div>

        <span className="tekoraAuthStoryFooter">Learn. Build. Own the skill.</span>
      </section>

      <section className="tekoraAuthPanel">
        <div className="tekoraAuthCard">
          <div className="tekoraAuthCardHeader">
            <span className="tekoraAuthEyebrow">SIGN IN</span>
            <h2>Welcome back.</h2>
            <p>Enter the email and password for your Tekora account.</p>
          </div>

          {params.created === "1" ? <div className="tekoraCreatedNotice">Account created. Sign in with your email and password.</div> : null}

          <SignInForm />

          <p className="tekoraAuthFootnote">New to Tekora? <Link href="/sign-up">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
