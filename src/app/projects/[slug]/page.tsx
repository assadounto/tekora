import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getProject } from "@/modules/projects/catalog";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "./project-detail.css";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="projectDetailPage">
      <SiteHeader />

      <section className="projectDetailHero">
        <div className="projectDetailIntro">
          <Link className="projectBack" href="/projects">← Project marketplace</Link>
          <span className="projectEyebrow">{project.field} · {project.area}</span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="projectDetailBadges"><span>{project.difficulty}</span><span>{project.time}</span>{project.mode.map(mode => <span key={mode}>{mode}</span>)}</div>
          <div className="projectDetailActions"><Link className="premiumPrimaryCta" href="#phases">Start project →</Link><button type="button" className="premiumSecondaryCta">♡ Save project</button></div>
        </div>

        <aside className="projectKitSummary">
          <span className="projectEyebrow">PROJECT OPTIONS</span>
          <h2>Build it your way.</h2>
          <div className="projectOption"><strong>DIY</strong><p>Use the Tekora guide and source the parts yourself.</p></div>
          <div className="projectOption"><strong>Guided</strong><p>Follow the project phase by phase with explanations and checkpoints.</p></div>
          {project.kitPrice ? <div className="projectKitPrice"><small>Complete kit estimate</small><strong>GHS {project.kitPrice.toFixed(2)}</strong><Link href="#components">See kit contents →</Link></div> : null}
        </aside>
      </section>

      <section className="projectDetailLayout">
        <div className="projectDetailMain">
          <section className="projectSkillsSection">
            <span className="projectEyebrow">WHAT YOU WILL LEARN</span>
            <h2>Skills inside this project.</h2>
            <div className="projectSkillCards">{project.skills.map((skill, index) => <article key={skill}><span>{String(index + 1).padStart(2, "0")}</span><strong>{skill}</strong></article>)}</div>
          </section>

          <section id="phases" className="projectPhasesSection">
            <div className="projectDetailHeading"><div><span className="projectEyebrow">PROJECT PHASES</span><h2>Build it one clear step at a time.</h2></div><span>{project.phases.length} phases</span></div>
            <div className="projectPhaseList">
              {project.phases.map((phase, index) => (
                <article key={phase.title}>
                  <span className="projectPhaseNumber">{String(index + 1).padStart(2, "0")}</span>
                  <div><small>PHASE {index + 1}</small><h3>{phase.title}</h3><p>{phase.description}</p></div>
                  <span className="projectPhaseStatus">Start →</span>
                </article>
              ))}
            </div>
          </section>

          {project.components?.length ? (
            <section id="components" className="projectComponentsSection">
              <span className="projectEyebrow">COMPONENTS / MATERIALS</span>
              <h2>What you need to build it.</h2>
              <div className="projectComponentGrid">{project.components.map((component, index) => <div key={component}><span>✓</span><strong>{component}</strong><small>Item {index + 1}</small></div>)}</div>
              {project.kitPrice ? <div className="projectKitCallout"><div><strong>Want everything together?</strong><p>Get the components matched to this Tekora project instead of sourcing them one by one.</p></div><Link href="#" className="premiumPrimaryCta">Get complete kit →</Link></div> : null}
            </section>
          ) : null}

          <section className="projectSupportSection">
            <span className="projectEyebrow">TEKORA PROJECT SUPPORT</span>
            <h2>Don’t just copy the build. Understand it.</h2>
            <div className="projectSupportGrid">
              <article><span>AI</span><h3>Ask about the project</h3><p>Understand components, calculations, wiring, code and design decisions.</p></article>
              <article><span>DOC</span><h3>Document your work</h3><p>Organize objectives, methodology, testing, results and references.</p></article>
              <article><span>DEF</span><h3>Prepare to defend it</h3><p>Practice explaining how the system works, limitations and future improvements.</p></article>
            </div>
          </section>
        </div>

        <aside className="projectDetailRail">
          <div className="projectRailCard"><span className="projectEyebrow">PROJECT SNAPSHOT</span><div><small>Field</small><strong>{project.field}</strong></div><div><small>Area</small><strong>{project.area}</strong></div><div><small>Difficulty</small><strong>{project.difficulty}</strong></div><div><small>Estimated time</small><strong>{project.time}</strong></div></div>
          <div className="projectRailCard"><span className="projectEyebrow">NEED SOMETHING DIFFERENT?</span><p>Describe the project you want, your programme and what kind of help you need.</p><Link href="/projects/request">Request a project →</Link></div>
        </aside>
      </section>
    </main>
  );
}
