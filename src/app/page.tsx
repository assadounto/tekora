import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { projectFields, projects } from "@/modules/projects/catalog";
import "./premium-home.css";
import "./premium-accessibility.css";
import "./project-home.css";

const difficultyCards = [
  ["Simple", "Start small", "Quick builds for learning components, wiring, coding, fabrication and basic design."],
  ["Intermediate", "Build with confidence", "Projects that combine multiple concepts into a complete working prototype."],
  ["Advanced", "Challenge yourself", "Deeper systems for final-year work, portfolios and serious practical exploration."],
];

const projectPhases = [
  ["01", "Understand", "Know what the project solves and how the system is supposed to work."],
  ["02", "Plan", "Review the design, components, materials, architecture and expected result."],
  ["03", "Build", "Follow the wiring, fabrication or software implementation step by step."],
  ["04", "Test", "Check the system, find faults and understand why something works or fails."],
  ["05", "Document", "Turn your work into proper project evidence, reports and presentation material."],
  ["06", "Improve", "Extend the idea, add features or turn a prototype into something stronger."],
];

const footerGroups = [
  ["Projects", ["All projects", "DIY builds", "Simple projects", "Advanced projects", "Project kits"]],
  ["Create", ["Create a project", "Request a project", "Save favorites", "Project workspace", "Submit an idea"]],
  ["Fields", ["Electrical", "Software", "Mechanical", "Computer", "Renewable Energy", "Carpentry"]],
  ["Tekora", ["Learn", "Research support", "Community", "Universities", "Help", "Terms"]],
];

export default function HomePage() {
  const featured = projects.slice(0, 6);

  return (
    <main className="projectHome">
      <SiteHeader />

      <section className="projectHomeHero">
        <div className="projectHomeHeroInner">
          <div className="projectHomeHeroCopy">
            <span className="projectHomeEyebrow">LEARN BY BUILDING</span>
            <h1>Find a project. <span>Build something real.</span></h1>
            <p>
              Tekora helps students and makers discover practical projects, understand how they work, build them step by step and get the right components when they need them.
            </p>

            <label className="projectHomeSearch">
              <span>⌕</span>
              <input aria-label="Search Tekora projects" placeholder="Search smart meter, React Native, solar, furniture..." />
              <Link href="/projects">Search projects</Link>
            </label>

            <div className="projectHomeHeroActions">
              <Link href="/projects" className="premiumPrimaryCta">Explore projects →</Link>
              <Link href="/projects/request" className="premiumSecondaryCta">Request a project</Link>
            </div>

            <div className="projectHomeModes">
              <span>DIY</span><span>Guided</span><span>Kit-ready</span><span>Save favorites</span>
            </div>
          </div>

          <div className="projectHomePreview">
            <div className="projectPreviewHead"><span>PROJECT OF THE WEEK</span><strong>Smart Energy Meter</strong></div>
            <div className="projectPreviewVisual"><span>POWER + IoT</span><strong>SEM</strong></div>
            <div className="projectPreviewMeta"><span>Intermediate</span><span>1–2 days</span><span>Kit-ready</span></div>
            <div className="projectPreviewSteps"><div><span>01</span><strong>Understand</strong></div><div><span>02</span><strong>Build</strong></div><div><span>03</span><strong>Test</strong></div><div><span>04</span><strong>Document</strong></div></div>
            <div className="projectPreviewFooter"><span>Guide · BOM · Build phases</span><Link href="/projects/smart-energy-meter">Open project →</Link></div>
          </div>
        </div>
      </section>

      <section className="projectHomeFieldStrip">
        {projectFields.map((field) => <Link href="/projects#catalog" key={field}>{field}</Link>)}
      </section>

      <section className="projectHomeSection">
        <div className="projectHomeSectionHead">
          <div><span className="projectHomeEyebrow">PROJECT MARKETPLACE</span><h2>What do you want to build?</h2><p>Explore projects across the most useful technical, digital and practical fields.</p></div>
          <Link href="/projects">View all projects →</Link>
        </div>

        <div className="projectHomeGrid">
          {featured.map((project, index) => (
            <article className="projectHomeCard" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className={`projectHomeCardVisual projectHomeVisual${(index % 4) + 1}`}>
                <span>{project.field}</span><strong>{project.area}</strong>
              </Link>
              <div className="projectHomeCardBody">
                <div className="projectHomeCardMeta"><span>{project.difficulty}</span><span>{project.time}</span></div>
                <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                <p>{project.summary}</p>
                <div className="projectHomeTags">{project.mode.map(mode => <span key={mode}>{mode}</span>)}</div>
                <div className="projectHomeCardFooter"><button type="button">♡ Save</button><Link href={`/projects/${project.slug}`}>View project →</Link></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projectHomeDifficulty">
        <div className="projectHomeSectionHead light"><div><span className="projectHomeEyebrow">CHOOSE YOUR LEVEL</span><h2>Start simple or challenge yourself.</h2><p>Difficulty should help you choose the right build—not make the marketplace complicated.</p></div></div>
        <div className="projectDifficultyGrid">
          {difficultyCards.map(([title, subtitle, copy], index) => <Link href="/projects#catalog" key={title}><span>0{index + 1}</span><small>{title}</small><h3>{subtitle}</h3><p>{copy}</p><strong>Browse {title.toLowerCase()} projects →</strong></Link>)}
        </div>
      </section>

      <section className="projectHomeSection projectPhasesHome">
        <div className="projectHomeSectionHead"><div><span className="projectHomeEyebrow">NOT JUST PROJECT TITLES</span><h2>Every project has a clear path.</h2><p>Students should understand what they are doing instead of copying a circuit, codebase or design blindly.</p></div></div>
        <div className="projectPhaseHomeGrid">{projectPhases.map(([number, title, copy]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="projectHomeBuildWays">
        <article>
          <span className="projectHomeEyebrow">DO IT YOURSELF</span>
          <h2>Already have your own components or materials?</h2>
          <p>Open a DIY project, follow the guide, understand each phase and build it with what you already have.</p>
          <Link href="/projects" className="premiumPrimaryCta">Browse DIY projects →</Link>
        </article>
        <article>
          <span className="projectHomeEyebrow">GET A COMPLETE KIT</span>
          <h2>Need everything for the build?</h2>
          <p>Kit-ready projects connect the guide to the matching components, so you do not have to hunt for every resistor, sensor, module or fitting.</p>
          <Link href="/projects#catalog" className="premiumPrimaryCta">Explore kit-ready projects →</Link>
        </article>
      </section>

      <section className="projectHomeRequest">
        <div>
          <span className="projectHomeEyebrow">HAVE YOUR OWN IDEA?</span>
          <h2>Create it yourself or request help from Tekora.</h2>
          <p>If the exact project is not in the marketplace, describe what you want to build, your field, difficulty, budget and the support you need.</p>
        </div>
        <div><Link href="/projects/new" className="premiumSecondaryCta">Create my project</Link><Link href="/projects/request" className="premiumPrimaryCta">Request a project →</Link></div>
      </section>

      <section className="projectHomeSupport">
        <div><span className="projectHomeEyebrow">TEKORA SUPPORTS THE WHOLE BUILD</span><h2>When the project needs more than instructions.</h2></div>
        <div className="projectSupportHomeGrid">
          <article><span>AI</span><h3>Understand the project</h3><p>Ask about calculations, code, wiring, components, mechanisms or design decisions.</p></article>
          <article><span>MAT</span><h3>Simulation & software</h3><p>Get help with MATLAB, Simulink, coding, dashboards and other tools used in the project.</p></article>
          <article><span>DOC</span><h3>Project documentation</h3><p>Organize objectives, methodology, results, references, presentation and defense preparation.</p></article>
          <article><span>LEARN</span><h3>Learn the missing skill</h3><p>Use structured lessons when you need to understand a subject more deeply before continuing the build.</p></article>
        </div>
      </section>

      <section className="projectHomeFinal">
        <div><span className="projectHomeEyebrow">START WITH A PROJECT</span><h2>The fastest way to understand something is to build it.</h2><p>Explore Tekora projects, save the ones you like and turn your next idea into something real.</p></div>
        <Link href="/projects" className="premiumPrimaryCta">Find a project →</Link>
      </section>

      <footer className="premiumFooter">
        <div className="premiumFooterTop">
          <div className="footerBrandColumn"><Link href="/" className="premiumBrand"><span className="premiumBrandIcon">T</span><span>Tekora</span></Link><p>Practical projects for people who learn by building.</p><span className="footerTagline">Find. Understand. Build.</span></div>
          {footerGroups.map(([title, items]) => <div className="footerLinkGroup" key={title as string}><strong>{title}</strong>{(items as string[]).map(item => <Link href="/projects" key={item}>{item}</Link>)}</div>)}
        </div>
        <div className="premiumFooterBottom"><span>© {new Date().getFullYear()} Tekora.</span><div><Link href="#">Privacy</Link><Link href="#">Terms</Link><Link href="#">Help</Link></div></div>
      </footer>
    </main>
  );
}
