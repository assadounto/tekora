import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { EnrollButton } from "@/components/enroll-button";
import { publicCourse } from "@/modules/learning/learner-service";
import "../../premium-home.css";
import "../../premium-accessibility.css";
import "./course-detail.css";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await publicCourse(slug);
  if (!course) notFound();

  const lessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const blocks = course.modules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.blocks));
  const practicalBlocks = blocks.filter((block) =>
    ["TASK", "CHECKPOINT", "CIRCUIT", "SIMULATION", "UPLOAD"].includes(block.type)
  ).length;
  const creatorName = "Tekora";
  const creatorInitial = "T";

  return (
    <main className="courseDetailPage">
      <SiteHeader />

      <section className="courseDetailHero">
        <div className="courseDetailHeroInner">
          <div className="courseDetailCopy">
            <Link href="/learn" className="courseBackLink">← Back to courses</Link>
            <span className="premiumKicker">{course.category?.name ?? "TEKORA COURSE"}</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>

            <div className="courseDetailMeta">
              <span>{course.level ?? "All levels"}</span>
              <span>{course.modules.length} modules</span>
              <span>{lessons} lessons</span>
              <span>{practicalBlocks} practical activities</span>
              <span>{course._count.enrollments} learners</span>
            </div>

            <div className="courseCreatorInline">
              <span className="courseCreatorAvatar">{creatorInitial}</span>
              <div><small>Published by</small><strong>{creatorName}</strong><span>Official Tekora course</span></div>
            </div>
          </div>

          <aside className="courseEnrollCard">
            <div className="courseCoverPreview"><span>{course.category?.name ?? "Course"}</span><strong>{course.category?.name?.slice(0, 2).toUpperCase() ?? "TK"}</strong><small>Practical learning on Tekora</small></div>
            <div className="courseEnrollBody">
              <span className="coursePriceLabel">Course access</span>
              <strong className="coursePrice">{course.access === "FREE" ? "Free" : `${course.currency} ${((course.price ?? 0) / 100).toFixed(2)}`}</strong>
              <p>Free courses can be added immediately. Paid courses are unlocked after verified payment and stay in your dashboard.</p>
              <EnrollButton courseId={course.id} access={course.access} price={course.price} currency={course.currency} />
              <ul><li><span>✓</span> Full course curriculum</li><li><span>✓</span> Practical tasks and checkpoints</li><li><span>✓</span> Progress tracking</li><li><span>✓</span> Account-based access</li></ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="courseDetailMain">
        <div className="courseDetailContent">
          <section className="courseOutcomeCard">
            <span className="premiumKicker">WHAT YOU'LL GET FROM THIS COURSE</span><h2>Learn it. Build it. Prove it.</h2>
            <div className="courseOutcomeGrid"><article><span>01</span><strong>Understand</strong><p>Follow a structured path from the core ideas to practical application.</p></article><article><span>02</span><strong>Practice</strong><p>Work through tasks, checkpoints and hands-on learning activities.</p></article><article><span>03</span><strong>Build</strong><p>Turn course knowledge into work you can demonstrate beyond the classroom.</p></article><article><span>04</span><strong>Prove</strong><p>Track completion and build evidence around the skills you develop.</p></article></div>
          </section>

          <section className="courseCurriculumSection">
            <div className="courseSectionHeading"><div><span className="premiumKicker">COURSE CURRICULUM</span><h2>Everything you’ll work through.</h2></div><span>{course.modules.length} modules · {lessons} lessons</span></div>
            <div className="courseModuleList">{course.modules.map((module, moduleIndex) => <article className="courseModuleCard" key={module.id}><div className="courseModuleHeading"><span>{String(moduleIndex + 1).padStart(2, "0")}</span><div><small>Module {moduleIndex + 1}</small><h3>{module.title}</h3></div><em>{module.lessons.length} lessons</em></div><div className="courseLessonList">{module.lessons.map((lesson, lessonIndex) => <div className="courseLessonRow" key={lesson.id}><span className="lessonNumber">{lessonIndex + 1}</span><div><strong>{lesson.title}</strong><small>{lesson.blocks.length} learning blocks{lesson.isPreview ? " · Preview" : ""}</small></div><span className="lessonTypeMark">{lesson.isPreview ? "Preview" : "Lesson"}</span></div>)}</div></article>)}</div>
          </section>

          <section className="courseCreatorSection"><span className="premiumKicker">OFFICIAL TEKORA COURSE</span><div className="courseCreatorProfile"><span className="courseCreatorLargeAvatar">T</span><div><h2>Tekora</h2><p>Courses are created and published by the Tekora admin, then offered free or paid to learners.</p><div className="courseCreatorBadges"><span>Official</span><span>Practical learning</span><span>Project-connected</span></div></div></div></section>
        </div>

        <aside className="courseDetailRail"><div className="courseRailCard"><span className="premiumKicker">COURSE SNAPSHOT</span><div><small>Level</small><strong>{course.level ?? "All levels"}</strong></div><div><small>Modules</small><strong>{course.modules.length}</strong></div><div><small>Lessons</small><strong>{lessons}</strong></div><div><small>Practical activities</small><strong>{practicalBlocks}</strong></div><div><small>Learners</small><strong>{course._count.enrollments}</strong></div></div><div className="courseRailNote"><strong>Built for practical learning</strong><p>Tekora courses support the projects and skills students want to build.</p></div></aside>
      </section>

      <section className="courseDetailFinalCta"><div><span className="premiumKicker">READY TO START?</span><h2>Add this course to your Tekora library.</h2><p>Free courses unlock immediately; paid courses unlock after verified checkout.</p></div><EnrollButton courseId={course.id} access={course.access} price={course.price} currency={course.currency} /></section>
    </main>
  );
}
