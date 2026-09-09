import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCourseSchema } from "@/modules/learning/schemas";
import { createCourse, listPublishedCourses } from "@/modules/learning/service";
import { db } from "@/lib/db";

export async function GET(){
  return NextResponse.json({data:await listPublishedCourses()});
}

export async function POST(request:Request){
  const session=await auth();
  if(!session?.user?.id) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});

  const allowed=await db.userRoleLink.findFirst({
    where:{userId:session.user.id,role:{in:["CREATOR","PROFESSIONAL","MENTOR","ADMIN"]}}
  });
  if(!allowed) return NextResponse.json({error:"CREATOR_ACCESS_REQUIRED"},{status:403});

  const parsed=createCourseSchema.safeParse(await request.json());
  if(!parsed.success) return NextResponse.json({error:"VALIDATION_ERROR",details:parsed.error.flatten()},{status:422});

  const course=await createCourse(session.user.id,parsed.data);
  return NextResponse.json({data:course},{status:201});
}
