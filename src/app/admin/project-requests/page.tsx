import Link from "next/link";
import { adminProjectRequests } from "@/modules/projects/request-service";
import { AdminRequestStatus } from "@/components/admin-request-status";

export const dynamic = "force-dynamic";

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function AdminProjectRequestsPage() {
  const requests = await adminProjectRequests();
  const open = requests.filter(request => ["SUBMITTED", "REVIEWING"].includes(request.status)).length;

  return (
    <div className="adminPage">
      <header className="adminPageHead">
        <div><span className="adminEyebrow">DEMAND · PROJECT REQUESTS</span><h1>Project Requests</h1><p>See what students want to build, what they can spend, and what support they need before you decide which Tekora projects to create next.</p></div>
        <div className="adminHeadActions"><Link className="adminPrimary" href="/projects/new">+ Create project</Link></div>
      </header>

      <section className="adminStats">
        <article className="adminStat"><span>Total requests</span><strong>{requests.length}</strong><small>All student submissions</small></article>
        <article className="adminStat"><span>Open</span><strong>{open}</strong><small>Submitted or reviewing</small></article>
        <article className="adminStat"><span>Approved</span><strong>{requests.filter(request => request.status === "APPROVED").length}</strong><small>Good candidates to build</small></article>
        <article className="adminStat"><span>Fulfilled</span><strong>{requests.filter(request => request.status === "FULFILLED").length}</strong><small>Requests turned into delivery</small></article>
      </section>

      {requests.length === 0 ? <div className="adminEmpty"><h2>No requests yet.</h2><p>When users submit project ideas and budgets, they will appear here.</p></div> : (
        <section className="adminRequestGrid">
          {requests.map(request => <article className="adminRequestCard" key={request.id}>
            <div className="adminRequestTop"><div><span className="adminEyebrow">{request.field}</span><h3>{request.title}</h3></div><span className={`adminStatus ${request.status.toLowerCase()}`}>{pretty(request.status)}</span></div>
            <p>{request.description}</p>
            <div className="adminRequestMeta"><span>{pretty(request.difficulty)}</span>{request.area ? <span>{request.area}</span> : null}<span>{request.budget ? `${request.currency} ${(request.budget / 100).toFixed(2)}` : "Budget not specified"}</span></div>
            {request.support ? <p><strong>Support needed:</strong> {request.support}</p> : null}
            <p><strong>Requested by:</strong> {request.user.name ?? request.user.username ?? request.user.email}<br/><small>{request.user.email} · {request.createdAt.toLocaleDateString()}</small></p>
            <AdminRequestStatus requestId={request.id} currentStatus={request.status} />
          </article>)}
        </section>
      )}
    </div>
  );
}
