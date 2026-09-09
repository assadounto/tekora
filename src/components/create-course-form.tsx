"use client";
import { FormEvent,useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCourseForm(){
 const router=useRouter();const[error,setError]=useState("");const[loading,setLoading]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");const f=new FormData(e.currentTarget);const access=String(f.get("access"));
 const payload={title:String(f.get("title")),description:String(f.get("description")),category:String(f.get("category")),level:String(f.get("level"))||undefined,access,price:access==="PAID"?Math.round(Number(f.get("price"))*100):undefined,currency:"GHS"};
 const r=await fetch("/api/v1/courses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok){setError(j.error==="CREATOR_ACCESS_REQUIRED"?"Your account needs a creator or professional role before publishing.":"Could not create course.");setLoading(false);return;}router.push("/creator/courses");router.refresh();}
 return <form className="authForm" onSubmit={submit}><label>Course title<input name="title" required placeholder="Practical Solar PV Installation"/></label><label>Category<input name="category" required placeholder="Renewable Energy"/></label><label>Level<input name="level" placeholder="Beginner"/></label><label>Access<select name="access" defaultValue="FREE"><option value="FREE">Free</option><option value="PAID">Paid</option></select></label><label>Price (GHS)<input name="price" type="number" min="0" step=".01" placeholder="150"/></label><label>Description<textarea name="description" required rows={7} placeholder="What will learners be able to build or do after this course?"/></label>{error?<p className="formError">{error}</p>:null}<button className="primaryButton" disabled={loading}>{loading?"Creating...":"Create course draft"}</button></form>
}
