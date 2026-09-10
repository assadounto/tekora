import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { ProjectIntakeForm } from "@/components/project-intake-form";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "../project-form.css";

export default async function CreateProjectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  return (
    <main className="projectFormPage">
      <SiteHeader />
      <section className="projectFormShell">
        <div className="projectFormIntro">
          <Link href="/projects" className="projectBack">← Project marketplace</Link>
          <span className="projectEyebrow">CREATE A TEKORA PROJECT</span>
          <h1>Turn your idea into a project people can build.</h1>
          <p>Create a project under your Tekora account, choose whether it is free or paid, and publish it to the public marketplace when it is ready.</p>
          <div className="projectFormNotes"><span>Your idea</span><span>Your field</span><span>Free or paid</span><span>Your build plan</span></div>
        </div>
        <div className="projectFormCard"><ProjectIntakeForm mode="create" /></div>
      </section>
    </main>
  );
}
