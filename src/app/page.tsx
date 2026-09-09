import Link from "next/link";

const pillars = [
  ["Learn", "Interactive courses taught by industry practitioners and skilled creators."],
  ["Build", "Hands-on labs, guided projects, teams and real-world challenges."],
  ["Connect", "Find people on your path, study circles, mentors and collaborators."],
  ["Prove", "Turn assessments, projects and practical evidence into a trusted portfolio."],
  ["Work", "Move from demonstrated skills into workshops, internships and industry opportunities."],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <nav className="nav">
          <strong>TEKORA</strong>
          <Link href="/dashboard">Open dashboard</Link>
        </nav>
        <div className="heroContent">
          <span className="eyebrow">PRACTICAL LEARNING NETWORK</span>
          <h1>Don&apos;t just graduate.<br />Graduate with skills.</h1>
          <p>Learn practical skills, build real projects, meet people on your path and prove what you can do.</p>
          <div className="actions">
            <Link className="primary" href="/dashboard">Start learning</Link>
            <a className="secondary" href="#platform">Explore Tekora</a>
          </div>
        </div>
      </section>
      <section id="platform" className="grid">
        {pillars.map(([title, copy]) => (
          <article key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
