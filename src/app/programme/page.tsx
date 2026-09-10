import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getProgrammeCatalog } from "@/lib/academic-catalog";
import "../dashboard/dashboard.css";
import "./programme.css";

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

export default async function ProgrammePage() {
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

  const programmeName = user.profile?.program?.name ?? null;
  const catalog = getProgrammeCatalog(programmeName);
  const displayProgramme = programmeName ?? catalog.name;
  const initials = (user.name ?? user.username ?? "T")
    .split(" ")
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const role = user.roles[0]?.role.toLowerCase() ?? "learner";
  const level = user.profile?.level ?? "Tertiary learner";

  const grouped = catalog.subjects.reduce<Record<string, typeof catalog.subjects>>((result, subject) => {
    const key = `${subject.level} · ${subject.semester}`;
    result[key] = [...(result[key] ?? []), subject];
    return result;
  }, {});

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
          <label className="dashboardSearch"><span>⌕</span><input aria-label="Search programme" placeholder={`Search ${displayProgramme} subjects and topics...`} /></label>
          <div className="dashboardTopbarActions"><Link href="/sign-up" className="programmeProfileButton">Update programme</Link><span className="dashboardTopbarAvatar">{initials}</span></div>
        </header>

        <div className="programmeContent">
          <section className="programmeHero">
            <div>
              <span className="programmeEyebrow">MY PROGRAMME</span>
              <h1>{displayProgramme}</h1>
              <p>{catalog.description}</p>
              <div className="programmeIdentityRow">
                <span>{user.profile?.institution?.name ?? "Independent learner"}</span>
                <span>{level}</span>
                <span>{catalog.subjects.length} subject areas</span>
              </div>
            </div>
            <aside className="programmeHeroAside">
              <span>YOUR PROGRAMME WORKSPACE</span>
              <strong>Study the subject. Ask questions. Build something.</strong>
              <p>Every subject connects to explanations, practice, projects, practicals, research and the tools you need.</p>
            </aside>
          </section>

          <section className="programmeQuickActions">
            <Link href="/dashboard#tekora-ai"><span>AI</span><div><strong>Ask Tekora Tutor</strong><small>Explain any topic from your programme</small></div><em>→</em></Link>
            <Link href="/dashboard#projects"><span>PR</span><div><strong>Programme projects</strong><small>Find final-year and mini project ideas</small></div><em>→</em></Link>
            <Link href="/dashboard#research"><span>R</span><div><strong>Research support</strong><small>Methodology, references and defense</small></div><em>→</em></Link>
            <Link href="/dashboard#practicals"><span>LAB</span><div><strong>Practical lab</strong><small>Build and simulate real systems</small></div><em>→</em></Link>
          </section>

          <section className="programmeAreasSection">
            <div className="programmeSectionHeader">
              <div><span className="programmeEyebrow">AREAS IN YOUR FIELD</span><h2>Explore by specialization.</h2></div>
            </div>
            <div className="programmeAreaRow">
              {catalog.areas.map((area) => <span key={area}>{area}</span>)}
            </div>
          </section>

          <section className="programmeCurriculumSection">
            <div className="programmeSectionHeader">
              <div><span className="programmeEyebrow">ACADEMIC MAP</span><h2>Your subjects and learning tools.</h2><p>This starter curriculum gives Tekora context around your field. University-specific curricula can be added later.</p></div>
            </div>

            <div className="programmeGroups">
              {Object.entries(grouped).map(([groupName, subjects]) => (
                <section className="programmeGroup" key={groupName}>
                  <div className="programmeGroupTitle"><h3>{groupName}</h3><span>{subjects.length} subjects</span></div>
                  <div className="programmeSubjectGrid">
                    {subjects.map((subject) => (
                      <Link href={`/programme/${subject.slug}`} className="programmeSubjectCard" key={subject.slug}>
                        <div className="programmeSubjectTop"><span>{subject.code}</span><em>{subject.area}</em></div>
                        <h3>{subject.name}</h3>
                        <p>{subject.description}</p>
                        <div className="programmeToolRow">{subject.tools.slice(0, 3).map((tool) => <span key={tool}>{tool}</span>)}</div>
                        <div className="programmeSubjectBottom"><span>{subject.topics.length} topics</span><strong>Open subject →</strong></div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="programmeSupportSection">
            <div>
              <span className="programmeEyebrow">TEKORA + YOUR UNIVERSITY</span>
              <h2>Not every university teaches the same curriculum.</h2>
              <p>Tekora’s programme map is designed to adapt. Institutions can later publish their exact levels, semesters, subjects and practical requirements while students still keep access to the wider Tekora knowledge base.</p>
            </div>
            <Link href="/sign-up" className="programmePrimaryButton">Check my programme details →</Link>
          </section>
        </div>
      </section>
    </main>
  );
}
