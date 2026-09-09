import { db } from "@/lib/db";
import type { z } from "zod";
import type { createCourseSchema } from "./schemas";

type CreateCourseInput = z.infer<typeof createCourseSchema>;
const slugify=(v:string)=>v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export async function createCourse(creatorId:string,input:CreateCourseInput){
  const base=slugify(input.title);
  const slug=base+"-"+Math.random().toString(36).slice(2,7);
  const category=await db.courseCategory.upsert({
    where:{slug:slugify(input.category)},
    update:{},
    create:{name:input.category,slug:slugify(input.category)}
  });
  return db.course.create({
    data:{
      title:input.title,slug,description:input.description,level:input.level,
      access:input.access,price:input.access==="PAID"?input.price:null,currency:input.currency,
      creatorId,categoryId:category.id
    },
    include:{category:true,creator:{select:{id:true,name:true,username:true}}}
  });
}

export async function listPublishedCourses(){
  return db.course.findMany({
    where:{status:"PUBLISHED"},
    orderBy:{publishedAt:"desc"},
    include:{
      category:true,
      creator:{select:{name:true,username:true,headline:true}},
      _count:{select:{enrollments:true,modules:true}}
    }
  });
}
