import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { MyProjectsBoard } from "@/components/my-projects-board";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "./my-projects.css";

export default function MyProjectsPage() {
  return (
    <main className="myProjectsPage">
      <SiteHeader />
      <section className="myProjectsHero">
        <div>
          <Link href="/projects" className="projectBack">← Project marketplace</Link>
          <span className="projectEyebrow">MY PROJECTS</span>
          <h1>Your builds, all in one place.</h1>
          <p>Resume projects you have started and keep favorites nearby while you decide what to build next.</p>
        </div>
        <div className="myProjectsHeroActions">
          <Link href="/projects" className="premiumPrimaryCta">Find a project →</Link>
          <Link href="/projects/new" className="premiumSecondaryCta">Create my own</Link>
        </div>
      </section>

      <div className="myProjectsContent">
        <MyProjectsBoard />
      </div>
    </main>
  );
}
