import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ProjectIntakeForm } from "@/components/project-intake-form";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "../project-form.css";

export default function CreateProjectPage() {
  return (
    <main className="projectFormPage">
      <SiteHeader />
      <section className="projectFormShell">
        <div className="projectFormIntro">
          <Link href="/projects" className="projectBack">← Project marketplace</Link>
          <span className="projectEyebrow">CREATE YOUR OWN PROJECT</span>
          <h1>Start with your idea.</h1>
          <p>Create a personal project workspace around something you already want to build. Start simple; Tekora can later help you turn the idea into phases, components, implementation tasks and documentation.</p>
          <div className="projectFormNotes"><span>Your idea</span><span>Your field</span><span>Your budget</span><span>Your build plan</span></div>
        </div>
        <div className="projectFormCard"><ProjectIntakeForm mode="create" /></div>
      </section>
    </main>
  );
}
