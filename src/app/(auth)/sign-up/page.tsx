import Link from "next/link";
import "../../auth-experience.css";

const roles = [
  { id: "learner", icon: "L", title: "Learner", description: "Learn practical skills, build projects, join circles and create a skill identity that grows with you." },
  { id: "creator", icon: "C", title: "Creator / Professional", description: "Teach from experience, publish courses, mentor learners and earn from practical knowledge." },
  { id: "mentor", icon: "M", title: "Mentor", description: "Guide learners and teams, review project work and help people move from theory to capability." },
  { id: "employer", icon: "I", title: "Industry / Employer", description: "Discover talent, publish opportunities and connect with people through demonstrated skills." },
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
          <p>
            One Tekora account can grow with you. A learner can become a creator, mentor, founder or employer later without starting over.
          </p>
        </div>

        <div className="tekoraRoleGrid">
          {roles.map((role) => (
            <Link href={`/onboarding/profile?role=${role.id}`} className="tekoraRoleCard" key={role.id}>
              <span className="tekoraRoleIcon">{role.icon}</span>
              <div>
                <h2>{role.title}</h2>
                <p>{role.description}</p>
              </div>
              <span className="tekoraRoleArrow">→</span>
            </Link>
          ))}
        </div>

        <p className="tekoraRoleBottom">
          By continuing, you agree to Tekora’s future platform terms and privacy policy. <Link href="/sign-in">I already have a profile</Link>.
        </p>
      </section>
    </main>
  );
}
