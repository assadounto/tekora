import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CreateCourseForm } from "@/components/create-course-form";

export default async function NewCoursePage(){
 const session=await auth();if(!session?.user?.id)redirect("/sign-in");
 return <main className="authShell"><section className="authCard wideCard"><div><Link href="/creator/courses" className="brandMark">TEKORA CREATOR</Link><p className="eyebrow">NEW COURSE</p><h1>Teach something worth building.</h1><p className="muted">Start with the outcome. We&apos;ll build modules, lessons, practical blocks and assessments next.</p></div><CreateCourseForm/></section></main>
}
