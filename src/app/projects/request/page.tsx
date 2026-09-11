import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { ProjectIntakeForm } from "@/components/project-intake-form";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "../project-form.css";

export default async function RequestProjectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  return (
    <main className="projectFormPage">
      <SiteHeader />
      <section className="projectFormShell">
        <div className="projectFormIntro">
          <Link href="/projects" className="projectBack">← Project marketplace</Link>
          <span className="projectEyebrow">REQUEST A PROJECT</span>
          <h1>Tell Tekora what you want to build.</h1>
          <p>If the project is not already in the marketplace, describe the idea, your field, budget and support needed. Tekora reviews the request and can turn it into a guided project for the marketplace.</p>
          <div className="projectFormNotes"><span>Your idea</span><span>Your field</span><span>Your budget</span><span>Tekora reviews</span></div>
        </div>
        <div className="projectFormCard"><ProjectIntakeForm mode="request" /></div>
      </section>
    </main>
  );
}
