import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import "./dashboard.css";

const navItems = [
  ["H", "Home", "/dashboard"],
  ["L", "Learn", "/learn"],
  ["P", "Projects", "#projects"],
  ["C", "Circles", "#people"],
  ["N", "People", "#people"],
  ["S", "Skills", "#skills"],
];

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
        take: 3,
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
      _count: { select: { enrollments: true, createdCourses: true } },
    },
  });

  if (!user) redirect("/sign-in");

  const peers = await db.user.findMany({
    where: {
      id: { not: user.id },
      onboardingCompleted: true,
      ...(user.profile?.programId
        ? { profile: { is: { programId: user.profile.programId } } }
        : {}),
    },
    take: 3,
    include: {
      profile: { include: { program: true, institution: true } },
      skills: { include: { skill: true }, take: 3 },
    },
  });

  const initials = (user.name ?? user.username ?? "T")
    .split(" ")
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const firstName = user.name?.split(" ")[0] ?? user.username ?? "Builder";
  const role = user.roles[0]?.role.toLowerCase() ?? "learner";

  const profileChecks = [
    user.name,
    user.username,
    user.profile?.institutionId,
    user.profile?.programId,
    user.profile?.goal,
    user.skills.length > 0,
    user.interests.length > 0,
  ];
  const profileCompleteness = Math.round((profileChecks.filter(Boolean).length / profileChecks.length) * 100);

  return (
    <main className="tekoraDashboard">
      <aside className="dashboardSidebar">
        <Link href="/" className="dashboardBrand">
          <span className="dashboardBrandMark">T</span>
          <span>Tekora</span>
        </Link>

        <nav className="dashboardNav" aria-label="Dashboard navigation">
          {navItems.map(([icon, label, href], index) => (
            <Link className={index === 0 ? "active" : ""} href={href} key={label}>
              <span className="dashboardNavIcon">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="dashboardSidebarBottom">
          <div className="dashboardProfileMini">
            <span className="dashboardAvatar">{initials}</span>
            <div>
              <strong>{user.name ?? user.username}</strong>
              <span>{role}</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="dashboardMainShell">
        <header className="dashboardTopbarPremium">
          <div className="dashboardTopbarLeft">
            <Link href="/" className="dashboardMobileBrand"><span>T</span><span>Tekora</span></Link>
            <label className="dashboardSearch">
              <span>⌕</span>
              <input aria-label="Search Tekora" placeholder="Search courses, skills, people..." />
            </label>
          </div>
          <div className="dashboardTopbarActions">
            <button className="dashboardIconButton" type="button" aria-label="Notifications">○</button>
            <span className="dashboardTopbarAvatar">{initials}</span>
          </div>
        </header>

        <div className="dashboardContent">
          <section className="dashboardWelcome">
            <div>
              <span className="dashboardCardLabel">YOUR TEKORA</span>
              <h1>Welcome back, {firstName}.</h1>
              <p>Keep learning, building and turning your progress into real capability.</p>
            </div>
            <Link href="/learn" className="dashboardWelcomeAction">Explore learning →</Link>
          </section>

          <section className="dashboardSummaryGrid">
            <article className="dashboardGoalCard">
              <span className="dashboardCardLabel">YOUR CURRENT DIRECTION</span>
              <h2>{user.profile?.goal ?? "Tell Tekora what you want to achieve next."}</h2>
              <div className="dashboardGoalMeta">
                <span>{user.profile?.program?.name ?? "Choose a field"}</span>
                <span>{user.profile?.level ?? "Set your level"}</span>
                <span>{user.profile?.institution?.name ?? "Independent learner"}</span>
              </div>
            </article>
            <article className="dashboardMetricCard"><span>Enrolled courses</span><strong>{user._count.enrollments}</strong><small>Across your learning path</small></article>
            <article className="dashboardMetricCard"><span>Tracked skills</span><strong>{user.skills.length}</strong><small>Growing with your evidence</small></article>
            <article className="dashboardMetricCard"><span>Profile strength</span><strong>{profileCompleteness}%</strong><small>Complete identities match better</small></article>
          </section>

          <section className="dashboardSectionPremium">
            <div className="dashboardSectionHeader">
              <div><span className="dashboardCardLabel">CONTINUE LEARNING</span><h2>Your courses</h2><p>Pick up from where you left off.</p></div>
              <Link href="/learn">Browse courses →</Link>
            </div>

            <div className="dashboardCourseGrid">
              {user.enrollments.length === 0 ? (
                <div className="dashboardEmptyCourse">
                  <div><h3>Your learning shelf is empty.</h3><p>Enroll in a practical course and it will appear here with your progress.</p></div>
                  <Link href="/learn" className="dashboardWelcomeAction">Find a course →</Link>
                </div>
              ) : (
                user.enrollments.map((enrollment) => {
                  const totalLessons = enrollment.course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
                  const completedLessons = enrollment.progress.filter((item) => item.completed).length;
                  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                  return (
                    <article className="dashboardCourseCard" key={enrollment.id}>
                      <div className="dashboardCourseTop">
                        <span className="dashboardCourseBadge">{enrollment.course.category?.name?.slice(0, 2).toUpperCase() ?? "TK"}</span>
                        <span className="dashboardCourseStatus">{completedLessons}/{totalLessons} lessons</span>
                      </div>
                      <div><h3>{enrollment.course.title}</h3><p>{enrollment.course.category?.name ?? "Tekora course"}</p></div>
                      <div className="dashboardProgressTrack"><span style={{ width: `${progress}%` }} /></div>
                      <div className="dashboardProgressMeta"><span>{progress}% complete</span><span>{totalLessons - completedLessons} left</span></div>
                      <Link href={`/learn/course/${enrollment.courseId}`} className="dashboardCourseLink">Continue course →</Link>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="dashboardTwoColumn" id="skills">
            <article className="dashboardPanel">
              <div className="dashboardPanelHeader"><h3>Your skills</h3><Link href="/sign-up">Grow your identity →</Link></div>
              <div className="dashboardSkillList">
                {user.skills.length > 0
                  ? user.skills.map(({ id, level, verified, skill }) => <span className="dashboardSkillPill" key={id}>{skill.name}<strong>{verified ? "✓" : `L${level}`}</strong></span>)
                  : <span className="dashboardSkillPill">Add your first skill</span>}
              </div>
            </article>

            <article className="dashboardPanel">
              <div className="dashboardPanelHeader"><h3>What you want to learn</h3><Link href="/learn">Explore →</Link></div>
              <div className="dashboardInterestList">
                {user.interests.length > 0
                  ? user.interests.map(({ id, interest }) => <div className="dashboardInterestRow" key={id}><span>{interest.name}</span><small>Learning interest</small></div>)
                  : <div className="dashboardInterestRow"><span>Tell Tekora what interests you</span><small>Personalize recommendations</small></div>}
              </div>
            </article>
          </section>

          <section className="dashboardSectionPremium" id="people">
            <div className="dashboardSectionHeader">
              <div><span className="dashboardCardLabel">PEOPLE ON YOUR PATH</span><h2>Learn around people, not alone.</h2><p>People in a similar field can become study partners, teammates or collaborators.</p></div>
              <Link href="#people">Explore people →</Link>
            </div>
            <div className="dashboardPeopleGrid">
              {peers.length > 0 ? peers.map((peer) => {
                const peerName = peer.name ?? peer.username ?? "Tekora learner";
                const peerInitials = peerName.split(" ").map(v => v[0]).join("").slice(0, 2).toUpperCase();
                return <article className="dashboardPersonCard" key={peer.id}><div className="dashboardPersonTop"><span className="dashboardPersonAvatar">{peerInitials}</span><div><strong>{peerName}</strong><small>{peer.profile?.program?.name ?? "Tekora learner"}</small></div></div><p>{peer.skills.map(item => item.skill.name).join(" · ") || "Building their skill identity"}</p><span>Similar learning path</span></article>;
              }) : ["Ama K.", "Kojo M.", "Esi N."].map((name, index) => <article className="dashboardPersonCard" key={name}><div className="dashboardPersonTop"><span className="dashboardPersonAvatar">{name.slice(0,1)}{index + 1}</span><div><strong>{name}</strong><small>Tekora community</small></div></div><p>People matching your path will appear here as the community grows.</p><span>Community preview</span></article>)}
            </div>
          </section>

          <section className="dashboardTwoColumn" id="projects">
            <article className="dashboardPanel">
              <div className="dashboardPanelHeader"><h3>Opportunities for you</h3><Link href="#">See all →</Link></div>
              <div className="dashboardOpportunityList">
                <div className="dashboardOpportunity"><span>WORKSHOP</span><h4>Practical learning, in person.</h4><p>Nearby creator workshops and bootcamps will appear here.</p></div>
                <div className="dashboardOpportunity"><span>INTERNSHIP</span><h4>Get matched by capability.</h4><p>Internships will connect to the evidence on your Tekora profile.</p></div>
              </div>
            </article>
            <article className="dashboardPanel">
              <div className="dashboardPanelHeader"><h3>Build something</h3><Link href="#">Projects →</Link></div>
              <div className="dashboardOpportunityList">
                <div className="dashboardOpportunity"><span>PROJECTS</span><h4>Turn learning into proof.</h4><p>Create or join a practical project and make your contribution part of your skill identity.</p></div>
                <div className="dashboardOpportunity"><span>TEAM</span><h4>Find people to build with.</h4><p>Tekora teams will connect learners across engineering, software, design and business.</p></div>
              </div>
            </article>
          </section>

          <section className="dashboardBottomCta">
            <div><span className="dashboardCardLabel">NEXT STEP</span><h3>Your skills should lead somewhere.</h3><p>Keep building your Tekora identity so future creators, mentors and companies can understand what you can actually do.</p></div>
            <Link href="/learn">Keep learning →</Link>
          </section>
        </div>
      </section>
    </main>
  );
}
