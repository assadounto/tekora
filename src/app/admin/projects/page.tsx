import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { entitlements: true, favorites: true, purchases: true } },
    },
  });

  return (
    <div className="adminPage">
      <header className="adminPageHead">
        <div><span className="adminEyebrow">CONTENT · PROJECTS</span><h1>Projects</h1><p>Create, price, publish and manage every project available in the Tekora marketplace.</p></div>
        <div className="adminHeadActions"><Link className="adminPrimary" href="/projects/new">+ Create project</Link><Link className="adminSecondary" href="/projects">Public marketplace</Link></div>
      </header>

      {projects.length === 0 ? <div className="adminEmpty"><h2>No projects yet.</h2><p>Create the first Tekora project and keep it as a draft until it is ready.</p><Link className="adminPrimary" href="/projects/new">Create project →</Link></div> : (
        <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Project</th><th>Status</th><th>Access</th><th>Users</th><th>Sales</th><th>Updated</th><th>Action</th></tr></thead><tbody>{projects.map(project => <tr key={project.id}><td><strong>{project.title}</strong><small>{project.field}{project.area ? ` · ${project.area}` : ""}</small></td><td><span className={`adminStatus ${project.status.toLowerCase()}`}>{pretty(project.status)}</span></td><td>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</td><td>{Math.max(project._count.entitlements - 1, 0)}<small>{project._count.favorites} favorites</small></td><td>{project._count.purchases}</td><td>{project.updatedAt.toLocaleDateString()}</td><td><Link href={`/projects/manage/${project.id}`}>Manage →</Link>{project.status === "PUBLISHED" ? <small><Link href={`/projects/${project.slug}`}>Public view</Link></small> : null}</td></tr>)}</tbody></table></div>
      )}
    </div>
  );
}
