import Link from "next/link";
import "../../auth-experience.css";

const roles = [
  { id: "learner", icon: "L", title: "Student / Learner", description: "Browse projects and courses, unlock what you need, request project ideas and build practical skills." },
  { id: "mentor", icon: "M", title: "Mentor / Professional", description: "Join Tekora as an experienced professional who can support learners and project communities without publishing marketplace content." },
  { id: "employer", icon: "I", title: "Industry / Employer", description: "Discover practical talent, connect with learners and follow the skills people prove through projects." },
];

export default function SignUpPage() {
  return (
    <main className="tekoraRolePage">
      <header className="tekoraRoleTopbar">
        <Link href="/" className="tekoraAuthBrand">
          <span className="tekoraAuthBrandMark">T</span>
          <span>Tekora</span>
        </Link>
        <span>Already have an account? <Link href="/sign-in">Sign in</Link></span>
      </header>

      <section className="tekoraRoleMain">
        <div className="tekoraRoleIntro">
          <span className="tekoraAuthEyebrow">CREATE YOUR TEKORA IDENTITY</span>
          <h1>Start with who you are today.</h1>
          <p>One Tekora account keeps your projects, courses and progress together. Marketplace projects and courses are published by Tekora.</p>
        </div>

        <div className="tekoraRoleGrid">
          {roles.map((role) => (
            <Link href={`/onboarding/profile?role=${role.id}`} className="tekoraRoleCard" key={role.id}>
              <span className="tekoraRoleIcon">{role.icon}</span>
              <div><h2>{role.title}</h2><p>{role.description}</p></div>
              <span className="tekoraRoleArrow">→</span>
            </Link>
          ))}
        </div>

        <p className="tekoraRoleBottom">By continuing, you agree to Tekora’s future platform terms and privacy policy. <Link href="/sign-in">I already have a profile</Link>.</p>
      </section>
    </main>
  );
}
