import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function CreatorCoursesPage(){
 const session=await auth();if(!session?.user?.id)redirect("/sign-in");
 const courses=await db.course.findMany({where:{creatorId:session.user.id},orderBy:{updatedAt:"desc"},include:{category:true,_count:{select:{modules:true,enrollments:true}}}});
 return <main className="dashboardMain"><header className="dashboardTopbar"><div><p className="eyebrow">CREATOR STUDIO</p><h1>Your knowledge can become someone&apos;s skill.</h1></div><Link className="headerCta" href="/creator/courses/new">Create course</Link></header><section className="courseGrid">{courses.length===0?<div className="emptyState"><h2>No courses yet.</h2><p>Create your first practical course and keep it as a draft until it is ready.</p></div>:courses.map(c=><article className="courseCard" key={c.id}><span className="courseBadge">{c.status}</span><h2>{c.title}</h2><p>{c.category?.name} · {c._count.modules} modules · {c._count.enrollments} learners</p><Link href={"/creator/courses/"+c.id}>Open course →</Link></article>)}</section></main>
}
