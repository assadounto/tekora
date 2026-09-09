"use client";
import{useState}from"react";import{useRouter}from"next/navigation";
export function LessonCompleteButton({lessonId,completed}:{lessonId:string;completed:boolean}){const router=useRouter();const[busy,setBusy]=useState(false);async function done(){setBusy(true);await fetch("/api/v1/lessons/"+lessonId+"/complete",{method:"POST"});setBusy(false);router.refresh()}return <button className={completed?"lessonDone":"primaryButton"} disabled={busy||completed} onClick={done}>{completed?"Completed ✓":busy?"Saving...":"Mark lesson complete"}</button>}
