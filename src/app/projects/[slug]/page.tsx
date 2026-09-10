import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProjectPhaseTracker, ProjectSaveButton, ProjectStartButton } from "@/components/project-workspace-controls";
import { getProject } from "@/modules/projects/catalog";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "./project-detail.css";

function projectResources(field: string) {
  const value = field.toLowerCase();
  if (value.includes("software")) {
    return [
      ["ARCH", "System architecture", "Plan pages, data flow, APIs and responsibilities before coding."],
      ["CODE", "Starter code", "Use the guide structure to build the application in manageable parts."],
      ["API", "Integration notes", "Understand external services, payloads and error handling."],
      ["TEST", "Testing checklist", "Verify the important user journeys before presenting the project."],
      ["DOC", "Report & defense", "Explain requirements, architecture, implementation, testing and limitations."],
    ];
  }
  if (value.includes("mechanical") || value.includes("carpentry") || value.includes("civil")) {
    return [
      ["DRAW", "Working drawings", "Use measurements, layout and assembly references before fabrication."],
      ["MAT", "Material list", "Review the materials, quantities and tools required for the build."],
      ["BUILD", "Assembly guide", "Follow the construction sequence and important checkpoints."],
      ["TEST", "Inspection checklist", "Check stability, dimensions, movement or structural performance."],
      ["DOC", "Report & presentation", "Document design choices, process, results and improvements."],
    ];
  }
  return [
    ["BLK", "Block diagram", "Understand the complete system before wiring individual components."],
    ["WIRE", "Circuit / wiring", "Follow the connection plan and verify power before switching on."],
    ["CODE", "Controller code", "Build and understand the firmware one function at a time."],
    ["SIM", "Simulation support", "Use MATLAB, Simulink, Proteus or calculations where the project needs them."],
    ["DOC", "Report & defense", "Connect objectives, methodology, results, limitations and future improvements."],
  ];
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const resources = projectResources(project.field);

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
          <div className="projectDetailActions"><ProjectStartButton slug={project.slug} /><ProjectSaveButton slug={project.slug} /><Link className="projectMyLink" href="/projects/my">My Projects →</Link></div>
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
            <ProjectPhaseTracker slug={project.slug} phases={project.phases} />
          </section>

          {project.components?.length ? (
            <section id="components" className="projectComponentsSection">
              <div className="projectDetailHeading"><div><span className="projectEyebrow">BILL OF MATERIALS</span><h2>What you need to build it.</h2></div><span>{project.components.length} line items</span></div>
              <div className="projectBomTable">
                <div className="projectBomHead"><span>Item</span><span>Qty</span><span>Kit status</span></div>
                {project.components.map((component) => <div className="projectBomRow" key={component}><strong>{component}</strong><span>1</span><span>{project.kitPrice ? "Included" : "Source locally"}</span></div>)}
              </div>
              <div className="projectBomNote">Individual component prices will come from the Tekora Store inventory rather than using made-up estimates.</div>
              {project.kitPrice ? <div className="projectKitCallout"><div><strong>Want everything together?</strong><p>Get the components matched to this Tekora project instead of sourcing them one by one.</p></div><Link href="#" className="premiumPrimaryCta">Get complete kit · GHS {project.kitPrice.toFixed(2)} →</Link></div> : null}
            </section>
          ) : null}

          <section className="projectResourcesSection">
            <span className="projectEyebrow">PROJECT RESOURCES</span>
            <h2>Everything around the build.</h2>
            <p className="projectSectionIntro">The workspace keeps the technical resources beside the project instead of scattering them across different pages.</p>
            <div className="projectResourceGrid">
              {resources.map(([code, title, copy]) => <article key={title}><span>{code}</span><div><strong>{title}</strong><p>{copy}</p></div><em>Guide</em></article>)}
            </div>
          </section>

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
          <div className="projectRailCard projectRailAction"><span className="projectEyebrow">YOUR WORKSPACE</span><p>Save this project, start it and track each build phase locally on this device.</p><Link href="/projects/my">Open My Projects →</Link></div>
          <div className="projectRailCard"><span className="projectEyebrow">NEED SOMETHING DIFFERENT?</span><p>Describe the project you want, your programme and what kind of help you need.</p><Link href="/projects/request">Request a project →</Link></div>
        </aside>
      </section>
    </main>
  );
}
