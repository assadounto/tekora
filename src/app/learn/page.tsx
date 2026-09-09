import Link from "next/link";
import { listPublishedCourses } from "@/modules/learning/service";

export default async function LearnPage(){
  const courses=await listPublishedCourses();
  return <main className="dashboardMain">
    <header className="dashboardTopbar"><div><p className="eyebrow">TEKORA LEARN</p><h1>Learn skills you can prove.</h1><p className="muted">Courses from practitioners, engineers, developers and skilled creators.</p></div><Link className="headerCta" href="/creator/courses/new">Teach on Tekora</Link></header>
    <section className="courseGrid">
      {courses.length===0?<div className="emptyState"><h2>The first Tekora courses are being built.</h2><p>Creators can start publishing practical learning experiences now.</p></div>:courses.map(c=><Link href={"/learn/"+c.slug} className="courseCard" key={c.id}><span className="courseBadge">{c.category?.name??"Course"}</span><h2>{c.title}</h2><p>{c.description}</p><div className="courseMeta"><span>{c.creator.name??c.creator.username}</span><strong>{c.access==="FREE"?"Free":c.currency+" "+((c.price??0)/100).toFixed(2)}</strong></div></article>)}
    </section>
  </main>
}
