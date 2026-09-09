import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const nav = ["Home", "Learn", "Projects", "Circles", "People", "Portfolio"];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: true,
      profile: { include: { institution: true, program: true } },
      skills: { include: { skill: true }, take: 4 },
      interests: { include: { interest: true }, take: 4 },
    },
  });

  if (!user) redirect("/sign-in");

  const initials = (user.name ?? user.username ?? "T").split(" ").map(v => v[0]).join("").slice(0, 2).toUpperCase();
  const role = user.roles[0]?.role.toLowerCase() ?? "learner";
  const items = [
    ["Your field", user.profile?.program?.name ?? "Choose your learning path", user.profile?.level ?? "Set your level"],
    ["Institution", user.profile?.institution?.name ?? "Independent learner", "Your learning home"],
    ["Skills", user.skills.map(s => s.skill.name).join(" · ") || "Add your first skill", user.skills.length + " tracked"],
    ["Interests", user.interests.map(i => i.interest.name).join(" · ") || "Tell Tekora what interests you", user.interests.length + " selected"],
  ];

  return (
    <main className="appShell">
      <aside className="sidebar">
        <Link href="/" className="brandMark">TEKORA</Link>
        <nav>{nav.map((item,index)=><a className={index===0?"activeNav":""} href="#" key={item}>{item}</a>)}</nav>
        <div className="sidebarFooter"><span className="avatar">{initials}</span><div><strong>{user.name ?? user.username}</strong><small>{role}</small></div></div>
      </aside>

      <section className="dashboardMain">
        <header className="dashboardTopbar">
          <div><p className="eyebrow">YOUR TEKORA</p><h1>Good to see you, {user.name?.split(" ")[0] ?? user.username}.</h1></div>
          <Link href="/onboarding" className="headerCta">Update path</Link>
        </header>

        <section className="dashboardGrid">
          {items.map(([label,title,meta])=><article className="panel" key={label}><small>{label}</small><h2>{title}</h2><p>{meta}</p></article>)}
        </section>

        <section className="dashboardSection">
          <div className="sectionTitle"><div><p className="eyebrow">YOUR GOAL</p><h2>{user.profile?.goal ?? "Tell Tekora what you want to achieve next."}</h2></div></div>
        </section>
      </section>
    </main>
  );
}