import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { ProjectPublishButton } from "@/components/project-publish-button";
import "../../../premium-home.css";
import "../../../premium-accessibility.css";
import "../../projects.css";
import "../../project-form.css";
import "./manage-project.css";

export default async function ManageProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { projectId } = await params;
  const project = await db.project.findFirst({
    where: { id: projectId, creatorId: session.user.id },
    include: {
      phases: { orderBy: { position: "asc" } },
      components: { orderBy: { position: "asc" } },
      _count: { select: { entitlements: true, favorites: true } },
    },
  });

  if (!project) notFound();

  return (
    <main className="projectFormPage">
      <SiteHeader />
      <section className="manageProjectShell">
        <div className="manageProjectHeader">
          <div>
            <Link href="/projects/my" className="projectBack">← My Projects</Link>
            <span className="projectEyebrow">PROJECT CREATOR</span>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
          </div>
          <ProjectPublishButton projectId={project.id} slug={project.slug} published={project.status === "PUBLISHED"} />
        </div>

        <div className="manageProjectStats">
          <article><small>Status</small><strong>{project.status}</strong></article>
          <article><small>Access</small><strong>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</strong></article>
          <article><small>Difficulty</small><strong>{project.difficulty.toLowerCase()}</strong></article>
          <article><small>People with access</small><strong>{project._count.entitlements}</strong></article>
        </div>

        <div className="manageProjectGrid">
          <section className="manageProjectCard">
            <span className="projectEyebrow">PROJECT DETAILS</span>
            <div className="manageRows">
              <div><small>Field</small><strong>{project.field}</strong></div>
              <div><small>Area</small><strong>{project.area ?? "General"}</strong></div>
              <div><small>Build modes</small><strong>{project.modes.map(mode => mode.replace("_", " ").toLowerCase()).join(" · ")}</strong></div>
              <div><small>Public URL</small><strong>/projects/{project.slug}</strong></div>
            </div>
          </section>

          <section className="manageProjectCard">
            <span className="projectEyebrow">DEFAULT BUILD PHASES</span>
            <div className="managePhaseList">
              {project.phases.map((phase, index) => <div key={phase.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{phase.title}</strong><small>{phase.description}</small></div></div>)}
            </div>
          </section>
        </div>

        <section className="manageProjectNotice">
          <div><strong>{project.status === "PUBLISHED" ? "This project is live." : "This project is still a draft."}</strong><p>{project.status === "PUBLISHED" ? "Students can discover it from the public marketplace. Free projects can be added immediately; paid projects stay locked until payment is verified." : "Review the access type and project information, then publish it when you are ready for students to discover it."}</p></div>
          <Link href="/projects" className="projectTextAction">Open marketplace →</Link>
        </section>
      </section>
    </main>
  );
}
