"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectSaveButton } from "@/components/project-workspace-controls";
import { projectFields, projects } from "@/modules/projects/catalog";

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
  time: string;
  skills: string[];
  access: "FREE" | "PAID";
  price?: number | null;
  currency: string;
  creatorName?: string;
};

function titleCase(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
}

export function ProjectCatalog({ databaseProjects = [] }: { databaseProjects?: DatabaseProjectCard[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [field, setField] = useState("All fields");

  const allProjects = useMemo<CatalogProject[]>(() => {
    const creatorProjects: CatalogProject[] = databaseProjects.map((project) => ({
      slug: project.slug,
      title: project.title,
      field: project.field,
      area: project.area ?? "General",
      difficulty: titleCase(project.difficulty),
      mode: project.modes.map((mode) => mode === "KIT_READY" ? "Kit-ready" : titleCase(mode)),
      summary: project.summary,
      time: "Creator project",
      skills: [],
      access: project.access,
      price: project.price,
      currency: project.currency,
      creatorName: project.creatorName,
    }));

    const curatedProjects: CatalogProject[] = projects
      .filter((project) => !creatorProjects.some((item) => item.slug === project.slug))
      .map((project) => ({
        ...project,
        access: "FREE" as const,
        currency: "GHS",
      }));

    return [...creatorProjects, ...curatedProjects];
  }, [databaseProjects]);

  const fields = useMemo(() => Array.from(new Set([...projectFields, ...databaseProjects.map(project => project.field)])), [databaseProjects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allProjects.filter((project) => {
      const matchesDifficulty = difficulty === "All" || project.difficulty === difficulty;
      const matchesField = field === "All fields" || project.field === field;
      const haystack = [project.title, project.field, project.area, project.summary, ...project.skills, ...project.mode, project.creatorName ?? ""].join(" ").toLowerCase();
      return matchesDifficulty && matchesField && (!needle || haystack.includes(needle));
    });
  }, [allProjects, difficulty, field, query]);

  return (
    <>
      <div className="projectMarketHead">
        <div><span className="projectEyebrow">PROJECT LIBRARY</span><h2>Choose what you want to build.</h2><p>Start from your field, then choose the difficulty and access that fits you.</p></div>
        <div className="projectMarketTools"><label className="projectSearch"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, fields, skills..." aria-label="Search projects" /></label><Link href="/projects/my" className="projectMyProjectsLink">My Projects →</Link></div>
      </div>

      <div className="projectFilterRow">
        <div>{difficulties.map((item) => <button className={difficulty === item ? "active" : ""} onClick={() => setDifficulty(item)} type="button" key={item}>{item}</button>)}</div>
        <select className="projectFieldSelect" value={field} onChange={(event) => setField(event.target.value)} aria-label="Filter projects by field"><option>All fields</option>{fields.map(item => <option key={item}>{item}</option>)}</select>
      </div>

      <div className="projectResultCount">{filtered.length} project{filtered.length === 1 ? "" : "s"} found</div>

      {filtered.length === 0 ? (
        <div className="projectNoResults"><strong>No matching projects yet.</strong><p>Try another search, or request exactly what you want to build.</p><Link href="/projects/request">Request a project →</Link></div>
      ) : (
        <div className="projectGrid">
          {filtered.map((project, index) => (
            <article className="projectCard" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className={`projectCardVisual projectVisual${(index % 4) + 1}`}><span>{project.field}</span><strong>{project.area}</strong></Link>
              <div className="projectCardBody">
                <div className="projectCardMeta"><span>{project.difficulty}</span><span>{project.access === "FREE" ? "Free" : `${project.currency} ${((project.price ?? 0) / 100).toFixed(2)}`}</span></div>
                <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                <p>{project.summary}</p>
                {project.creatorName ? <div className="projectCreatorLine">By {project.creatorName}</div> : null}
                {project.skills.length ? <div className="projectSkillRow">{project.skills.slice(0, 3).map(skill => <span key={skill}>{skill}</span>)}</div> : null}
                <div className="projectCardFooter"><div><div className="projectModes">{project.mode.map(mode => <span key={mode}>{mode}</span>)}</div><ProjectSaveButton slug={project.slug} compact /></div><Link href={`/projects/${project.slug}`}>View project →</Link></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
