import { db } from "@/lib/db";

export async function publicCourse(slug:string){
  return db.course.findFirst({
    where:{slug,status:"PUBLISHED"},
    include:{
      category:true,
      creator:{select:{id:true,name:true,username:true,headline:true}},
      modules:{orderBy:{position:"asc"},include:{lessons:{orderBy:{position:"asc"},include:{blocks:{orderBy:{position:"asc"}}}}}},
      _count:{select:{enrollments:true}}
    }
  });
}

export async function enrollInCourse(userId:string,courseId:string){
  const course=await db.course.findFirst({where:{id:courseId,status:"PUBLISHED"},select:{id:true,access:true}});
  if(!course) return {error:"NOT_FOUND"} as const;
  if(course.access==="PAID") return {error:"PAYMENT_REQUIRED"} as const;
  return db.enrollment.upsert({where:{userId_courseId:{userId,courseId}},update:{},create:{userId,courseId}});
}

export async function courseForLearner(userId:string,courseId:string){
  return db.enrollment.findUnique({
    where:{userId_courseId:{userId,courseId}},
    include:{progress:true,course:{include:{creator:{select:{name:true,username:true}},modules:{orderBy:{position:"asc"},include:{lessons:{orderBy:{position:"asc"},include:{blocks:{orderBy:{position:"asc"}}}}}}}}
  });
}

export async function completeLesson(userId:string,lessonId:string){
  const enrollment=await db.enrollment.findFirst({where:{userId,course:{modules:{some:{lessons:{some:{id:lessonId}}}}}},select:{id:true}});
  if(!enrollment) return null;
  return db.lessonProgress.upsert({
    where:{enrollmentId_lessonId:{enrollmentId:enrollment.id,lessonId}},
    update:{completed:true,completedAt:new Date()},
    create:{enrollmentId:enrollment.id,lessonId,completed:true,completedAt:new Date()}
  });
}
