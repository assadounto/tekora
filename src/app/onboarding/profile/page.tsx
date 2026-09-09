import Link from "next/link";
import { OnboardingProfileForm } from "@/components/onboarding-profile-form";
import "../../auth-experience.css";

type Props = { searchParams: Promise<{ role?: string }> };

const roleCopy: Record<string, { title: string; note: string }> = {
  learner: { title: "Build your learner identity.", note: "Tell Tekora what you want to learn, build and become." },
  creator: { title: "Build your creator identity.", note: "Tell learners what you know, what you do and where your expertise comes from." },
  mentor: { title: "Build your mentor identity.", note: "Share the field you can guide people in and the outcomes you want to help them reach." },
  employer: { title: "Build your industry identity.", note: "Tell Tekora what your organization needs and the talent you want to discover." },
};

export default async function ProfileSetupPage({ searchParams }: Props) {
  const params = await searchParams;
  const role = params.role ?? "learner";
  const copy = roleCopy[role] ?? roleCopy.learner;

  return (
    <main className="tekoraAuthPage">
      <section className="tekoraAuthStory">
        <Link href="/" className="tekoraAuthBrand">
          <span className="tekoraAuthBrandMark">T</span>
          <span>Tekora</span>
        </Link>

        <div className="tekoraAuthStoryBody">
          <span className="tekoraAuthEyebrow">YOUR TEKORA IDENTITY</span>
          <h1>{copy.title}<span>Make it yours.</span></h1>
          <p>{copy.note}</p>

          <div className="tekoraAuthProof">
            <article><span>01</span><strong>Your path</strong><small>Field, institution and current level.</small></article>
            <article><span>02</span><strong>Your skills</strong><small>What you already know and can do.</small></article>
            <article><span>03</span><strong>Your direction</strong><small>What you want Tekora to help you achieve.</small></article>
          </div>
        </div>

        <span className="tekoraAuthStoryFooter">You can update these details as your path changes.</span>
      </section>

      <section className="tekoraAuthPanel">
        <div className="tekoraAuthCard wide">
          <div className="tekoraAuthCardHeader">
            <Link href="/sign-up" className="tekoraAuthEyebrow">← CHANGE STARTING PATH</Link>
            <h2>Tell us a little about you.</h2>
            <p>Starting as <strong>{role}</strong>. You can add more roles later.</p>
          </div>
          <OnboardingProfileForm role={role} />
          <p className="tekoraAuthFootnote">Already have a Tekora identity? <Link href="/sign-in">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
