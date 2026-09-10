import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { findSubject, getProgrammeCatalog } from "@/lib/academic-catalog";
import "../../dashboard/dashboard.css";
import "../programme.css";

const navItems = [
  ["H", "Home", "/dashboard"],
  ["P", "My Programme", "/programme"],
  ["AI", "Tekora AI", "/dashboard#tekora-ai"],
  ["PR", "Projects", "/dashboard#projects"],
  ["LAB", "Practicals", "/dashboard#practicals"],
  ["R", "Research", "/dashboard#research"],
  ["L", "Learn", "/learn"],
  ["C", "Community", "/dashboard#community"],
  ["O", "Opportunities", "/dashboard#opportunities"],
  ["S", "Store", "/dashboard#store"],
  ["PF", "Portfolio", "/dashboard#portfolio"],
];

export default async function SubjectPage({ params }: { params: Promise<{ subjectSlug: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: true,
      profile: { include: { institution: true, program: true } },
    },
  });

  if (!user) redirect("/sign-in");

  const { subjectSlug } = await params;
  const programmeName = user.profile?.program?.name ?? null;
  const catalog = getProgrammeCatalog(programmeName);
  const subject = findSubject(programmeName, subjectSlug);
  if (!subject) notFound();

  const initials = (user.name ?? user.username ?? "T")
    .split(" ")
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const role = user.roles[0]?.role.toLowerCase() ?? "learner";

  const support = [
    ["TUTOR", "Understand the difficult parts", "Ask Tekora to explain concepts, walk through examples and test your understanding."],
    ["PROJECTS", "Connect theory to project work", `Find ${subject.area.toLowerCase()} project ideas that use what you learn in ${subject.name}.`],
    ["PRACTICALS", "Build and simulate", "Use guided labs, simulations, circuits or code to turn the theory into something visible."],
    ["RESEARCH", "Use the subject in research", "Get help framing technical questions, methodology, analysis and credible academic references."],
  ];

  return (
    <main className="tekoraDashboard programmeShell">
      <aside className="dashboardSidebar">
        <Link href="/" className="dashboardBrand"><span className="dashboardBrandMark">T</span><span>Tekora</span></Link>
        <nav className="dashboardNav" aria-label="Dashboard navigation">
          {navItems.map(([icon, label, href]) => (
            <Link className={label === "My Programme" ? "active" : ""} href={href} key={label}>
              <span className="dashboardNavIcon">{icon}</span><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="dashboardSidebarBottom">
          <div className="dashboardProfileMini"><span className="dashboardAvatar">{initials}</span><div><strong>{user.name ?? user.username}</strong><span>{role}</span></div></div>
        </div>
      </aside>

      <section className="dashboardMainShell programmeMainShell">
        <header className="dashboardTopbarPremium">
          <Link href="/" className="dashboardMobileBrand"><span>T</span><span>Tekora</span></Link>
          <label className="dashboardSearch"><span>⌕</span><input aria-label={`Search ${subject.name}`} placeholder={`Search ${subject.name} topics and questions...`} /></label>
          <div className="dashboardTopbarActions"><span className="dashboardTopbarAvatar">{initials}</span></div>
        </header>

        <div className="programmeContent">
          <section className="subjectHero">
            <div className="subjectHeroMain">
              <Link href="/programme" className="subjectBack">← Back to My Programme</Link>
              <span className="programmeEyebrow">{subject.code} · {subject.area.toUpperCase()}</span>
              <h1>{subject.name}</h1>
              <p>{subject.description}</p>
              <div className="subjectMeta"><span>{subject.level}</span><span>{subject.semester}</span><span>{catalog.name}</span><span>{subject.topics.length} core topics</span></div>
            </div>
            <aside className="subjectHeroSide">
              <span>STUDY WITH TEKORA</span>
              <h2>Don’t just read the subject. Understand and apply it.</h2>
              <p>Move between explanations, examples, MATLAB or simulation help, practical builds, project ideas and research support without leaving the subject context.</p>
              <div className="subjectHeroActions"><Link href="/dashboard#tekora-ai">Ask Tekora →</Link><Link href="/dashboard#projects">See projects</Link></div>
            </aside>
          </section>

          <div className="subjectContentGrid">
            <div className="subjectMainColumn">
              <section className="subjectSection" id="topics">
                <span className="programmeEyebrow">CORE TOPICS</span>
                <h2>What you should understand.</h2>
                <p>Each topic can become its own guided Tekora learning workspace with explanations, examples, questions and practical context.</p>
                <div className="subjectTopicList">
                  {subject.topics.map((topic, index) => (
                    <article className="subjectTopicCard" key={topic.title}>
                      <span className="subjectTopicNumber">{String(index + 1).padStart(2, "0")}</span>
                      <div><strong>{topic.title}</strong><small>{topic.summary}</small></div>
                      <Link href="/dashboard#tekora-ai">Study with AI →</Link>
                    </article>
                  ))}
                </div>
              </section>

              <section className="subjectSection">
                <span className="programmeEyebrow">USE THE SUBJECT</span>
                <h2>Take it beyond lecture notes.</h2>
                <div className="subjectSupportGrid">
                  {support.map(([label, title, copy]) => (
                    <article className="subjectSupportCard" key={label}>
                      <span>{label}</span><h3>{title}</h3><p>{copy}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="subjectRail">
              <section className="subjectRailCard">
                <h3>Tools for this subject</h3>
                <div className="subjectToolList">{subject.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              </section>
              <section className="subjectRailCard">
                <h3>Need help right now?</h3>
                <p>Ask about a formula, upload a question, debug MATLAB, explain a circuit or break down a difficult topic.</p>
                <Link href="/dashboard#tekora-ai">Open Tekora Tutor →</Link>
              </section>
              <section className="subjectRailCard">
                <h3>Build with this knowledge</h3>
                <p>See project and practical ideas connected to {subject.area.toLowerCase()} and your programme.</p>
                <Link href="/dashboard#projects">Browse related projects →</Link>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
