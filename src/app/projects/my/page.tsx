import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { SiteHeader } from "@/components/site-header";
import { userProjectLibrary } from "@/modules/projects/service";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "../projects.css";
import "./my-projects.css";

export const dynamic = "force-dynamic";

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function MyProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const admin = await isAdminUser(session.user.id);
  const { created, acquired } = await userProjectLibrary(session.user.id);

  return (
    <main className="myProjectsPage">
      <SiteHeader />
      <section className="myProjectsHero">
        <div>
          <Link href="/projects" className="projectBack">← Project marketplace</Link>
          <span className="projectEyebrow">MY PROJECTS</span>
          <h1>Your unlocked projects stay with your Tekora account.</h1>
          <p>Free projects you add and paid projects you purchase appear here whenever you sign in.</p>
        </div>
        <div className="myProjectsHeroActions">{admin ? <Link href="/projects/new" className="premiumPrimaryCta">Admin: Create project →</Link> : null}<Link href="/projects" className="premiumSecondaryCta">Find projects</Link></div>
      </section>

      <div className="myProjectsContent">
        <section className="myProjectsBoard">
          <div className="myProjectsSectionHead"><div><span className="projectEyebrow">YOUR ACCESS</span><h2>Projects you can use</h2></div><span>{acquired.length}</span></div>
          {acquired.length === 0 ? (
            <div className="myProjectsEmpty"><span>PR</span><div><h2>No projects yet.</h2><p>Add a free project or purchase a paid project and it will appear here.</p></div><Link href="/projects" className="premiumPrimaryCta">Browse marketplace →</Link></div>
          ) : (
            <div className="myProjectsGrid">
              {acquired.map(item => <article key={item.id}><div className="myProjectCardTop"><span>{item.project.field}</span><em>{item.acquisition === "PURCHASE" ? "Purchased" : "Free access"}</em></div><h3>{item.project.title}</h3><p>{item.project.summary}</p><div className="myProjectModes"><span>{pretty(item.project.difficulty)}</span><span>{item.project.phases.length} phases</span><span>Tekora</span></div><div className="myProjectFooter"><span>{item.project.area ?? "General"}</span><Link href={`/projects/${item.project.slug}`}>Open project →</Link></div></article>)}
            </div>
          )}
        </section>

        {admin ? <section className="myProjectsBoard myProjectsSecondSection"><div className="myProjectsSectionHead"><div><span className="projectEyebrow">ADMIN PROJECTS</span><h2>Projects published by Tekora</h2></div><span>{created.length}</span></div>{created.length === 0 ? <div className="myProjectsEmpty"><span>+</span><div><h2>No admin projects yet.</h2><p>Create the first free or paid marketplace project.</p></div><Link href="/projects/new" className="premiumPrimaryCta">Create project →</Link></div> : <div className="myProjectsGrid">{created.map(project => <article key={project.id}><div className="myProjectCardTop"><span>{project.field}</span><em>{pretty(project.status)}</em></div><h3>{project.title}</h3><p>{project.summary}</p><div className="myProjectModes"><span>{pretty(project.difficulty)}</span><span>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</span><span>{project._count.entitlements} users</span></div><div className="myProjectFooter"><span>{project.area ?? "General"}</span><Link href={`/projects/manage/${project.id}`}>Manage →</Link></div></article>)}</div>}</section> : null}
      </div>
    </main>
  );
}
