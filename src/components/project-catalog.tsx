"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { projectFields } from "@/modules/projects/catalog";

const difficulties = ["All", "Simple", "Intermediate", "Advanced"];

export type DatabaseProjectCard = {
  slug: string;
  title: string;
  field: string;
  area: string | null;
  difficulty: "SIMPLE" | "INTERMEDIATE" | "ADVANCED";
  modes: Array<"DIY" | "GUIDED" | "KIT_READY">;
  summary: string;
  access: "FREE" | "PAID";
  price: number | null;
  currency: string;
  creatorName: string;
};

type CatalogProject = {
  slug: string;
  title: string;
  field: string;
  area: string;
  difficulty: string;
  mode: string[];
  summary: string;
  access: "FREE" | "PAID";
  price: number | null;
  currency: string;
  creatorName: string;
};

function titleCase(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export function ProjectCatalog({ databaseProjects = [] }: { databaseProjects?: DatabaseProjectCard[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [field, setField] = useState("All fields");

  const allProjects = useMemo<CatalogProject[]>(() => databaseProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    field: project.field,
    area: project.area ?? "General",
    difficulty: titleCase(project.difficulty),
    mode: project.modes.map(titleCase),
    summary: project.summary,
    access: project.access,
    price: project.price,
    currency: project.currency,
    creatorName: project.creatorName,
  })), [databaseProjects]);

  const fields = useMemo(() => Array.from(new Set([...projectFields, ...databaseProjects.map(project => project.field)])), [databaseProjects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allProjects.filter((project) => {
      const matchesDifficulty = difficulty === "All" || project.difficulty === difficulty;
      const matchesField = field === "All fields" || project.field === field;
      const haystack = [project.title, project.field, project.area, project.summary, ...project.mode, project.creatorName].join(" ").toLowerCase();
      return matchesDifficulty && matchesField && (!needle || haystack.includes(needle));
    });
  }, [allProjects, difficulty, field, query]);

  return (
    <>
      <div className="projectMarketHead">
        <div><span className="projectEyebrow">PROJECT LIBRARY</span><h2>Choose what you want to build.</h2><p>Every listing is an official Tekora project, available as free or paid access.</p></div>
        <div className="projectMarketTools"><label className="projectSearch"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, fields, skills..." aria-label="Search projects" /></label><Link href="/projects/my" className="projectMyProjectsLink">My Projects →</Link></div>
      </div>

      <div className="projectFilterRow">
        <div>{difficulties.map((item) => <button className={difficulty === item ? "active" : ""} onClick={() => setDifficulty(item)} type="button" key={item}>{item}</button>)}</div>
        <select className="projectFieldSelect" value={field} onChange={(event) => setField(event.target.value)} aria-label="Filter projects by field"><option>All fields</option>{fields.map(item => <option key={item}>{item}</option>)}</select>
      </div>

      <div className="projectResultCount">{filtered.length} published project{filtered.length === 1 ? "" : "s"}</div>

      {filtered.length === 0 ? (
        <div className="projectNoResults"><strong>No published projects match yet.</strong><p>Try another filter, or tell Tekora what project you want and the budget you have.</p><Link href="/projects/request">Request a project →</Link></div>
      ) : (
        <div className="projectGrid">
          {filtered.map((project, index) => (
            <article className="projectCard" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className={`projectCardVisual projectVisual${(index % 4) + 1}`}><span>{project.field}</span><strong>{project.area}</strong></Link>
              <div className="projectCardBody">
                <div className="projectCardMeta"><span>{project.difficulty}</span><span>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</span></div>
                <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                <p>{project.summary}</p>
                <div className="projectCreatorLine">By {project.creatorName}</div>
                <div className="projectCardFooter"><div className="projectModes">{project.mode.map(mode => <span key={mode}>{mode}</span>)}</div><Link href={`/projects/${project.slug}`}>View project →</Link></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
