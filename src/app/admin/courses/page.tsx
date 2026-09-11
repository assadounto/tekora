import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function pretty(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      _count: { select: { modules: true, enrollments: true } },
    },
  });

  const purchases = courses.length
    ? await db.purchase.findMany({
        where: { targetType: "COURSE", targetId: { in: courses.map(course => course.id) } },
        select: { targetId: true },
      })
    : [];

  const salesByCourse = purchases.reduce<Record<string, number>>((acc, purchase) => {
    acc[purchase.targetId] = (acc[purchase.targetId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="adminPage">
      <header className="adminPageHead">
        <div><span className="adminEyebrow">CONTENT · COURSES</span><h1>Courses</h1><p>Build and manage the structured learning catalog. Only admin-created courses can be published on Tekora.</p></div>
        <div className="adminHeadActions"><Link className="adminPrimary" href="/creator/courses/new">+ Create course</Link><Link className="adminSecondary" href="/learn">Public catalog</Link></div>
      </header>

      {courses.length === 0 ? <div className="adminEmpty"><h2>No courses yet.</h2><p>Create your first course and build its modules before publishing.</p><Link className="adminPrimary" href="/creator/courses/new">Create course →</Link></div> : (
        <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Course</th><th>Status</th><th>Access</th><th>Modules</th><th>Learners</th><th>Sales</th><th>Action</th></tr></thead><tbody>{courses.map(course => <tr key={course.id}><td><strong>{course.title}</strong><small>{course.category?.name ?? "Uncategorized"} · {course.level ?? "All levels"}</small></td><td><span className={`adminStatus ${course.status.toLowerCase()}`}>{pretty(course.status)}</span></td><td>{course.access === "FREE" ? "Free" : `${course.currency} ${((course.price ?? 0) / 100).toFixed(2)}`}</td><td>{course._count.modules}</td><td>{course._count.enrollments}</td><td>{salesByCourse[course.id] ?? 0}</td><td><Link href={`/creator/courses/${course.id}`}>Manage →</Link>{course.status === "PUBLISHED" ? <small><Link href={`/learn/${course.slug}`}>Public view</Link></small> : null}</td></tr>)}</tbody></table></div>
      )}
    </div>
  );
}
