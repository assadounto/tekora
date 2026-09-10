import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ProjectCatalog, type DatabaseProjectCard } from "@/components/project-catalog";
import { projectFields } from "@/modules/projects/catalog";
import { listPublishedProjects } from "@/modules/projects/service";
import "../premium-home.css";
import "../premium-accessibility.css";
import "./projects.css";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const published = await listPublishedProjects();
  const databaseProjects: DatabaseProjectCard[] = published.map((project) => ({
    slug: project.slug,
    title: project.title,
    field: project.field,
    area: project.area,
    difficulty: project.difficulty,
    modes: project.modes,
    summary: project.summary,
    access: project.access,
    price: project.price,
    currency: project.currency,
    creatorName: project.creator.name ?? project.creator.username ?? "Tekora creator",
  }));

  return (
    <main className="projectMarketPage">
      <SiteHeader />

      <section className="projectMarketHero">
        <div>
          <span className="projectEyebrow">TEKORA PROJECT MARKETPLACE</span>
          <h1>Find a project. Understand it. Build it.</h1>
          <p>Browse practical projects across engineering, software, mechanical work, carpentry and more. Some projects are free; others are paid by their creators. Sign in when you want to add one to your Tekora dashboard or create your own.</p>
          <div className="projectMarketActions">
            <Link className="premiumPrimaryCta" href="#catalog">Browse projects →</Link>
            <Link className="premiumSecondaryCta" href="/projects/new">Create a project</Link>
            <Link className="projectTextAction" href="/projects/my">My Projects →</Link>
          </div>
        </div>

        <div className="projectHeroPanel">
          <span>PROJECT ACCESS</span>
          <article><strong>Free projects</strong><p>Sign in and add the project to your dashboard immediately.</p></article>
          <article><strong>Paid projects</strong><p>Preview the public project page, then unlock the full workspace after verified payment.</p></article>
          <article><strong>Create your own</strong><p>Any logged-in Tekora user can create a project and choose Free or Paid before publishing.</p></article>
        </div>
      </section>

      <section className="projectCategoryStrip">
        {projectFields.map((field) => <a href="#catalog" key={field}>{field}</a>)}
      </section>

      <section className="projectMarketSection" id="catalog">
        <ProjectCatalog databaseProjects={databaseProjects} />
      </section>

      <section className="projectRequestBanner">
        <div><span className="projectEyebrow">CAN'T FIND YOUR PROJECT?</span><h2>Tell Tekora what you want to build.</h2><p>Submit your programme, idea, budget, difficulty and what kind of help you need. Good requests can become new guided projects in the marketplace.</p></div>
        <Link className="premiumPrimaryCta" href="/projects/request">Request a project →</Link>
      </section>
    </main>
  );
}
