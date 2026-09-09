import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(){
  const session=await auth();
  if(!session?.user?.id) return NextResponse.json({error:"UNAUTHORIZED"},{status:401});
  const courses=await db.course.findMany({
    where:{creatorId:session.user.id},
    orderBy:{updatedAt:"desc"},
    include:{category:true,_count:{select:{enrollments:true,modules:true}}}
  });
  return NextResponse.json({data:courses});
}
