import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const stats = [
  ["10K+", "Learners"],
  ["500+", "Courses"],
  ["100+", "Creators"],
  ["50+", "Countries"],
];

const features = [
  ["01", "Practical learning", "Hands-on projects, labs, challenges and evidence you can show."],
  ["02", "Expert creators", "Learn from engineers, developers, lecturers and skilled professionals."],
  ["03", "Flexible paths", "Learn at your own pace and build a path around your goals."],
  ["04", "Global community", "Meet learners, form teams and create something bigger together."],
];

const sampleCourses = [
  ["Bestseller", "Full-Stack Web Development with Next.js", "Build modern web products from idea to deployment.", "Daniel Okafor", "4.9"],
  ["Popular", "Introduction to AI for Engineers", "Understand modern AI systems through practical engineering use cases.", "Sarah Musa", "4.8"],
  ["Cloud", "Cloud Engineering with AWS", "Deploy, scale and manage production-ready applications.", "James Adeyemi", "4.7"],
  ["Mobile", "Mobile App Development with React Native", "Build polished cross-platform apps with real product workflows.", "Fatima Bello", "4.8"],
];

export default function HomePage() {
  return (
    <main className="premiumHome">
      <SiteHeader />

      <section className="premiumHeroLight">
        <div className="premiumHeroInner">
          <div className="premiumHeroCopy">
            <span className="premiumKicker">SKILLS FOR A BRIGHTER TOMORROW</span>
            <h1>
              Learn. Build. Create.
              <span>A brighter you.</span>
            </h1>
            <p>
              Tekora is an all-in-one learning and professional platform for engineers, creators and problem-solvers. Learn in-demand skills, build real projects and share your knowledge with the world.
            </p>

            <div className="premiumHeroActions">
              <Link href="/onboarding" className="premiumPrimaryCta">Start learning free <span>→</span></Link>
              <Link href="/creator/courses/new" className="premiumSecondaryCta">Become a creator</Link>
            </div>

            <div className="premiumStats">
              {stats.map(([value,label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premiumHeroVisual" aria-label="Tekora learning experience preview">
            <div className="visualOrb visualOrbOne" />
            <div className="visualOrb visualOrbTwo" />

            <div className="visualMainCard">
              <div className="visualMainTopbar">
                <span className="visualDot" />
                <span>Learning workspace</span>
                <span>•••</span>
              </div>
              <div className="visualMainBody">
                <div className="visualAvatar">T</div>
                <p className="visualLabel">CURRENT PATH</p>
                <h3>Embedded Systems & IoT</h3>
                <div className="visualProgress"><span /></div>
                <div className="visualMetrics">
                  <div><strong>68%</strong><span>Progress</span></div>
                  <div><strong>12</strong><span>Labs</span></div>
                  <div><strong>4</strong><span>Projects</span></div>
                </div>
                <div className="visualLessonCard">
                  <span>Next practical</span>
                  <strong>ESP32 Sensor Dashboard</strong>
                  <small>Build · Test · Submit evidence</small>
                </div>
              </div>
            </div>

            <div className="floatingCard floatingBuild">
              <span className="floatingIcon">⌘</span>
              <div><strong>Build real projects</strong><small>Turn knowledge into real-world skills.</small></div>
            </div>
            <div className="floatingCard floatingExperts">
              <span className="floatingIcon">◎</span>
              <div><strong>Learn from experts</strong><small>Industry creators. Practical lessons.</small></div>
            </div>
            <div className="floatingCard floatingProgress">
              <span className="floatingIcon">↗</span>
              <div><strong>Your progress</strong><small>Keep going — 78% complete.</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="premiumTrust" aria-label="Platform capabilities">
        <p>BUILT FOR MODERN LEARNING, CREATION AND CAREERS</p>
        <div>
          {["AI-ready", "API-first", "Project-based", "Creator-led", "Career-connected", "Community-powered"].map(item => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section id="platform" className="premiumFeatureStrip">
        {features.map(([number,title,copy]) => (
          <article key={title}>
            <span>{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="premiumCoursesSection">
        <div className="premiumSectionHeading">
          <div>
            <span className="premiumKicker">LEARN FROM PEOPLE WHO BUILD</span>
            <h2>Featured courses</h2>
            <p>Start with practical courses from top creators and working professionals.</p>
          </div>
          <Link href="/learn">Browse all courses →</Link>
        </div>

        <div className="premiumCourseGrid">
          {sampleCourses.map(([badge,title,copy,creator,rating],index) => (
            <article className="premiumCourseCard" key={title}>
              <div className={`premiumCourseThumb thumb${index + 1}`}>
                <span>{badge}</span>
                <strong>{index === 0 ? "</>" : index === 1 ? "AI" : index === 2 ? "☁" : "▣"}</strong>
              </div>
              <div className="premiumCourseBody">
                <h3>{title}</h3>
                <p>{copy}</p>
                <div className="premiumCourseMeta">
                  <span>{creator}</span>
                  <strong>★ {rating}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="community" className="premiumCommunitySection">
        <div>
          <span className="premiumKicker">LEARN WITH PEOPLE ON YOUR PATH</span>
          <h2>Find your people. Build your circle.</h2>
          <p>
            Discover learners with similar goals, join study circles, form project teams and grow those teams into real products, ventures and companies.
          </p>
          <Link href="/onboarding" className="premiumPrimaryCta">Join the community →</Link>
        </div>
        <div className="premiumCommunityBoard">
          <div className="communityPerson"><span>AK</span><div><strong>Ama K.</strong><small>Computer Engineering · IoT</small></div><em>82% match</em></div>
          <div className="communityPerson"><span>KM</span><div><strong>Kojo M.</strong><small>Electrical Engineering · Solar</small></div><em>78% match</em></div>
          <div className="communityPerson"><span>EN</span><div><strong>Esi N.</strong><small>Software Engineering · React</small></div><em>74% match</em></div>
          <div className="communityTeamCard"><span>PROJECT TEAM</span><strong>Smart Energy Monitor</strong><small>3 builders · Looking for a mobile developer</small></div>
        </div>
      </section>

      <section id="industry" className="premiumIndustrySection">
        <div>
          <span className="premiumKicker">FROM LEARNING TO OPPORTUNITY</span>
          <h2>Skills should lead somewhere.</h2>
        </div>
        <p>
          Tekora connects portfolios, verified practical evidence, creators, internships, workshops and industry challenges so learners can turn capability into opportunity.
        </p>
      </section>
    </main>
  );
}
