import Link from "next/link";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { SiteHeader } from "@/components/site-header";
import { ProjectCatalog, type DatabaseProjectCard } from "@/components/project-catalog";
import { projectFields } from "@/modules/projects/catalog";
import { listPublishedProjects } from "@/modules/projects/service";
import "../premium-home.css";
import "../premium-accessibility.css";
import "./projects.css";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = await auth();
  const isAdmin = session?.user?.id ? await isAdminUser(session.user.id) : false;
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
    creatorName: "Tekora",
  }));

  return (
    <main className="projectMarketPage">
      <SiteHeader />

      <section className="projectMarketHero">
        <div>
          <span className="projectEyebrow">TEKORA PROJECT MARKETPLACE</span>
          <h1>Find a project. Understand it. Build it.</h1>
          <p>Browse practical projects across engineering, software, mechanical work, carpentry and more. Projects can be free or paid. Sign in to add free projects or unlock paid projects and keep them in your dashboard.</p>
          <div className="projectMarketActions">
            <Link className="premiumPrimaryCta" href="#catalog">Browse projects →</Link>
            <Link className="premiumSecondaryCta" href="/projects/my">My Projects</Link>
            <Link className="projectTextAction" href="/projects/request">Request a Project →</Link>
            {isAdmin ? <Link className="projectTextAction" href="/projects/new">Admin: Create Project →</Link> : null}
          </div>
        </div>

        <div className="projectHeroPanel">
          <span>HOW IT WORKS</span>
          <article><strong>Free projects</strong><p>Sign in and add the full project workspace to your account immediately.</p></article>
          <article><strong>Paid projects</strong><p>Preview first, then unlock the complete workspace after payment.</p></article>
          <article><strong>Need another project?</strong><p>Submit the project you want, your field and your budget for Tekora to review.</p></article>
        </div>
      </section>

      <section className="projectCategoryStrip">
        {projectFields.map((field) => <a href="#catalog" key={field}>{field}</a>)}
      </section>

      <section className="projectMarketSection" id="catalog">
        <ProjectCatalog databaseProjects={databaseProjects} />
      </section>

      <section className="projectRequestBanner">
        <div><span className="projectEyebrow">CAN'T FIND YOUR PROJECT?</span><h2>Tell Tekora what you want to build.</h2><p>Submit your idea, field, budget, difficulty and support needed. You do not publish projects yourself—Tekora reviews requests and creates marketplace projects.</p></div>
        <Link className="premiumPrimaryCta" href="/projects/request">Request a project →</Link>
      </section>
    </main>
  );
}
