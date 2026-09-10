import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { userProjectLibrary } from "@/modules/projects/service";
import "./dashboard.css";

export const dynamic = "force-dynamic";

const navItems = [
  ["H", "Home", "/dashboard"],
  ["PR", "My Projects", "/projects/my"],
  ["+", "Create Project", "/projects/new"],
  ["MK", "Marketplace", "/projects"],
  ["P", "My Programme", "/programme"],
  ["AI", "Tekora AI", "#tekora-ai"],
  ["R", "Research", "#research"],
  ["L", "Learn", "/learn"],
];

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: true,
      profile: { include: { institution: true, program: true } },
      skills: { include: { skill: true }, take: 6 },
      interests: { include: { interest: true }, take: 6 },
    },
  });
  if (!user) redirect("/sign-in");

  const { created, acquired } = await userProjectLibrary(user.id);
  const programme = user.profile?.program?.name ?? "Your programme";
  const firstName = user.name?.split(" ")[0] ?? user.username ?? "Builder";
  const initials = (user.name ?? user.username ?? "T").split(" ").map(value => value[0]).join("").slice(0, 2).toUpperCase();
  const role = user.roles[0]?.role.toLowerCase() ?? "learner";

  const recommended = await db.project.findMany({
    where: {
      status: "PUBLISHED",
      creatorId: { not: user.id },
      ...(user.profile?.program?.name ? { field: { contains: user.profile.program.name.split(" ")[0], mode: "insensitive" } } : {}),
    },
    take: 4,
    orderBy: { publishedAt: "desc" },
    include: { creator: { select: { name: true, username: true } } },
  });

  return (
    <main className="tekoraDashboard">
      <aside className="dashboardSidebar">
        <Link href="/" className="dashboardBrand"><span className="dashboardBrandMark">T</span><span>Tekora</span></Link>
        <nav className="dashboardNav" aria-label="Dashboard navigation">
          {navItems.map(([icon, label, href], index) => <Link className={index === 0 ? "active" : ""} href={href} key={label}><span className="dashboardNavIcon">{icon}</span><span>{label}</span></Link>)}
        </nav>
        <div className="dashboardSidebarBottom"><div className="dashboardProfileMini"><span className="dashboardAvatar">{initials}</span><div><strong>{user.name ?? user.username}</strong><span>{role}</span></div></div></div>
      </aside>

      <section className="dashboardMainShell">
        <header className="dashboardTopbarPremium">
          <Link href="/" className="dashboardMobileBrand"><span>T</span><span>Tekora</span></Link>
          <label className="dashboardSearch"><span>⌕</span><input aria-label="Search Tekora" placeholder="Search projects, fields, project ideas..." /></label>
          <div className="dashboardTopbarActions"><Link href="/projects/new" className="dashboardWelcomeAction">+ Create project</Link><span className="dashboardTopbarAvatar">{initials}</span></div>
        </header>

        <div className="dashboardContent">
          <section className="dashboardWelcome">
            <div><span className="dashboardCardLabel">YOUR TEKORA PROJECT WORKSPACE</span><h1>Welcome back, {firstName}.</h1><p>{programme} · {user.profile?.level ?? "Tertiary learner"} · {user.profile?.institution?.name ?? "Independent learner"}</p></div>
            <Link href="/projects" className="dashboardWelcomeAction">Explore projects →</Link>
          </section>

          <section className="dashboardSummaryGrid dashboardProjectSummary">
            <article className="dashboardGoalCard"><span className="dashboardCardLabel">MY PROJECTS</span><h2>Build, manage and continue your projects from one place.</h2><div className="dashboardGoalMeta"><span>{created.length} created</span><span>{acquired.length} acquired</span><span>{created.length + acquired.length} total</span></div></article>
            <article className="dashboardMetricCard"><span>Created by you</span><strong>{created.length}</strong><small>Draft and published projects</small></article>
            <article className="dashboardMetricCard"><span>Your access</span><strong>{acquired.length}</strong><small>Free or purchased projects</small></article>
            <article className="dashboardMetricCard"><span>Skills tracked</span><strong>{user.skills.length}</strong><small>Connected to your Tekora identity</small></article>
          </section>

          <section className="dashboardPrimaryActions" id="tekora-ai">
            <article className="dashboardPrimaryCard featured"><span className="dashboardActionIcon">MK</span><div><span className="dashboardCardLabel">PROJECT MARKETPLACE</span><h2>Find your next project.</h2><p>Browse free and paid projects across engineering, software, mechanical work, carpentry and more.</p></div><Link href="/projects">Browse marketplace →</Link></article>
            <article className="dashboardPrimaryCard"><span className="dashboardActionIcon">+</span><div><span className="dashboardCardLabel">CREATE</span><h3>Create your own project.</h3><p>Turn an idea into a Tekora project, choose Free or Paid, then publish it publicly.</p></div><Link href="/projects/new">Create project →</Link></article>
            <article className="dashboardPrimaryCard"><span className="dashboardActionIcon">RQ</span><div><span className="dashboardCardLabel">REQUEST</span><h3>Can’t find what you need?</h3><p>Request a project by describing your field, idea, budget and the help you need.</p></div><Link href="/projects/request">Request project →</Link></article>
            <article className="dashboardPrimaryCard"><span className="dashboardActionIcon">AI</span><div><span className="dashboardCardLabel">PROJECT ASSISTANT</span><h3>Understand what you are building.</h3><p>Use Tekora to explain components, code, calculations, testing, documentation and defense.</p></div><Link href="#">Ask Tekora →</Link></article>
          </section>

          <section className="dashboardSectionPremium" id="my-projects">
            <div className="dashboardSectionHeader"><div><span className="dashboardCardLabel">MY PROJECTS</span><h2>Projects connected to your account.</h2><p>Your own projects and projects you have unlocked appear here.</p></div><Link href="/projects/my">View all →</Link></div>

            {created.length + acquired.length === 0 ? (
              <div className="dashboardEmptyCourse"><div><h3>Your project library is empty.</h3><p>Choose a project from the marketplace or create your own.</p></div><Link href="/projects" className="dashboardWelcomeAction">Find a project →</Link></div>
            ) : (
              <div className="dashboardProjectGrid">
                {created.slice(0, 2).map(project => <article className="dashboardProjectCard" key={project.id}><div className="dashboardProjectTop"><span>{project.field}</span><em>Owner · {pretty(project.status)}</em></div><h3>{project.title}</h3><p>{project.summary}</p><div className="dashboardProjectMeta"><span>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</span><span>{pretty(project.difficulty)}</span></div><div className="dashboardProjectActions"><Link href={`/projects/manage/${project.id}`}>Manage →</Link>{project.status === "PUBLISHED" ? <Link href={`/projects/${project.slug}`}>Public view</Link> : null}</div></article>)}
                {acquired.slice(0, 2).map(item => <article className="dashboardProjectCard" key={item.id}><div className="dashboardProjectTop"><span>{item.project.field}</span><em>{item.acquisition === "PURCHASE" ? "Purchased" : "Free access"}</em></div><h3>{item.project.title}</h3><p>{item.project.summary}</p><div className="dashboardProjectMeta"><span>{item.project.phases.length} phases</span><span>{pretty(item.project.difficulty)}</span></div><div className="dashboardProjectActions"><Link href={`/projects/${item.project.slug}`}>Open project →</Link></div></article>)}
              </div>
            )}
          </section>

          <section className="dashboardSectionPremium">
            <div className="dashboardSectionHeader"><div><span className="dashboardCardLabel">DISCOVER</span><h2>Projects you may want to build next.</h2><p>Published projects related to your programme can appear here.</p></div><Link href="/projects">See marketplace →</Link></div>
            {recommended.length === 0 ? <div className="dashboardEmptyCourse"><div><h3>More projects are coming.</h3><p>Browse the full marketplace or create the first project in your area.</p></div><Link href="/projects/new" className="dashboardWelcomeAction">Create a project →</Link></div> : <div className="dashboardProjectGrid">{recommended.map(project => <article className="dashboardProjectCard" key={project.id}><div className="dashboardProjectTop"><span>{project.field}</span><em>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</em></div><h3>{project.title}</h3><p>{project.summary}</p><div className="dashboardProjectMeta"><span>{project.area ?? "General"}</span><span>{project.creator.name ?? project.creator.username ?? "Tekora creator"}</span></div><div className="dashboardProjectActions"><Link href={`/projects/${project.slug}`}>View project →</Link></div></article>)}</div>}
          </section>

          <section className="dashboardTwoColumn">
            <article className="dashboardPanel" id="programme"><div className="dashboardPanelHeader"><h3>My programme</h3><Link href="/programme">Open →</Link></div><p className="dashboardPanelCopy">{programme} gives Tekora context for the projects, topics and practical work most relevant to you.</p><div className="dashboardTagRow"><span>{user.profile?.level ?? "Set your level"}</span>{user.interests.slice(0, 3).map(({ id, interest }) => <span key={id}>{interest.name}</span>)}</div></article>
            <article className="dashboardPanel" id="research"><div className="dashboardPanelHeader"><h3>Project documentation</h3><Link href="#">Research support →</Link></div><p className="dashboardPanelCopy">Use Tekora to understand and document your objectives, methodology, implementation, testing, results and defense—not just copy a report.</p></article>
          </section>

          <section className="dashboardBottomCta"><div><span className="dashboardCardLabel">TEKORA PROJECTS</span><h3>Find it. Build it. Understand it. Own the skill.</h3><p>Your project library should become evidence of what you can actually create and explain.</p></div><Link href="/projects">Explore marketplace →</Link></section>
        </div>
      </section>
    </main>
  );
}
