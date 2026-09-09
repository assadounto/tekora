import { db } from "@/lib/db";

const slugify=(v:string)=>v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export async function creatorCourse(courseId:string,creatorId:string){
 return db.course.findFirst({
  where:{id:courseId,creatorId},
  include:{category:true,modules:{orderBy:{position:"asc"},include:{lessons:{orderBy:{position:"asc"},include:{blocks:{orderBy:{position:"asc"}}}}}}}
 });
}

export async function addModule(courseId:string,creatorId:string,title:string){
 const course=await db.course.findFirst({where:{id:courseId,creatorId},select:{id:true}});
 if(!course) return null;
 const last=await db.courseModule.aggregate({where:{courseId},_max:{position:true}});
 return db.courseModule.create({data:{courseId,title,position:(last._max.position??0)+1}});
}

export async function addLesson(moduleId:string,creatorId:string,title:string){
 const module=await db.courseModule.findFirst({where:{id:moduleId,course:{creatorId}},select:{id:true}});
 if(!module) return null;
 const last=await db.lesson.aggregate({where:{moduleId},_max:{position:true}});
 const base=slugify(title)||"lesson";
 return db.lesson.create({data:{moduleId,title,slug:base+"-"+Math.random().toString(36).slice(2,6),position:(last._max.position??0)+1}});
}

export async function addBlock(lessonId:string,creatorId:string,type:any,data:unknown){
 const lesson=await db.lesson.findFirst({where:{id:lessonId,module:{course:{creatorId}}},select:{id:true}});
 if(!lesson) return null;
 const last=await db.lessonBlock.aggregate({where:{lessonId},_max:{position:true}});
 return db.lessonBlock.create({data:{lessonId,type,position:(last._max.position??0)+1,data:data as any}});
}

export async function publishCourse(courseId:string,creatorId:string){
 const course=await creatorCourse(courseId,creatorId);
 if(!course) return {error:"NOT_FOUND"} as const;
 if(!course.description||course.modules.length===0||course.modules.some(m=>m.lessons.length===0))
  return {error:"COURSE_INCOMPLETE"} as const;
 return db.course.update({where:{id:courseId},data:{status:"PUBLISHED",publishedAt:new Date()}});
}
