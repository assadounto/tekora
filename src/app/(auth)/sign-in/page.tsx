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
          <span className="tekoraAuthEyebrow">WELCOME BACK TO YOUR LEARNING IDENTITY</span>
          <h1>Keep learning.<span>Keep building.</span></h1>
          <p>
            Your courses, projects, skills, circles and opportunities live together on Tekora—so your progress follows you wherever you go next.
          </p>

          <div className="tekoraAuthProof">
            <article><span>⌁</span><strong>Learn by doing</strong><small>Practical courses, projects and checkpoints.</small></article>
            <article><span>◎</span><strong>Build your identity</strong><small>Skills and evidence that grow with you.</small></article>
            <article><span>↗</span><strong>Find opportunity</strong><small>People, workshops, internships and work.</small></article>
          </div>
        </div>

        <span className="tekoraAuthStoryFooter">Learn. Build. Prove. Work.</span>
      </section>

      <section className="tekoraAuthPanel">
        <div className="tekoraAuthCard">
          <div className="tekoraAuthCardHeader">
            <span className="tekoraAuthEyebrow">SIGN IN</span>
            <h2>Continue your Tekora journey.</h2>
            <p>Use the email attached to your Tekora identity.</p>
          </div>

          {params.created === "1" ? (
            <div className="tekoraCreatedNotice">Your Tekora identity is ready. Sign in to continue.</div>
          ) : null}

          <SignInForm />

          <div className="tekoraAuthDivider">OR CONTINUE WITH</div>
          <div className="tekoraSocialButtons">
            <button className="tekoraSocialButton" type="button"><span>G</span> Google</button>
            <button className="tekoraSocialButton" type="button"><span>⌘</span> GitHub</button>
          </div>

          <p className="tekoraAuthFootnote">
            New to Tekora? <Link href="/sign-up">Create your free profile</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
