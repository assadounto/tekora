import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdminUser } from "@/lib/admin";
import { userProjectLibrary } from "@/modules/projects/service";
import "./dashboard.css";

export const dynamic = "force-dynamic";

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
      enrollments: {
        orderBy: { enrolledAt: "desc" },
        take: 3,
        include: { course: { include: { category: true } } },
      },
    },
  });
  if (!user) redirect("/sign-in");

  const admin = await isAdminUser(user.id);
  const { created, acquired } = await userProjectLibrary(user.id);
  const programme = user.profile?.program?.name ?? "Your programme";
  const firstName = user.name?.split(" ")[0] ?? user.username ?? "Builder";
  const initials = (user.name ?? user.username ?? "T").split(" ").map(value => value[0]).join("").slice(0, 2).toUpperCase();
  const role = admin ? "admin" : (user.roles[0]?.role.toLowerCase() ?? "learner");

  const navItems = [
    ["H", "Home", "/dashboard"],
    ["PR", "My Projects", "/projects/my"],
    ["MK", "Projects", "/projects"],
    ["L", "My Courses", "/learn"],
    ["RQ", "Request Project", "/projects/request"],
    ["P", "My Programme", "/programme"],
    ...(admin ? [["AD", "Admin Studio", "/admin"]] : []),
  ];

  const recommended = await db.project.findMany({
    where: {
      status: "PUBLISHED",
      ...(user.profile?.program?.name ? { field: { contains: user.profile.program.name.split(" ")[0], mode: "insensitive" } } : {}),
      ...(acquired.length ? { id: { notIn: acquired.map(item => item.projectId) } } : {}),
    },
    take: 4,
    orderBy: { publishedAt: "desc" },
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
          <label className="dashboardSearch"><span>⌕</span><input aria-label="Search Tekora" placeholder="Search projects, courses, fields..." /></label>
          <div className="dashboardTopbarActions">{admin ? <Link href="/admin" className="dashboardWelcomeAction">Admin Studio</Link> : <Link href="/projects" className="dashboardWelcomeAction">Browse Projects</Link>}<span className="dashboardTopbarAvatar">{initials}</span></div>
        </header>

        <div className="dashboardContent">
          <section className="dashboardWelcome">
            <div><span className="dashboardCardLabel">YOUR TEKORA LIBRARY</span><h1>Welcome back, {firstName}.</h1><p>{programme} · {user.profile?.level ?? "Tertiary learner"} · {user.profile?.institution?.name ?? "Independent learner"}</p></div>
            <Link href="/projects" className="dashboardWelcomeAction">Explore projects →</Link>
          </section>

          <section className="dashboardSummaryGrid dashboardProjectSummary">
            <article className="dashboardGoalCard"><span className="dashboardCardLabel">YOUR ACCESS</span><h2>Your projects and courses stay connected to your account.</h2><div className="dashboardGoalMeta"><span>{acquired.length} projects</span><span>{user.enrollments.length} courses</span>{admin ? <span>{created.length} admin projects</span> : null}</div></article>
            <article className="dashboardMetricCard"><span>My Projects</span><strong>{acquired.length}</strong><small>Free or purchased access</small></article>
            <article className="dashboardMetricCard"><span>My Courses</span><strong>{user.enrollments.length}</strong><small>Free or purchased learning</small></article>
            <article className="dashboardMetricCard"><span>Skills tracked</span><strong>{user.skills.length}</strong><small>Connected to your Tekora identity</small></article>
          </section>

          <section className="dashboardPrimaryActions">
            <article className="dashboardPrimaryCard featured"><span className="dashboardActionIcon">MK</span><div><span className="dashboardCardLabel">PROJECT MARKETPLACE</span><h2>Find your next project.</h2><p>Browse free and paid Tekora projects across engineering, software, mechanical work, carpentry and more.</p></div><Link href="/projects">Browse projects →</Link></article>
            <article className="dashboardPrimaryCard"><span className="dashboardActionIcon">PR</span><div><span className="dashboardCardLabel">MY PROJECTS</span><h3>Continue what you unlocked.</h3><p>Every free or purchased project you add appears in your account library.</p></div><Link href="/projects/my">Open my projects →</Link></article>
            <article className="dashboardPrimaryCard"><span className="dashboardActionIcon">L</span><div><span className="dashboardCardLabel">COURSES</span><h3>Learn when you need more depth.</h3><p>Browse Tekora courses, enroll in free courses or buy paid courses.</p></div><Link href="/learn">Explore courses →</Link></article>
            <article className="dashboardPrimaryCard"><span className="dashboardActionIcon">RQ</span><div><span className="dashboardCardLabel">REQUEST A PROJECT</span><h3>Can’t find what you need?</h3><p>Send Tekora your project idea, field, difficulty, budget and support needed.</p></div><Link href="/projects/request">Submit request →</Link></article>
          </section>

          {admin ? <section className="dashboardStoreSection"><div><span className="dashboardCardLabel">ADMIN STUDIO</span><h2>Run Tekora from one private workspace.</h2><p>Create projects and courses, review student requests, manage users and watch verified Paystack sales.</p><Link href="/admin" className="dashboardWelcomeAction">Open Admin Studio →</Link></div><div className="dashboardKitCards"><article><span>CONTENT</span><strong>Projects & Courses</strong><small>Create · price · publish · manage</small><Link href="/admin/projects">Manage content →</Link></article><article><span>OPERATIONS</span><strong>Requests & Sales</strong><small>Demand · users · verified purchases</small><Link href="/admin/project-requests">Review requests →</Link></article></div></section> : null}

          <section className="dashboardSectionPremium" id="my-projects">
            <div className="dashboardSectionHeader"><div><span className="dashboardCardLabel">MY PROJECTS</span><h2>Projects you have access to.</h2><p>Free and purchased projects appear here after you unlock them.</p></div><Link href="/projects/my">View all →</Link></div>
            {acquired.length === 0 ? <div className="dashboardEmptyCourse"><div><h3>No projects in your library yet.</h3><p>Browse the marketplace and add a free project or unlock a paid one.</p></div><Link href="/projects" className="dashboardWelcomeAction">Find a project →</Link></div> : <div className="dashboardProjectGrid">{acquired.slice(0, 4).map(item => <article className="dashboardProjectCard" key={item.id}><div className="dashboardProjectTop"><span>{item.project.field}</span><em>{item.acquisition === "PURCHASE" ? "Purchased" : "Free access"}</em></div><h3>{item.project.title}</h3><p>{item.project.summary}</p><div className="dashboardProjectMeta"><span>{item.project.phases.length} phases</span><span>{pretty(item.project.difficulty)}</span></div><div className="dashboardProjectActions"><Link href={`/projects/${item.project.slug}`}>Open project →</Link></div></article>)}</div>}
          </section>

          <section className="dashboardSectionPremium">
            <div className="dashboardSectionHeader"><div><span className="dashboardCardLabel">MY COURSES</span><h2>Your course library.</h2><p>Courses you enrolled in or purchased remain attached to your account.</p></div><Link href="/learn">Browse courses →</Link></div>
            {user.enrollments.length === 0 ? <div className="dashboardEmptyCourse"><div><h3>No courses yet.</h3><p>Browse free and paid Tekora courses when you need structured learning.</p></div><Link href="/learn" className="dashboardWelcomeAction">Explore courses →</Link></div> : <div className="dashboardProjectGrid">{user.enrollments.map(item => <article className="dashboardProjectCard" key={item.id}><div className="dashboardProjectTop"><span>{item.course.category?.name ?? "Course"}</span><em>{item.course.access === "FREE" ? "Free" : "Paid"}</em></div><h3>{item.course.title}</h3><p>{item.course.description ?? "Structured Tekora learning."}</p><div className="dashboardProjectActions"><Link href={`/learn/course/${item.courseId}`}>Open course →</Link></div></article>)}</div>}
          </section>

          <section className="dashboardSectionPremium">
            <div className="dashboardSectionHeader"><div><span className="dashboardCardLabel">DISCOVER PROJECTS</span><h2>What could you build next?</h2><p>Published projects related to your programme can appear here.</p></div><Link href="/projects">See marketplace →</Link></div>
            {recommended.length === 0 ? <div className="dashboardEmptyCourse"><div><h3>More projects are coming.</h3><p>If you need a specific project, send Tekora a request with your budget.</p></div><Link href="/projects/request" className="dashboardWelcomeAction">Request a project →</Link></div> : <div className="dashboardProjectGrid">{recommended.map(project => <article className="dashboardProjectCard" key={project.id}><div className="dashboardProjectTop"><span>{project.field}</span><em>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</em></div><h3>{project.title}</h3><p>{project.summary}</p><div className="dashboardProjectMeta"><span>{project.area ?? "General"}</span><span>{pretty(project.difficulty)}</span></div><div className="dashboardProjectActions"><Link href={`/projects/${project.slug}`}>View project →</Link></div></article>)}</div>}
          </section>

          <section className="dashboardTwoColumn"><article className="dashboardPanel"><div className="dashboardPanelHeader"><h3>My programme</h3><Link href="/programme">Open →</Link></div><p className="dashboardPanelCopy">{programme} helps Tekora surface more relevant projects and courses.</p></article><article className="dashboardPanel"><div className="dashboardPanelHeader"><h3>Need something specific?</h3><Link href="/projects/request">Request project →</Link></div><p className="dashboardPanelCopy">Tell us the project you want, what it should do and the budget you are working with.</p></article></section>
        </div>
      </section>
    </main>
  );
}
