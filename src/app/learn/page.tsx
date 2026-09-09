import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { listPublishedCourses } from "@/modules/learning/service";
import "../premium-home.css";
import "../premium-accessibility.css";
import "./learn.css";

const categories = [
  "All courses",
  "Software Engineering",
  "Electrical Engineering",
  "Embedded Systems",
  "Renewable Energy",
  "AI & Data",
];

export default async function LearnPage() {
  const courses = await listPublishedCourses();

  return (
    <main className="learnPage">
      <SiteHeader />

      <section className="learnHero">
        <div className="learnHeroInner">
          <div className="learnHeroCopy">
            <span className="premiumKicker">TEKORA LEARN</span>
            <h1>Learn skills you can actually use.</h1>
            <p>
              Practical courses from engineers, developers, lecturers and skilled professionals—built around doing, not just watching.
            </p>

            <div className="learnSearch" role="search">
              <span aria-hidden="true">⌕</span>
              <input aria-label="Search Tekora courses" placeholder="Search courses, skills or creators" />
              <button type="button">Search</button>
            </div>

            <div className="learnQuickStats">
              <div><strong>{courses.length}</strong><span>Published courses</span></div>
              <div><strong>Project-first</strong><span>Learning approach</span></div>
              <div><strong>Creator-led</strong><span>Industry knowledge</span></div>
            </div>
          </div>

          <aside className="learnHeroPanel">
            <span className="learnPanelLabel">WHY TEKORA</span>
            <h2>Learn. Build. Prove.</h2>
            <ul>
              <li><span>01</span> Structured practical lessons</li>
              <li><span>02</span> Real projects and checkpoints</li>
              <li><span>03</span> Progress you can turn into evidence</li>
            </ul>
            <Link href="/creator/courses/new" className="premiumPrimaryCta">Teach on Tekora →</Link>
          </aside>
        </div>
      </section>

      <section className="learnCatalog">
        <div className="learnCatalogTop">
          <div>
            <span className="premiumKicker">EXPLORE LEARNING</span>
            <h2>Find your next skill.</h2>
            <p>Start small, go deep, and build something real along the way.</p>
          </div>
          <Link href="/onboarding" className="learnProfileLink">Personalize my learning →</Link>
        </div>

        <div className="learnCategoryRow" aria-label="Course categories">
          {categories.map((category, index) => (
            <button className={index === 0 ? "active" : ""} type="button" key={category}>
              {category}
            </button>
          ))}
        </div>

        {courses.length === 0 ? (
          <section className="learnEmptyState">
            <span className="learnEmptyIcon">T</span>
            <div>
              <h3>The first Tekora courses are being built.</h3>
              <p>Creators can already start building practical learning experiences and publish when they are ready.</p>
            </div>
            <Link href="/creator/courses/new" className="premiumPrimaryCta">Create the first course →</Link>
          </section>
        ) : (
          <div className="learnCourseGrid">
            {courses.map((course, index) => (
              <Link href={`/learn/${course.slug}`} className="learnCourseCard" key={course.id}>
                <div className={`learnCourseCover cover${(index % 4) + 1}`}>
                  <span>{course.category?.name ?? "Course"}</span>
                  <strong>{course.category?.name?.slice(0, 2).toUpperCase() ?? "TK"}</strong>
                </div>

                <div className="learnCourseContent">
                  <div className="learnCourseTopline">
                    <span>{course.level ?? "All levels"}</span>
                    <span>{course._count.modules} modules</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="learnCourseFooter">
                    <div>
                      <span className="learnCreatorAvatar">
                        {(course.creator.name ?? course.creator.username ?? "T").slice(0, 1).toUpperCase()}
                      </span>
                      <span>{course.creator.name ?? course.creator.username}</span>
                    </div>
                    <strong>
                      {course.access === "FREE"
                        ? "Free"
                        : `${course.currency} ${((course.price ?? 0) / 100).toFixed(2)}`}
                    </strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="learnBottomCta">
        <div>
          <span className="premiumKicker">CAN'T FIND WHAT YOU NEED?</span>
          <h2>Tell Tekora where you want to go.</h2>
          <p>Your goals, interests and current skills will eventually power personalized course, project and people recommendations.</p>
        </div>
        <Link href="/onboarding" className="premiumPrimaryCta">Build my learning path →</Link>
      </section>
    </main>
  );
}
