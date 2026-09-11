import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { publishCourse } from "@/modules/learning/creator-service";

export async function POST(_:Request,{params}:{params:Promise<{courseId:string}>}){
  const session=await auth();
  if(!session?.user?.id) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
  if(!(await isAdminUser(session.user.id))) return NextResponse.json({error:"ADMIN_REQUIRED"},{status:403});
  const{courseId}=await params;
  const result=await publishCourse(courseId,session.user.id);
  if("error" in result) return NextResponse.json(result,{status:result.error==="NOT_FOUND"?404:422});
  return NextResponse.json({data:result});
}
