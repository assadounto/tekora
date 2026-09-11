import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { PurchaseButton } from "@/components/purchase-button";
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
          <p>Your purchase belongs to your Tekora account. Paystack handles the checkout, then Tekora verifies the transaction on the server before adding the full project to My Projects.</p>
          <div className="projectCheckoutIncludes"><span>Full project phases</span><span>Bill of materials</span><span>Technical resources</span><span>Documentation support</span><span>Project workspace</span></div>
          <div className="projectCheckoutNotice"><strong>Access is granted only after verified payment.</strong><p>If payment is unsuccessful or the amount does not match, the project remains locked.</p></div>
        </div>

        <aside className="projectCheckoutCard">
          <span className="projectEyebrow">ORDER SUMMARY</span>
          <h2>{project.title}</h2>
          <div><span>Project access</span><strong>{project.currency} {((project.price ?? 0) / 100).toFixed(2)}</strong></div>
          <div><span>Provider</span><strong>Tekora</strong></div>
          <div><span>Access</span><strong>Your Tekora account</strong></div>
          <PurchaseButton targetType="PROJECT" targetId={project.id} label={`Pay ${project.currency} ${((project.price ?? 0) / 100).toFixed(2)} →`} />
          <small>Secure checkout is initialized from the Tekora server.</small>
        </aside>
      </section>
    </main>
  );
}
