import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function money(value: number | null | undefined, currency = "GHS") {
  return `${currency} ${((value ?? 0) / 100).toFixed(2)}`;
}

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function AdminOverviewPage() {
  const [users, projects, publishedProjects, courses, publishedCourses, openRequests, sales, recentRequests, recentSales] = await Promise.all([
    db.user.count(),
    db.project.count(),
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.course.count(),
    db.course.count({ where: { status: "PUBLISHED" } }),
    db.projectRequest.count({ where: { status: { in: ["SUBMITTED", "REVIEWING"] } } }),
    db.purchase.aggregate({ _count: true, _sum: { amount: true } }),
    db.projectRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, username: true, email: true } } },
    }),
    db.purchase.findMany({
      orderBy: { paidAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, username: true, email: true } },
        project: { select: { title: true } },
        course: { select: { title: true } },
      },
    }),
  ]);

  return (
    <div className="adminPage">
      <header className="adminPageHead">
        <div><span className="adminEyebrow">TEKORA ADMIN STUDIO</span><h1>Run the platform from one place.</h1><p>Create and publish projects and courses, review what students are requesting, watch verified sales, and keep an eye on the users joining Tekora.</p></div>
        <div className="adminHeadActions"><Link className="adminPrimary" href="/projects/new">+ New project</Link><Link className="adminSecondary" href="/creator/courses/new">+ New course</Link></div>
      </header>

      <section className="adminStats">
        <article className="adminStat"><span>Users</span><strong>{users}</strong><small>Registered Tekora accounts</small></article>
        <article className="adminStat"><span>Projects</span><strong>{publishedProjects}/{projects}</strong><small>Published / total</small></article>
        <article className="adminStat"><span>Courses</span><strong>{publishedCourses}/{courses}</strong><small>Published / total</small></article>
        <article className="adminStat"><span>Open requests</span><strong>{openRequests}</strong><small>Submitted or under review</small></article>
      </section>

      <section className="adminGrid2">
        <article className="adminRevenueCard"><span>VERIFIED SALES</span><strong>{money(sales._sum.amount)}</strong><small>{sales._count} successful paid checkout{sales._count === 1 ? "" : "s"} recorded by Tekora.</small><Link className="adminPrimary" href="/admin/sales">Open sales →</Link></article>
        <article className="adminPanel">
          <div className="adminPanelHead"><h2>Content shortcuts</h2></div>
          <div className="adminList">
            <div className="adminListRow"><div><h3>Projects</h3><p>Draft, price, publish and manage project workspaces.</p></div><span>{projects}</span><Link href="/admin/projects">Manage →</Link></div>
            <div className="adminListRow"><div><h3>Courses</h3><p>Build modules, lessons and paid/free learning.</p></div><span>{courses}</span><Link href="/admin/courses">Manage →</Link></div>
            <div className="adminListRow"><div><h3>Project requests</h3><p>Review student ideas and budgets.</p></div><span>{openRequests}</span><Link href="/admin/project-requests">Review →</Link></div>
          </div>
        </article>
      </section>

      <section className="adminGrid2" style={{marginTop:16}}>
        <article className="adminPanel">
          <div className="adminPanelHead"><h2>Recent project requests</h2><Link href="/admin/project-requests">View all →</Link></div>
          {recentRequests.length === 0 ? <div className="adminEmpty"><h2>No requests yet.</h2><p>Student project requests will appear here.</p></div> : <div className="adminList">{recentRequests.map(request => <div className="adminListRow" key={request.id}><div><h3>{request.title}</h3><p>{request.user.name ?? request.user.username ?? request.user.email} · {request.field}</p></div><span className={`adminStatus ${request.status.toLowerCase()}`}>{pretty(request.status)}</span><Link href="/admin/project-requests">Open →</Link></div>)}</div>}
        </article>

        <article className="adminPanel">
          <div className="adminPanelHead"><h2>Recent sales</h2><Link href="/admin/sales">View all →</Link></div>
          {recentSales.length === 0 ? <div className="adminEmpty"><h2>No paid sales yet.</h2><p>Verified Paystack purchases will appear here.</p></div> : <div className="adminList">{recentSales.map(sale => <div className="adminListRow" key={sale.id}><div><h3>{sale.project?.title ?? sale.course?.title ?? pretty(sale.target)}</h3><p>{sale.user.name ?? sale.user.username ?? sale.user.email}</p></div><span>{money(sale.amount, sale.currency)}</span><Link href="/admin/sales">Details →</Link></div>)}</div>}
        </article>
      </section>
    </div>
  );
}
