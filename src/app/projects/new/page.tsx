import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { SiteHeader } from "@/components/site-header";
import { ProjectIntakeForm } from "@/components/project-intake-form";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "../project-form.css";

export default async function CreateProjectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  if (!(await isAdminUser(session.user.id))) redirect("/dashboard");

  return (
    <main className="projectFormPage">
      <SiteHeader />
      <section className="projectFormShell">
        <div className="projectFormIntro">
          <Link href="/projects" className="projectBack">← Project marketplace</Link>
          <span className="projectEyebrow">ADMIN · NEW PROJECT</span>
          <h1>Create a Tekora project.</h1>
          <p>Projects published here become part of the public marketplace. Set the field, difficulty, build modes and whether access is free or paid.</p>
          <div className="projectFormNotes"><span>Admin only</span><span>Free or paid</span><span>Guided build</span><span>Marketplace</span></div>
        </div>
        <div className="projectFormCard"><ProjectIntakeForm mode="create" /></div>
      </section>
    </main>
  );
}
