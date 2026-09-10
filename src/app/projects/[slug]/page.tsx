import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { ProjectAccessButton } from "@/components/project-access-button";
import { ProjectPhaseTracker, ProjectSaveButton, ProjectStartButton } from "@/components/project-workspace-controls";
import { getProject } from "@/modules/projects/catalog";
import { publicProject, userCanAccessProject } from "@/modules/projects/service";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "./project-detail.css";

export const dynamic = "force-dynamic";

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

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const databaseProject = await publicProject(slug);
  const curatedProject = databaseProject ? null : getProject(slug);
  if (!databaseProject && !curatedProject) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const isOwner = Boolean(databaseProject && userId && databaseProject.creatorId === userId);
  const hasAccess = databaseProject && userId ? await userCanAccessProject(userId, databaseProject.id) : false;
  const fullAccess = Boolean(curatedProject || isOwner || hasAccess);

  const project = databaseProject
    ? {
        id: databaseProject.id,
        slug: databaseProject.slug,
        title: databaseProject.title,
        field: databaseProject.field,
        area: databaseProject.area ?? "General",
        summary: databaseProject.summary,
        difficulty: label(databaseProject.difficulty),
        time: "Creator project",
        mode: databaseProject.modes.map(mode => label(mode)),
        access: databaseProject.access,
        price: databaseProject.price,
        currency: databaseProject.currency,
        kitPrice: databaseProject.kitPrice ? databaseProject.kitPrice / 100 : undefined,
        skills: [databaseProject.area ?? databaseProject.field, ...databaseProject.modes.map(mode => label(mode))].slice(0, 4),
        components: databaseProject.components,
        phases: databaseProject.phases,
        creatorName: databaseProject.creator.name ?? databaseProject.creator.username ?? "Tekora creator",
      }
    : {
        id: null,
        slug: curatedProject!.slug,
        title: curatedProject!.title,
        field: curatedProject!.field,
        area: curatedProject!.area,
        summary: curatedProject!.summary,
        difficulty: curatedProject!.difficulty,
        time: curatedProject!.time,
        mode: curatedProject!.mode,
        access: "FREE" as const,
        price: null,
        currency: "GHS",
        kitPrice: curatedProject!.kitPrice,
        skills: curatedProject!.skills,
        components: (curatedProject!.components ?? []).map((name, index) => ({ id: `${index}`, name, quantity: 1, unit: null, estimatedPrice: null, note: null, position: index + 1 })),
        phases: curatedProject!.phases.map((phase, index) => ({ id: `${index}`, ...phase, position: index + 1 })),
        creatorName: "Tekora",
      };

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
          <div className="projectDetailBadges"><span>{project.difficulty}</span><span>{project.time}</span>{project.mode.map(mode => <span key={mode}>{mode}</span>)}<span>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</span></div>
          <p className="projectCreatorLine">Created by {project.creatorName}</p>
          <div className="projectDetailActions">
            {databaseProject ? (
              <ProjectAccessButton projectId={databaseProject.id} slug={project.slug} access={databaseProject.access} price={databaseProject.price} currency={databaseProject.currency} loggedIn={Boolean(userId)} hasAccess={Boolean(hasAccess)} isOwner={isOwner} />
            ) : (
              <><ProjectStartButton slug={project.slug} /><ProjectSaveButton slug={project.slug} /></>
            )}
            <Link className="projectMyLink" href="/projects/my">My Projects →</Link>
          </div>
        </div>

        <aside className="projectKitSummary">
          <span className="projectEyebrow">PROJECT ACCESS</span>
          <h2>{project.access === "FREE" ? "Free to add to your workspace." : `Unlock for ${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}.`}</h2>
          <div className="projectOption"><strong>Public preview</strong><p>Anyone can understand what the project is, its field, difficulty and what the workspace contains.</p></div>
          <div className="projectOption"><strong>Full workspace</strong><p>Access opens the build phases, detailed resources, BOM and project support under your Tekora account.</p></div>
          {project.kitPrice ? <div className="projectKitPrice"><small>Optional complete kit estimate</small><strong>GHS {project.kitPrice.toFixed(2)}</strong><span>Separate from project access</span></div> : null}
        </aside>
      </section>

      <section className="projectDetailLayout">
        <div className="projectDetailMain">
          <section className="projectSkillsSection">
            <span className="projectEyebrow">WHAT YOU WILL WORK WITH</span>
            <h2>Skills inside this project.</h2>
            <div className="projectSkillCards">{project.skills.map((skill, index) => <article key={`${skill}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{skill}</strong></article>)}</div>
          </section>

          {!fullAccess ? (
            <section className="projectLockedWorkspace">
              <span className="projectEyebrow">FULL PROJECT WORKSPACE</span>
              <h2>{project.phases.length} build phases are ready inside.</h2>
              <p>Get access to open the phase-by-phase guide, components, resources, implementation support and documentation workspace for this project.</p>
              {databaseProject ? <ProjectAccessButton projectId={databaseProject.id} slug={project.slug} access={databaseProject.access} price={databaseProject.price} currency={databaseProject.currency} loggedIn={Boolean(userId)} hasAccess={Boolean(hasAccess)} isOwner={isOwner} /> : null}
            </section>
          ) : (
            <>
              <section id="phases" className="projectPhasesSection">
                <div className="projectDetailHeading"><div><span className="projectEyebrow">PROJECT PHASES</span><h2>Build it one clear step at a time.</h2></div><span>{project.phases.length} phases</span></div>
                {databaseProject ? (
                  <div className="projectPhaseList">{project.phases.map((phase, index) => <article key={phase.id}><span className="projectPhaseNumber">{String(index + 1).padStart(2, "0")}</span><div><small>PHASE {index + 1}</small><h3>{phase.title}</h3><p>{phase.description}</p></div><span className="projectPhaseStatus">Workspace →</span></article>)}</div>
                ) : (
                  <ProjectPhaseTracker slug={project.slug} phases={project.phases} />
                )}
              </section>

              {project.components.length ? (
                <section id="components" className="projectComponentsSection">
                  <div className="projectDetailHeading"><div><span className="projectEyebrow">BILL OF MATERIALS</span><h2>What you need to build it.</h2></div><span>{project.components.length} line items</span></div>
                  <div className="projectBomTable">
                    <div className="projectBomHead"><span>Item</span><span>Qty</span><span>Estimate</span></div>
                    {project.components.map((component) => <div className="projectBomRow" key={component.id}><strong>{component.name}</strong><span>{component.quantity}{component.unit ? ` ${component.unit}` : ""}</span><span>{component.estimatedPrice ? `GHS ${(component.estimatedPrice / 100).toFixed(2)}` : project.kitPrice ? "Kit item" : "—"}</span></div>)}
                  </div>
                  {project.kitPrice ? <div className="projectKitCallout"><div><strong>Want everything together?</strong><p>The project kit is optional and separate from access to the project guide.</p></div><Link href="#" className="premiumPrimaryCta">Get complete kit · GHS {project.kitPrice.toFixed(2)} →</Link></div> : null}
                </section>
              ) : null}

              <section className="projectResourcesSection">
                <span className="projectEyebrow">PROJECT RESOURCES</span>
                <h2>Everything around the build.</h2>
                <p className="projectSectionIntro">Technical resources stay beside the project instead of being scattered across different pages.</p>
                <div className="projectResourceGrid">{resources.map(([code, title, copy]) => <article key={title}><span>{code}</span><div><strong>{title}</strong><p>{copy}</p></div><em>Guide</em></article>)}</div>
              </section>

              <section className="projectSupportSection">
                <span className="projectEyebrow">TEKORA PROJECT SUPPORT</span>
                <h2>Don’t just copy the build. Understand it.</h2>
                <div className="projectSupportGrid"><article><span>AI</span><h3>Ask about the project</h3><p>Understand components, calculations, wiring, code and design decisions.</p></article><article><span>DOC</span><h3>Document your work</h3><p>Organize objectives, methodology, testing, results and references.</p></article><article><span>DEF</span><h3>Prepare to defend it</h3><p>Practice explaining how the system works, limitations and future improvements.</p></article></div>
              </section>
            </>
          )}
        </div>

        <aside className="projectDetailRail">
          <div className="projectRailCard"><span className="projectEyebrow">PROJECT SNAPSHOT</span><div><small>Field</small><strong>{project.field}</strong></div><div><small>Area</small><strong>{project.area}</strong></div><div><small>Difficulty</small><strong>{project.difficulty}</strong></div><div><small>Access</small><strong>{project.access === "FREE" ? "Free" : "Paid"}</strong></div></div>
          <div className="projectRailCard projectRailAction"><span className="projectEyebrow">YOUR PROJECTS</span><p>Projects you create or acquire belong to your Tekora account and appear in your dashboard.</p><Link href="/projects/my">Open My Projects →</Link></div>
          <div className="projectRailCard"><span className="projectEyebrow">NEED SOMETHING DIFFERENT?</span><p>Describe the project you want, your programme and what kind of help you need.</p><Link href="/projects/request">Request a project →</Link></div>
        </aside>
      </section>
    </main>
  );
}
