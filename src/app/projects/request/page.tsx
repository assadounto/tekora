import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ProjectIntakeForm } from "@/components/project-intake-form";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "../project-form.css";

export default function RequestProjectPage() {
  return (
    <main className="projectFormPage">
      <SiteHeader />
      <section className="projectFormShell">
        <div className="projectFormIntro">
          <Link href="/projects" className="projectBack">← Project marketplace</Link>
          <span className="projectEyebrow">REQUEST A PROJECT</span>
          <h1>Tell Tekora what you want to build.</h1>
          <p>If the project is not already in the marketplace, describe the idea, your field and the kind of support you need. Good requests can become new guided Tekora projects and kit-ready builds.</p>
          <div className="projectFormNotes"><span>Project idea</span><span>Difficulty</span><span>Budget</span><span>Support needed</span></div>
        </div>
        <div className="projectFormCard"><ProjectIntakeForm mode="request" /></div>
      </section>
    </main>
  );
}
