import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ProjectCatalog } from "@/components/project-catalog";
import { projectFields } from "@/modules/projects/catalog";
import "../premium-home.css";
import "../premium-accessibility.css";
import "./projects.css";

export default function ProjectsPage() {
  return (
    <main className="projectMarketPage">
      <SiteHeader />

      <section className="projectMarketHero">
        <div>
          <span className="projectEyebrow">TEKORA PROJECT MARKETPLACE</span>
          <h1>Find a project. Understand it. Build it.</h1>
          <p>Browse practical projects across engineering, software, mechanical work, carpentry and more. Choose something simple, challenge yourself with a harder build, follow a DIY guide, or get a complete kit when available.</p>
          <div className="projectMarketActions">
            <Link className="premiumPrimaryCta" href="#catalog">Browse projects →</Link>
            <Link className="premiumSecondaryCta" href="/projects/request">Request a project</Link>
            <Link className="projectTextAction" href="/projects/new">Create your own project →</Link>
          </div>
        </div>

        <div className="projectHeroPanel">
          <span>START YOUR WAY</span>
          <article><strong>DIY</strong><p>Follow the guide and source your own components.</p></article>
          <article><strong>Guided</strong><p>Work through clear phases with explanations and support.</p></article>
          <article><strong>Kit-ready</strong><p>Use the project guide and get the matching component bundle.</p></article>
        </div>
      </section>

      <section className="projectCategoryStrip">
        {projectFields.map((field) => <a href="#catalog" key={field}>{field}</a>)}
      </section>

      <section className="projectMarketSection" id="catalog">
        <ProjectCatalog />
      </section>

      <section className="projectRequestBanner">
        <div><span className="projectEyebrow">CAN'T FIND YOUR PROJECT?</span><h2>Tell Tekora what you want to build.</h2><p>Submit your programme, idea, budget, difficulty and what kind of help you need. We can turn good requests into new guided projects and kits.</p></div>
        <Link className="premiumPrimaryCta" href="/projects/request">Request a project →</Link>
      </section>
    </main>
  );
}
