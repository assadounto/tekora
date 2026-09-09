import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {enrollInCourse} from "@/modules/learning/learner-service";

export async function POST(_:Request,{params}:{params:Promise<{courseId:string}>}){
  const s=await auth();
  if(!s?.user?.id)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
  const{courseId}=await params;
  const r=await enrollInCourse(s.user.id,courseId);
  if("error" in r)return NextResponse.json(r,{status:r.error==="PAYMENT_REQUIRED"?402:404});
  return NextResponse.json({data:r},{status:201});
}
