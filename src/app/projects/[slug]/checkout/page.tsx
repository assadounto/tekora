import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { publicProject, userCanAccessProject } from "@/modules/projects/service";
import "../../../premium-home.css";
import "../../../premium-accessibility.css";
import "../../projects.css";
import "./checkout.css";

export const dynamic = "force-dynamic";

export default async function ProjectCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { slug } = await params;
  const project = await publicProject(slug);
  if (!project || project.access !== "PAID") notFound();

  if (project.creatorId === session.user.id || await userCanAccessProject(session.user.id, project.id)) {
    redirect(`/projects/${project.slug}`);
  }

  return (
    <main className="projectCheckoutPage">
      <SiteHeader />
      <section className="projectCheckoutShell">
        <div className="projectCheckoutMain">
          <Link href={`/projects/${project.slug}`} className="projectBack">← Back to project</Link>
          <span className="projectEyebrow">PAID PROJECT</span>
          <h1>Unlock {project.title}</h1>
          <p>Paid access belongs to your Tekora account. After a verified payment, the project is added to My Projects and the full build workspace becomes available.</p>

          <div className="projectCheckoutIncludes">
            <span>Full project phases</span><span>Bill of materials</span><span>Technical resources</span><span>Documentation support</span><span>Project assistant access</span>
          </div>

          <div className="projectCheckoutNotice">
            <strong>Secure payment is not enabled on this branch yet.</strong>
            <p>The database is already ready for purchased access, including the amount paid and acquisition type. We will connect Paystack verification before allowing this button to unlock a project.</p>
          </div>
        </div>

        <aside className="projectCheckoutCard">
          <span className="projectEyebrow">ORDER SUMMARY</span>
          <h2>{project.title}</h2>
          <div><span>Project access</span><strong>{project.currency} {((project.price ?? 0) / 100).toFixed(2)}</strong></div>
          <div><span>Creator</span><strong>{project.creator.name ?? project.creator.username ?? "Tekora creator"}</strong></div>
          <div><span>Access</span><strong>One Tekora account</strong></div>
          <button type="button" className="premiumPrimaryCta" disabled>Paystack checkout coming next</button>
          <small>No project access is granted until server-side payment verification succeeds.</small>
        </aside>
      </section>
    </main>
  );
}
