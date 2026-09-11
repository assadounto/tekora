import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function money(value: number | null | undefined, currency = "GHS") {
  return `${currency} ${((value ?? 0) / 100).toFixed(2)}`;
}

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function AdminSalesPage() {
  const [sales, totals, projectTotals, courseTotals] = await Promise.all([
    db.purchase.findMany({
      orderBy: { paidAt: "desc" },
      take: 200,
      include: {
        user: { select: { name: true, username: true, email: true } },
        project: { select: { title: true } },
        course: { select: { title: true } },
      },
    }),
    db.purchase.aggregate({ _count: true, _sum: { amount: true } }),
    db.purchase.aggregate({ where: { target: "PROJECT" }, _count: true, _sum: { amount: true } }),
    db.purchase.aggregate({ where: { target: "COURSE" }, _count: true, _sum: { amount: true } }),
  ]);

  return (
    <div className="adminPage">
      <header className="adminPageHead"><div><span className="adminEyebrow">COMMERCE · VERIFIED PAYMENTS</span><h1>Sales</h1><p>Every row here comes from a successful server-verified Paystack checkout before access was granted.</p></div></header>

      <section className="adminGrid2" style={{marginBottom:20}}>
        <article className="adminRevenueCard"><span>TOTAL VERIFIED REVENUE</span><strong>{money(totals._sum.amount)}</strong><small>{totals._count} successful sale{totals._count === 1 ? "" : "s"}</small></article>
        <div className="adminSplitStats"><article><span>Project revenue</span><strong>{money(projectTotals._sum.amount)}</strong><small>{projectTotals._count} project sales</small></article><article><span>Course revenue</span><strong>{money(courseTotals._sum.amount)}</strong><small>{courseTotals._count} course sales</small></article></div>
      </section>

      {sales.length === 0 ? <div className="adminEmpty"><h2>No paid sales yet.</h2><p>Verified Paystack purchases will appear here automatically.</p></div> : (
        <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Date</th><th>Buyer</th><th>Type</th><th>Item</th><th>Amount</th><th>Provider</th><th>Reference</th></tr></thead><tbody>{sales.map(sale => <tr key={sale.id}><td>{sale.paidAt.toLocaleDateString()}<small>{sale.paidAt.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></td><td><strong>{sale.user.name ?? sale.user.username ?? "User"}</strong><small>{sale.user.email}</small></td><td><span className="adminBadge">{pretty(sale.target)}</span></td><td>{sale.project?.title ?? sale.course?.title ?? "Removed item"}</td><td className="adminMoney">{money(sale.amount, sale.currency)}</td><td>{sale.provider}</td><td><small>{sale.reference}</small></td></tr>)}</tbody></table></div>
      )}
      <p className="adminNote">Showing the 200 most recent verified purchases. Free project access and free course enrollments are not counted as sales.</p>
    </div>
  );
}
