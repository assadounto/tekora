import Link from "next/link";

const roles = [
  {
    id: "learner",
    title: "Learner",
    description: "Learn practical skills, build projects, join circles and create a verified portfolio.",
  },
  {
    id: "creator",
    title: "Creator / Professional",
    description: "Teach from real-world experience, publish courses, mentor learners and run workshops.",
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Guide learners and teams, review projects and support the next generation of builders.",
  },
  {
    id: "employer",
    title: "Industry / Employer",
    description: "Discover skilled people, publish opportunities and sponsor practical challenges.",
  },
];

export default function OnboardingPage() {
  return (
    <main className="onboardingShell">
      <section className="onboardingHeader">
        <Link href="/" className="brandMark">TEKORA</Link>
        <span>Step 1 of 4</span>
      </section>

      <section className="onboardingContent">
        <p className="eyebrow">BUILD YOUR TEKORA IDENTITY</p>
        <h1>How do you want to start?</h1>
        <p className="muted">
          One account can grow into multiple roles later. Choose the path that best describes what you want today.
        </p>

        <div className="roleGrid">
          {roles.map((role) => (
            <Link href={"/onboarding/profile?role=" + role.id} className="roleCard" key={role.id}>
              <span className="roleDot" />
              <h2>{role.title}</h2>
              <p>{role.description}</p>
              <strong>Choose this path →</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
