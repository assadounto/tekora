import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCourseSchema } from "@/modules/learning/schemas";
import { createCourse, listPublishedCourses } from "@/modules/learning/service";
import { isAdminUser } from "@/lib/admin";

export async function GET(){
  return NextResponse.json({data:await listPublishedCourses()});
}

export async function POST(request:Request){
  const session=await auth();
  if(!session?.user?.id) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
  if(!(await isAdminUser(session.user.id))) return NextResponse.json({error:"ADMIN_REQUIRED"},{status:403});

  const parsed=createCourseSchema.safeParse(await request.json());
  if(!parsed.success) return NextResponse.json({error:"VALIDATION_ERROR",details:parsed.error.flatten()},{status:422});

  const course=await createCourse(session.user.id,parsed.data);
  return NextResponse.json({data:course},{status:201});
}
