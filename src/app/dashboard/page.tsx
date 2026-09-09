import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import "./dashboard.css";

const navItems = [
  ["H", "Home", "/dashboard"],
  ["P", "My Programme", "#programme"],
  ["AI", "Tekora AI", "#tekora-ai"],
  ["PR", "Projects", "#projects"],
  ["LAB", "Practicals", "#practicals"],
  ["R", "Research", "#research"],
  ["L", "Learn", "/learn"],
  ["C", "Community", "#community"],
  ["O", "Opportunities", "#opportunities"],
  ["S", "Store", "#store"],
  ["PF", "Portfolio", "#portfolio"],
];

function programmeSubjects(programme?: string | null) {
  const value = programme?.toLowerCase() ?? "";
  if (value.includes("electrical")) {
    return ["Circuit Analysis", "Electrical Machines", "Power Systems", "Control Systems", "Electronics", "MATLAB & Simulink", "Renewable Energy", "Protection", "IoT"];
  }
  if (value.includes("computer") || value.includes("software") || value.includes("information")) {
    return ["Programming", "Data Structures", "Databases", "Computer Networks", "Web Development", "Mobile Development", "Operating Systems", "AI & Data", "Cloud Computing"];
  }
  if (value.includes("mechanical")) {
    return ["Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "Machine Design", "CAD", "Manufacturing", "Materials", "Control", "Maintenance"];
  }
  return ["Core Concepts", "Mathematics", "Research Methods", "Simulation", "Project Work", "Laboratory Practice", "Technical Writing", "Data Analysis", "Industry Skills"];
}

function projectIdeas(programme?: string | null) {
  const value = programme?.toLowerCase() ?? "";
  if (value.includes("electrical")) {
    return [
      ["Power", "IoT Transformer Health Monitor", "Sensors · ESP8266 · LCD · dashboard"],
      ["Power", "Smart Energy Meter", "Metering · IoT · analytics"],
      ["Control", "Automatic Phase Selector", "Voltage sensing · relays · protection"],
      ["Renewable", "Solar PV Performance Monitor", "PV · sensors · data logging"],
      ["Protection", "Cable Fault Locator", "Detection · indication · fault history"],
      ["Control", "Temperature Controlled DC Fan", "LM35 · PWM · MOSFET"],
    ];
  }
  if (value.includes("computer") || value.includes("software") || value.includes("information")) {
    return [
      ["Web", "Campus Learning Portal", "Next.js · PostgreSQL · authentication"],
      ["Mobile", "Offline-first Student Toolkit", "React Native · local sync"],
      ["AI", "Academic Study Assistant", "Retrieval · structured tutoring"],
      ["IoT", "Smart Attendance Platform", "QR · APIs · dashboards"],
      ["Cloud", "Multi-tenant Student Marketplace", "SaaS · payments · storage"],
      ["Data", "Academic Performance Dashboard", "Analytics · reports · visualization"],
    ];
  }
  return [
    ["Applied", "Final-year project idea", "Problem · method · implementation"],
    ["Research", "Data-driven case study", "Dataset · analysis · results"],
    ["Practical", "Low-cost prototype", "Build · test · document"],
    ["Industry", "Process improvement project", "Observe · measure · improve"],
  ];
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: true,
      profile: { include: { institution: true, program: true } },
      skills: { include: { skill: true }, take: 8 },
      interests: { include: { interest: true }, take: 6 },
      enrollments: {
        orderBy: { enrolledAt: "desc" },
        take: 2,
        include: {
          progress: true,
          course: {
            include: {
              category: true,
              modules: { include: { lessons: { select: { id: true } } } },
            },
          },
        },
      },
    },
  });

  if (!user) redirect("/sign-in");

  const programme = user.profile?.program?.name ?? "Your programme";
  const subjects = programmeSubjects(programme);
  const projects = projectIdeas(programme);
  const initials = (user.name ?? user.username ?? "T").split(" ").map((value) => value[0]).join("").slice(0, 2).toUpperCase();
  const firstName = user.name?.split(" ")[0] ?? user.username ?? "Builder";
  const role = user.roles[0]?.role.toLowerCase() ?? "learner";

  return (
    <main className="tekoraDashboard">
      <aside className="dashboardSidebar">
        <Link href="/" className="dashboardBrand"><span className="dashboardBrandMark">T</span><span>Tekora</span></Link>
        <nav className="dashboardNav" aria-label="Dashboard navigation">
          {navItems.map(([icon, label, href], index) => (
            <Link className={index === 0 ? "active" : ""} href={href} key={label}>
              <span className="dashboardNavIcon">{icon}</span><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="dashboardSidebarBottom">
          <div className="dashboardProfileMini"><span className="dashboardAvatar">{initials}</span><div><strong>{user.name ?? user.username}</strong><span>{role}</span></div></div>
        </div>
      </aside>

      <section className="dashboardMainShell">
        <header className="dashboardTopbarPremium">
          <Link href="/" className="dashboardMobileBrand"><span>T</span><span>Tekora</span></Link>
          <label className="dashboardSearch"><span>⌕</span><input aria-label="Search Tekora" placeholder="Search a topic, project, MATLAB question, research idea..." /></label>
          <div className="dashboardTopbarActions"><button className="dashboardIconButton" type="button" aria-label="Notifications">○</button><span className="dashboardTopbarAvatar">{initials}</span></div>
        </header>

        <div className="dashboardContent">
          <section className="dashboardWelcome">
            <div>
              <span className="dashboardCardLabel">YOUR ACADEMIC + PRACTICAL WORKSPACE</span>
              <h1>What are you working on today, {firstName}?</h1>
              <p>{programme} · {user.profile?.level ?? "Tertiary learner"} · {user.profile?.institution?.name ?? "Independent learner"}</p>
            </div>
            <Link href="#tekora-ai" className="dashboardWelcomeAction">Ask Tekora →</Link>
          </section>

          <section className="dashboardPrimaryActions" id="tekora-ai">
            <article className="dashboardPrimaryCard featured">
              <span className="dashboardActionIcon">AI</span>
              <div><span className="dashboardCardLabel">TEKORA TUTOR</span><h2>Ask about anything you are studying.</h2><p>Explain a concept, solve and understand a question, debug MATLAB, prepare for a test or break down your lecture notes.</p></div>
              <Link href="#">Ask Tekora →</Link>
            </article>
            <article className="dashboardPrimaryCard" id="projects"><span className="dashboardActionIcon">PR</span><div><span className="dashboardCardLabel">PROJECT WORK</span><h3>Find or continue a project.</h3><p>Ideas, components, block diagrams, code, simulation, implementation and defense preparation.</p></div><Link href="#project-library">Explore projects →</Link></article>
            <article className="dashboardPrimaryCard" id="research"><span className="dashboardActionIcon">R</span><div><span className="dashboardCardLabel">RESEARCH & THESIS</span><h3>Move your research forward.</h3><p>Topic development, proposal structure, methodology, IEEE references, analysis and defense guidance.</p></div><Link href="#">Research workspace →</Link></article>
            <article className="dashboardPrimaryCard" id="practicals"><span className="dashboardActionIcon">LAB</span><div><span className="dashboardCardLabel">PRACTICAL LAB</span><h3>Build something small today.</h3><p>Mini projects, wiring, simulations and guided experiments you can complete outside the classroom.</p></div><Link href="#mini-projects">Browse practicals →</Link></article>
          </section>

          <section className="dashboardSectionPremium" id="programme">
            <div className="dashboardSectionHeader">
              <div><span className="dashboardCardLabel">MY PROGRAMME</span><h2>{programme}</h2><p>Jump directly into the subjects and tools around your programme.</p></div>
              <Link href="/sign-up">Update programme →</Link>
            </div>
            <div className="dashboardSubjectGrid">
              {subjects.map((subject, index) => <Link href="#tekora-ai" className="dashboardSubjectCard" key={subject}><span>{String(index + 1).padStart(2, "0")}</span><strong>{subject}</strong><small>Learn · Ask · Practice</small></Link>)}
            </div>
          </section>

          <section className="dashboardSectionPremium" id="project-library">
            <div className="dashboardSectionHeader">
              <div><span className="dashboardCardLabel">PROJECTS FOR YOUR PROGRAMME</span><h2>Build something that matters.</h2><p>Project ideas are separated by area so you can find something that fits your interests and level.</p></div>
              <Link href="#">View project library →</Link>
            </div>
            <div className="dashboardProjectGrid">
              {projects.slice(0, 4).map(([area, title, meta]) => (
                <article className="dashboardProjectCard" key={title}>
                  <div className="dashboardProjectTop"><span>{area}</span><em>Project guide</em></div>
                  <h3>{title}</h3><p>{meta}</p>
                  <div className="dashboardProjectActions"><Link href="#">View guide →</Link><Link href="#store">Get kit</Link></div>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboardTwoColumn" id="mini-projects">
            <article className="dashboardPanel practicalSpotlight">
              <span className="dashboardCardLabel">PRACTICAL THIS WEEK</span>
              <h2>{projects[projects.length - 1]?.[1] ?? "Build a practical prototype"}</h2>
              <p>{projects[projects.length - 1]?.[2] ?? "A guided mini project you can complete and understand."}</p>
              <div className="dashboardPracticalMeta"><span>Beginner-friendly</span><span>Build · Test · Understand</span></div>
              <div className="dashboardInlineActions"><Link href="#">View build guide →</Link><Link href="#store">Get complete kit</Link></div>
            </article>

            <article className="dashboardPanel researchPanel">
              <span className="dashboardCardLabel">RESEARCH ASSISTANT</span>
              <h2>Bring your final-year work into one workspace.</h2>
              <div className="dashboardResearchList">
                <span>Topic & problem definition</span><span>Literature review guidance</span><span>Methodology & simulation</span><span>IEEE references</span><span>Results & defense preparation</span>
              </div>
              <Link href="#" className="dashboardTextLink">Open research workspace →</Link>
            </article>
          </section>

          <section className="dashboardSectionPremium compactLearning">
            <div className="dashboardSectionHeader"><div><span className="dashboardCardLabel">STRUCTURED LEARNING</span><h2>Continue a course when you need depth.</h2><p>Courses support your programme—they are not the whole Tekora experience.</p></div><Link href="/learn">Browse courses →</Link></div>
            <div className="dashboardCourseGrid">
              {user.enrollments.length === 0 ? (
                <div className="dashboardEmptyCourse"><div><h3>No active courses yet.</h3><p>Use courses when you want a deeper structured path around a subject or skill.</p></div><Link href="/learn" className="dashboardWelcomeAction">Explore learning →</Link></div>
              ) : user.enrollments.map((enrollment) => {
                const totalLessons = enrollment.course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
                const completedLessons = enrollment.progress.filter((item) => item.completed).length;
                const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                return <article className="dashboardCourseCard" key={enrollment.id}><div className="dashboardCourseTop"><span className="dashboardCourseBadge">{enrollment.course.category?.name?.slice(0, 2).toUpperCase() ?? "TK"}</span><span className="dashboardCourseStatus">{completedLessons}/{totalLessons} lessons</span></div><div><h3>{enrollment.course.title}</h3><p>{enrollment.course.category?.name ?? "Tekora course"}</p></div><div className="dashboardProgressTrack"><span style={{ width: `${progress}%` }} /></div><div className="dashboardProgressMeta"><span>{progress}% complete</span><span>{Math.max(totalLessons - completedLessons, 0)} left</span></div><Link href={`/learn/course/${enrollment.courseId}`} className="dashboardCourseLink">Continue →</Link></article>;
              })}
            </div>
          </section>

          <section className="dashboardStoreSection" id="store">
            <div><span className="dashboardCardLabel">TEKORA BUILD KITS</span><h2>Stop hunting for every resistor, sensor and jumper wire.</h2><p>Projects can connect directly to complete component bundles so learners can go from idea to working prototype faster.</p></div>
            <div className="dashboardKitCards"><article><span>STARTER KIT</span><strong>Electronics & Arduino essentials</strong><small>Breadboard · resistors · LEDs · jumpers · sensors</small><Link href="#">Coming soon →</Link></article><article><span>PROJECT KIT</span><strong>Buy exactly what a project needs</strong><small>Components matched to a Tekora build guide</small><Link href="#">Browse kits →</Link></article></div>
          </section>

          <section className="dashboardTwoColumn" id="community">
            <article className="dashboardPanel"><div className="dashboardPanelHeader"><h3>People on your path</h3><Link href="#">Community →</Link></div><p className="dashboardPanelCopy">Find students studying similar subjects, form project teams and learn with people who understand what you are working on.</p><div className="dashboardTagRow">{user.interests.slice(0, 4).map(({ id, interest }) => <span key={id}>{interest.name}</span>)}{user.interests.length === 0 ? <span>{programme}</span> : null}</div></article>
            <article className="dashboardPanel" id="opportunities"><div className="dashboardPanelHeader"><h3>Beyond campus</h3><Link href="#">Opportunities →</Link></div><div className="dashboardOpportunityList"><div className="dashboardOpportunity"><span>WORKSHOPS</span><h4>Hands-on sessions and bootcamps.</h4><p>Practice with mentors, creators and partner institutions.</p></div><div className="dashboardOpportunity"><span>INTERNSHIPS</span><h4>Turn your project evidence into opportunity.</h4><p>Future matching will use what you have actually learned and built.</p></div></div></article>
          </section>

          <section className="dashboardBottomCta" id="portfolio"><div><span className="dashboardCardLabel">YOUR TEKORA IDENTITY</span><h3>Everything you learn and build should strengthen your story.</h3><p>Subjects, projects, practicals, research, skills and evidence can eventually become one credible portfolio of what you can actually do.</p></div><Link href="#">View portfolio →</Link></section>
        </div>
      </section>
    </main>
  );
}
