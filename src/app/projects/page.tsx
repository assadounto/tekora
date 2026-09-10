import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { projectFields, projects } from "@/modules/projects/catalog";
import "../premium-home.css";
import "../premium-accessibility.css";
import "./projects.css";

const difficulties = ["All", "Simple", "Intermediate", "Advanced"];

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
        <div className="projectMarketHead">
          <div><span className="projectEyebrow">PROJECT LIBRARY</span><h2>Choose what you want to build.</h2><p>Start from your field, then choose the difficulty and style that fits you.</p></div>
          <label className="projectSearch"><span>⌕</span><input placeholder="Search projects, fields, skills..." aria-label="Search projects" /></label>
        </div>

        <div className="projectFilterRow">
          <div>{difficulties.map((item, index) => <button className={index === 0 ? "active" : ""} type="button" key={item}>{item}</button>)}</div>
          <button type="button" className="projectFilterButton">All fields ▾</button>
        </div>

        <div className="projectGrid">
          {projects.map((project, index) => (
            <article className="projectCard" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className={`projectCardVisual projectVisual${(index % 4) + 1}`}>
                <span>{project.field}</span>
                <strong>{project.area}</strong>
              </Link>
              <div className="projectCardBody">
                <div className="projectCardMeta"><span>{project.difficulty}</span><span>{project.time}</span></div>
                <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                <p>{project.summary}</p>
                <div className="projectSkillRow">{project.skills.slice(0, 3).map(skill => <span key={skill}>{skill}</span>)}</div>
                <div className="projectCardFooter">
                  <div className="projectModes">{project.mode.map(mode => <span key={mode}>{mode}</span>)}</div>
                  <Link href={`/projects/${project.slug}`}>View project →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projectRequestBanner">
        <div><span className="projectEyebrow">CAN'T FIND YOUR PROJECT?</span><h2>Tell Tekora what you want to build.</h2><p>Submit your programme, idea, budget, difficulty and what kind of help you need. We can turn good requests into new guided projects and kits.</p></div>
        <Link className="premiumPrimaryCta" href="/projects/request">Request a project →</Link>
      </section>
    </main>
  );
}
