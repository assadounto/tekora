import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      roles: true,
      profile: { include: { institution: true, program: true } },
      _count: { select: { enrollments: true, projectEntitlements: true, projectRequests: true, purchases: true } },
    },
  });

  return (
    <div className="adminPage">
      <header className="adminPageHead"><div><span className="adminEyebrow">PEOPLE</span><h1>Users</h1><p>See who is joining Tekora, their programme context, and how they are using projects and courses.</p></div></header>

      {users.length === 0 ? <div className="adminEmpty"><h2>No users yet.</h2><p>New Tekora accounts will appear here.</p></div> : (
        <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>User</th><th>Role</th><th>Programme</th><th>Projects</th><th>Courses</th><th>Requests</th><th>Purchases</th><th>Joined</th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td><strong>{user.name ?? user.username ?? "Unnamed user"}</strong><small>{user.email}</small></td><td>{user.roles.length ? user.roles.map(item => pretty(item.role)).join(", ") : "Learner"}</td><td>{user.profile?.program?.name ?? "—"}<small>{user.profile?.institution?.name ?? user.profile?.level ?? ""}</small></td><td>{user._count.projectEntitlements}</td><td>{user._count.enrollments}</td><td>{user._count.projectRequests}</td><td>{user._count.purchases}</td><td>{user.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table></div>
      )}
      <p className="adminNote">Showing the 100 most recently created accounts.</p>
    </div>
  );
}
