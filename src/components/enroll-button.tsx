"use client";

import { useState } from "react";
import { PurchaseButton } from "@/components/purchase-button";

export function EnrollButton({
  courseId,
  access = "FREE",
  price = null,
  currency = "GHS",
}: {
  courseId: string;
  access?: "FREE" | "PAID";
  price?: number | null;
  currency?: string;
}) {
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  if (access === "PAID") {
    return <PurchaseButton targetType="COURSE" targetId={courseId} label={`Buy course · ${currency} ${((price ?? 0) / 100).toFixed(2)} →`} className="primaryButton" />;
  }

  async function enroll(){
    setLoading(true);
    setError("");
    const r=await fetch("/api/v1/courses/"+courseId+"/enroll",{method:"POST"});
    const j=await r.json().catch(()=>({}));
    if(!r.ok){
      if(j.error==="UNAUTHORIZED") window.location.href="/sign-in";
      else setError("Could not enroll.");
      setLoading(false);
      return;
    }
    window.location.href="/learn/course/"+courseId;
  }

  return <div><button className="primaryButton" onClick={enroll} disabled={loading}>{loading?"Adding course...":"Add free course"}</button>{error?<p className="formError">{error}</p>:null}</div>;
}
