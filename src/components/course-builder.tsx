"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Block={id:string;type:string;data:any};
type Lesson={id:string;title:string;blocks:Block[]};
type Module={id:string;title:string;lessons:Lesson[]};

const blockTypes=[
  ["TEXT","Text"],
  ["VIDEO","Video"],
  ["CODE","Code"],
  ["QUIZ","Quiz"],
  ["TASK","Task"],
  ["CHECKPOINT","Checkpoint"],
  ["AI_INTERACTION","AI interaction"],
] as const;

export function CourseBuilder({courseId,modules,status}:{courseId:string;modules:Module[];status:string}){
  const router=useRouter();
  const[busy,setBusy]=useState(false);
  const[error,setError]=useState("");
  const[selected,setSelected]=useState<Record<string,string>>({});

  async function post(url:string,data?:unknown){
    setBusy(true);setError("");
    const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:data?JSON.stringify(data):undefined});
    const j=await r.json();setBusy(false);
    if(!r.ok){
      setError(j.error==="COURSE_INCOMPLETE"?"Add at least one lesson to every module before publishing.":j.error??"Something went wrong.");
      return false;
    }
    router.refresh();return true;
  }

  async function addModule(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);if(await post("/api/v1/creator/courses/"+courseId+"/modules",{title:f.get("title")}))e.currentTarget.reset()}
  async function addLesson(e:FormEvent<HTMLFormElement>,moduleId:string){e.preventDefault();const f=new FormData(e.currentTarget);if(await post("/api/v1/creator/modules/"+moduleId+"/lessons",{title:f.get("title")}))e.currentTarget.reset()}

  async function addBlock(e:FormEvent<HTMLFormElement>,lessonId:string){
    e.preventDefault();
    const f=new FormData(e.currentTarget);
    const type=selected[lessonId]??"TEXT";
    let data:any={};

    if(type==="TEXT") data={text:String(f.get("text")??"")};
    if(type==="VIDEO") data={url:String(f.get("url")??""),caption:String(f.get("caption")??"")};
    if(type==="CODE") data={language:String(f.get("language")??"text"),code:String(f.get("code")??"")};
    if(type==="QUIZ") data={question:String(f.get("question")??""),options:String(f.get("options")??"").split("\n").map(v=>v.trim()).filter(Boolean),answer:Number(f.get("answer")??0)};
    if(type==="TASK") data={title:String(f.get("taskTitle")??""),instructions:String(f.get("instructions")??"")};
    if(type==="CHECKPOINT") data={prompt:String(f.get("prompt")??"")};
    if(type==="AI_INTERACTION") data={instruction:String(f.get("instruction")??""),starter:String(f.get("starter")??"")};

    if(await post("/api/v1/creator/lessons/"+lessonId+"/blocks",{type,data})) e.currentTarget.reset();
  }

  function blockForm(lessonId:string){
    const type=selected[lessonId]??"TEXT";
    return <form className="blockComposer" onSubmit={e=>addBlock(e,lessonId)}>
      <div className="blockTypeRow">
        {blockTypes.map(([value,label])=><button type="button" key={value} className={type===value?"blockType active":"blockType"} onClick={()=>setSelected(s=>({...s,[lessonId]:value}))}>{label}</button>)}
      </div>
      {type==="TEXT"&&<textarea name="text" required placeholder="Explain a concept, give an instruction, or add teaching notes..." />}
      {type==="VIDEO"&&<><input name="url" required placeholder="Video URL"/><input name="caption" placeholder="Caption or context"/></>}
      {type==="CODE"&&<><input name="language" placeholder="javascript, python, cpp..."/><textarea name="code" required placeholder="Paste example code here..." /></>}
      {type==="QUIZ"&&<><input name="question" required placeholder="Question"/><textarea name="options" required placeholder={"One option per line\nOption A\nOption B\nOption C"}/><input name="answer" type="number" min="0" placeholder="Correct option index (0-based)"/></>}
      {type==="TASK"&&<><input name="taskTitle" required placeholder="Task title"/><textarea name="instructions" required placeholder="What should the learner build, test, measure, or submit?"/></>}
      {type==="CHECKPOINT"&&<textarea name="prompt" required placeholder="Checkpoint prompt, e.g. Enter the voltage you measured."/>}
      {type==="AI_INTERACTION"&&<><textarea name="instruction" required placeholder="How should the Tekora AI tutor help here?"/><input name="starter" placeholder="Optional starter question"/></>}
      <button disabled={busy}>+ Add {blockTypes.find(([v])=>v===type)?.[1]}</button>
    </form>
  }

  return <div className="builder">
    <div className="builderTop"><div><span className="courseBadge">{status}</span><h2>Course curriculum</h2></div><button disabled={busy||status==="PUBLISHED"} onClick={()=>post("/api/v1/creator/courses/"+courseId+"/publish")}>{status==="PUBLISHED"?"Published":"Publish course"}</button></div>
    {error?<p className="formError">{error}</p>:null}
    <div className="moduleList">
      {modules.map((m,i)=><section className="moduleCard" key={m.id}>
        <div className="moduleTitle"><span>{String(i+1).padStart(2,"0")}</span><h3>{m.title}</h3></div>
        {m.lessons.map((l,j)=><article className="lessonEditor" key={l.id}>
          <div><small>Lesson {j+1}</small><h4>{l.title}</h4></div>
          <div className="blockList">
            {l.blocks.map(b=><div className="blockItem" key={b.id}>
              <strong>{b.type}</strong>
              <span>{b.type==="TEXT"?String(b.data?.text??"").slice(0,120):b.type==="VIDEO"?String(b.data?.url??""):b.type==="QUIZ"?String(b.data?.question??""):b.type==="TASK"?String(b.data?.title??""):"Interactive content block"}</span>
            </div>)}
          </div>
          {blockForm(l.id)}
        </article>)}
        <form className="inlineBuilder compact" onSubmit={e=>addLesson(e,m.id)}><input name="title" required placeholder="New lesson title"/><button disabled={busy}>Add lesson</button></form>
      </section>)}
    </div>
    <form className="addModule" onSubmit={addModule}><input name="title" required placeholder="Module title — e.g. Understanding Solar PV Basics"/><button disabled={busy}>+ Add module</button></form>
  </div>
}
