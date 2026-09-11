import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdminUser } from "@/lib/admin";
import { AdminNav } from "@/components/admin-nav";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  if (!(await isAdminUser(session.user.id))) redirect("/dashboard");

  const admin = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true, email: true },
  });
  const displayName = admin?.name ?? admin?.username ?? "Tekora Admin";
  const initials = displayName.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="adminShell">
      <aside className="adminSidebar">
        <Link href="/admin" className="adminBrand"><span>T</span><div><strong>Tekora</strong><small>Admin Studio</small></div></Link>
        <AdminNav />
        <div className="adminSidebarBottom">
          <Link href="/dashboard" className="adminBackLink">← Student dashboard</Link>
          <div className="adminIdentity"><span>{initials}</span><div><strong>{displayName}</strong><small>{admin?.email}</small></div></div>
        </div>
      </aside>
      <section className="adminMain">
        <header className="adminMobileBar"><Link href="/admin" className="adminMobileBrand"><span>T</span><strong>Admin</strong></Link><Link href="/dashboard">Dashboard</Link></header>
        {children}
      </section>
    </main>
  );
}
