import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { adminProjectRequests } from "@/modules/projects/request-service";

export const dynamic = "force-dynamic";

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function AdminProjectRequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  if (!(await isAdminUser(session.user.id))) redirect("/dashboard");

  const requests = await adminProjectRequests();

  return (
    <main className="dashboardMain">
      <header className="dashboardTopbar">
        <div><p className="eyebrow">ADMIN · PROJECT REQUESTS</p><h1>What users want Tekora to build next.</h1></div>
        <div style={{display:"flex",gap:10}}><Link className="headerCta" href="/projects/new">Create project</Link><Link className="headerCta" href="/dashboard">Dashboard</Link></div>
      </header>
      <section className="courseGrid">
        {requests.length === 0 ? <div className="emptyState"><h2>No requests yet.</h2><p>User project requests and budgets will appear here.</p></div> : requests.map(request => <article className="courseCard" key={request.id}><span className="courseBadge">{pretty(request.status)}</span><h2>{request.title}</h2><p>{request.field}{request.area ? ` · ${request.area}` : ""} · {pretty(request.difficulty)}</p><p>{request.description}</p><p><strong>Budget:</strong> {request.budget ? `${request.currency} ${(request.budget / 100).toFixed(2)}` : "Not specified"}</p>{request.support ? <p><strong>Needs:</strong> {request.support}</p> : null}<p><strong>Requested by:</strong> {request.user.name ?? request.user.username ?? request.user.email}</p></article>)}
      </section>
    </main>
  );
}
