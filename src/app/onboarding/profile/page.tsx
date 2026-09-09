import Link from "next/link";
import { OnboardingProfileForm } from "@/components/onboarding-profile-form";

type Props = { searchParams: Promise<{ role?: string }> };

export default async function ProfileSetupPage({ searchParams }: Props) {
  const params = await searchParams;
  const role = params.role ?? "learner";

  return (
    <main className="authShell">
      <section className="authCard wideCard">
        <Link href="/" className="brandMark">TEKORA</Link>
        <div>
          <p className="eyebrow">STEP 2 OF 4</p>
          <h1>Tell Tekora what you want to become.</h1>
          <p className="muted">Starting path: <strong>{role}</strong></p>
        </div>
        <OnboardingProfileForm role={role} />
      </section>
    </main>
  );
}