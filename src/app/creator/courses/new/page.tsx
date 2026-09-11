import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { CreateCourseForm } from "@/components/create-course-form";

export default async function NewCoursePage(){
 const session=await auth();
 if(!session?.user?.id) redirect("/sign-in");
 if(!(await isAdminUser(session.user.id))) redirect("/dashboard");
 return <main className="authShell"><section className="authCard wideCard"><div><Link href="/creator/courses" className="brandMark">TEKORA ADMIN</Link><p className="eyebrow">NEW COURSE</p><h1>Create a Tekora course.</h1><p className="muted">Only administrators can create and publish courses. Choose Free or Paid, then build the modules and lessons.</p></div><CreateCourseForm/></section></main>
}
