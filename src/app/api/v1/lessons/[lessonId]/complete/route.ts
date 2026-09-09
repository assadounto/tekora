import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {completeLesson} from "@/modules/learning/learner-service";

export async function POST(_:Request,{params}:{params:Promise<{lessonId:string}>}){
  const s=await auth();
  if(!s?.user?.id)return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
  const{lessonId}=await params;
  const r=await completeLesson(s.user.id,lessonId);
  return r?NextResponse.json({data:r}):NextResponse.json({error:"NOT_ENROLLED"},{status:403});
}
