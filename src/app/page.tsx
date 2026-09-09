import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const pillars = [
  ["Learn", "Interactive courses created by industry practitioners, skilled professionals and educators."],
  ["Build", "Hands-on labs, real projects, team challenges and practical evidence."],
  ["Connect", "Find people learning what you are learning, create circles and build with new friends."],
  ["Prove", "Turn assessments, projects and contributions into a trusted skills portfolio."],
  ["Work", "Move from demonstrated skills into mentorship, internships and industry opportunities."],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero premiumHero">
        <SiteHeader />
        <div className="heroContent">
          <span className="eyebrow">THE PRACTICAL LEARNING NETWORK</span>
          <h1>Learn what matters.<br />Build what proves it.</h1>
          <p>
            Tekora brings practical learning, creators, communities, projects and opportunities into one place.
          </p>
          <div className="actions">
            <Link className="primary" href="/onboarding">Create your Tekora profile</Link>
            <Link className="secondary" href="/dashboard">Explore the platform</Link>
          </div>
          <div className="heroProof">
            {["Courses","Labs","Projects","Circles","Creators","Careers"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section id="learn" className="introSection">
        <p className="eyebrow">ONE IDENTITY. MANY PATHS.</p>
        <h2>From student to builder, creator, founder or employer.</h2>
      </section>

      <section id="build" className="grid">
        {pillars.map(([title, copy]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section id="connect" className="networkSection">
        <div>
          <p className="eyebrow">TEKORA NETWORK</p>
          <h2>Find people on your path.</h2>
        </div>
        <p>
          Discover learners with similar goals, join study circles, form project teams and eventually build real ventures together.
        </p>
      </section>
    </main>
  );
}