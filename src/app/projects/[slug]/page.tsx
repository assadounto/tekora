import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { ProjectAccessButton } from "@/components/project-access-button";
import { publicProject, userCanAccessProject } from "@/modules/projects/service";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "./project-detail.css";

export const dynamic = "force-dynamic";

function projectResources(field: string) {
  const value = field.toLowerCase();
  if (value.includes("software")) return [["ARCH", "System architecture", "Plan pages, data flow, APIs and responsibilities before coding."], ["CODE", "Starter code", "Build the application in manageable parts."], ["API", "Integration notes", "Understand external services, payloads and error handling."], ["TEST", "Testing checklist", "Verify the important user journeys before presenting."], ["DOC", "Report & defense", "Explain requirements, architecture, implementation, testing and limitations."]];
  if (value.includes("mechanical") || value.includes("carpentry") || value.includes("civil")) return [["DRAW", "Working drawings", "Use measurements, layout and assembly references before fabrication."], ["MAT", "Material list", "Review materials, quantities and tools required."], ["BUILD", "Assembly guide", "Follow the construction sequence and checkpoints."], ["TEST", "Inspection checklist", "Check dimensions, stability, movement or performance."], ["DOC", "Report & presentation", "Document design choices, process, results and improvements."]];
  return [["BLK", "Block diagram", "Understand the complete system before wiring individual components."], ["WIRE", "Circuit / wiring", "Follow the connection plan and verify power before switching on."], ["CODE", "Controller code", "Build and understand the firmware one function at a time."], ["SIM", "Simulation support", "Use MATLAB, Simulink, Proteus or calculations where needed."], ["DOC", "Report & defense", "Connect objectives, methodology, results, limitations and improvements."]];
}

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await publicProject(slug);
  if (!project) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const isOwner = Boolean(userId && project.creatorId === userId);
  const hasAccess = userId ? await userCanAccessProject(userId, project.id) : false;
  const fullAccess = isOwner || hasAccess;
  const resources = projectResources(project.field);
  const projectModes = project.modes.map(mode => label(mode));
  const skills = [project.area ?? project.field, ...projectModes].slice(0, 4);

  return (
    <main className="projectDetailPage">
      <SiteHeader />

      <section className="projectDetailHero">
        <div className="projectDetailIntro">
          <Link className="projectBack" href="/projects">← Project marketplace</Link>
          <span className="projectEyebrow">{project.field} · {project.area ?? "General"}</span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="projectDetailBadges"><span>{label(project.difficulty)}</span>{projectModes.map(mode => <span key={mode}>{mode}</span>)}<span>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</span></div>
          <p className="projectCreatorLine">Published by Tekora</p>
          <div className="projectDetailActions">
            <ProjectAccessButton projectId={project.id} slug={project.slug} access={project.access} price={project.price} currency={project.currency} loggedIn={Boolean(userId)} hasAccess={Boolean(hasAccess)} isOwner={isOwner} />
            <Link className="projectMyLink" href="/projects/my">My Projects →</Link>
          </div>
        </div>

        <aside className="projectKitSummary">
          <span className="projectEyebrow">PROJECT ACCESS</span>
          <h2>{project.access === "FREE" ? "Free to add to your account." : `Unlock for ${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}.`}</h2>
          <div className="projectOption"><strong>Public preview</strong><p>Anyone can review the project field, difficulty and what the workspace contains.</p></div>
          <div className="projectOption"><strong>Full workspace</strong><p>After access is granted, the build phases, BOM, technical resources and support become available.</p></div>
          {project.kitPrice ? <div className="projectKitPrice"><small>Optional complete kit estimate</small><strong>GHS {(project.kitPrice / 100).toFixed(2)}</strong><span>Separate from project access</span></div> : null}
        </aside>
      </section>

      <section className="projectDetailLayout">
        <div className="projectDetailMain">
          <section className="projectSkillsSection"><span className="projectEyebrow">WHAT YOU WILL WORK WITH</span><h2>Skills inside this project.</h2><div className="projectSkillCards">{skills.map((skill, index) => <article key={`${skill}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{skill}</strong></article>)}</div></section>

          {!fullAccess ? (
            <section className="projectLockedWorkspace"><span className="projectEyebrow">FULL PROJECT WORKSPACE</span><h2>{project.phases.length} build phases are ready inside.</h2><p>Get access to open the phase-by-phase guide, components, resources, implementation support and documentation workspace.</p><ProjectAccessButton projectId={project.id} slug={project.slug} access={project.access} price={project.price} currency={project.currency} loggedIn={Boolean(userId)} hasAccess={Boolean(hasAccess)} isOwner={isOwner} /></section>
          ) : (
            <>
              <section id="phases" className="projectPhasesSection"><div className="projectDetailHeading"><div><span className="projectEyebrow">PROJECT PHASES</span><h2>Build it one clear step at a time.</h2></div><span>{project.phases.length} phases</span></div><div className="projectPhaseList">{project.phases.map((phase, index) => <article key={phase.id}><span className="projectPhaseNumber">{String(index + 1).padStart(2, "0")}</span><div><small>PHASE {index + 1}</small><h3>{phase.title}</h3><p>{phase.description}</p></div><span className="projectPhaseStatus">Workspace →</span></article>)}</div></section>

              {project.components.length ? <section id="components" className="projectComponentsSection"><div className="projectDetailHeading"><div><span className="projectEyebrow">BILL OF MATERIALS</span><h2>What you need to build it.</h2></div><span>{project.components.length} line items</span></div><div className="projectBomTable"><div className="projectBomHead"><span>Item</span><span>Qty</span><span>Estimate</span></div>{project.components.map(component => <div className="projectBomRow" key={component.id}><strong>{component.name}</strong><span>{component.quantity}{component.unit ? ` ${component.unit}` : ""}</span><span>{component.estimatedPrice ? `GHS ${(component.estimatedPrice / 100).toFixed(2)}` : project.kitPrice ? "Kit item" : "—"}</span></div>)}</div>{project.kitPrice ? <div className="projectKitCallout"><div><strong>Want everything together?</strong><p>The project kit is optional and separate from access to the guide.</p></div><Link href="#" className="premiumPrimaryCta">Get complete kit · GHS {(project.kitPrice / 100).toFixed(2)} →</Link></div> : null}</section> : null}

              <section className="projectResourcesSection"><span className="projectEyebrow">PROJECT RESOURCES</span><h2>Everything around the build.</h2><p className="projectSectionIntro">Technical resources stay beside the project instead of being scattered across different pages.</p><div className="projectResourceGrid">{resources.map(([code, title, copy]) => <article key={title}><span>{code}</span><div><strong>{title}</strong><p>{copy}</p></div><em>Guide</em></article>)}</div></section>

              <section className="projectSupportSection"><span className="projectEyebrow">TEKORA PROJECT SUPPORT</span><h2>Don’t just copy the build. Understand it.</h2><div className="projectSupportGrid"><article><span>AI</span><h3>Ask about the project</h3><p>Understand components, calculations, wiring, code and design decisions.</p></article><article><span>DOC</span><h3>Document your work</h3><p>Organize objectives, methodology, testing, results and references.</p></article><article><span>DEF</span><h3>Prepare to defend it</h3><p>Practice explaining how the system works, limitations and future improvements.</p></article></div></section>
            </>
          )}
        </div>

        <aside className="projectDetailRail">
          <div className="projectRailCard"><span className="projectEyebrow">PROJECT SNAPSHOT</span><div><small>Field</small><strong>{project.field}</strong></div><div><small>Area</small><strong>{project.area ?? "General"}</strong></div><div><small>Difficulty</small><strong>{label(project.difficulty)}</strong></div><div><small>Access</small><strong>{project.access === "FREE" ? "Free" : "Paid"}</strong></div></div>
          <div className="projectRailCard projectRailAction"><span className="projectEyebrow">YOUR PROJECTS</span><p>Projects you unlock belong to your Tekora account and appear in your dashboard.</p><Link href="/projects/my">Open My Projects →</Link></div>
          <div className="projectRailCard"><span className="projectEyebrow">NEED SOMETHING DIFFERENT?</span><p>Tell Tekora the project you want and the budget you have.</p><Link href="/projects/request">Request a project →</Link></div>
        </aside>
      </section>
    </main>
  );
}
