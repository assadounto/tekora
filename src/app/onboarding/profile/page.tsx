import Link from "next/link";

type Props = {
  searchParams: Promise<{ role?: string }>;
};

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

        <form className="authForm twoColumnForm">
          <label>
            Full name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Username
            <input type="text" placeholder="tekora-handle" />
          </label>
          <label>
            Institution or company
            <input type="text" placeholder="Accra Technical University" />
          </label>
          <label>
            Field
            <input type="text" placeholder="Electrical Engineering" />
          </label>
          <label className="fullSpan">
            What do you want to achieve?
            <textarea placeholder="Example: I want to become strong in embedded systems, build real projects and find an internship." rows={5} />
          </label>
          <Link href="/dashboard" className="primaryButton fullSpan centeredButton">Continue to Tekora</Link>
        </form>
      </section>
    </main>
  );
}
