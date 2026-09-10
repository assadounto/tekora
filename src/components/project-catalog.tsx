"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectSaveButton } from "@/components/project-workspace-controls";
import { projectFields, projects } from "@/modules/projects/catalog";

const difficulties = ["All", "Simple", "Intermediate", "Advanced"];

export function ProjectCatalog() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [field, setField] = useState("All fields");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesDifficulty = difficulty === "All" || project.difficulty === difficulty;
      const matchesField = field === "All fields" || project.field === field;
      const haystack = [project.title, project.field, project.area, project.summary, ...project.skills, ...project.mode].join(" ").toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      return matchesDifficulty && matchesField && matchesQuery;
    });
  }, [difficulty, field, query]);

  return (
    <>
      <div className="projectMarketHead">
        <div><span className="projectEyebrow">PROJECT LIBRARY</span><h2>Choose what you want to build.</h2><p>Start from your field, then choose the difficulty and style that fits you.</p></div>
        <div className="projectMarketTools">
          <label className="projectSearch"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, fields, skills..." aria-label="Search projects" /></label>
          <Link href="/projects/my" className="projectMyProjectsLink">My Projects →</Link>
        </div>
      </div>

      <div className="projectFilterRow">
        <div>{difficulties.map((item) => <button className={difficulty === item ? "active" : ""} onClick={() => setDifficulty(item)} type="button" key={item}>{item}</button>)}</div>
        <select className="projectFieldSelect" value={field} onChange={(event) => setField(event.target.value)} aria-label="Filter projects by field"><option>All fields</option>{projectFields.map(item => <option key={item}>{item}</option>)}</select>
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
                <div className="projectCardMeta"><span>{project.difficulty}</span><span>{project.time}</span></div>
                <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
                <p>{project.summary}</p>
                <div className="projectSkillRow">{project.skills.slice(0, 3).map(skill => <span key={skill}>{skill}</span>)}</div>
                <div className="projectCardFooter">
                  <div><div className="projectModes">{project.mode.map(mode => <span key={mode}>{mode}</span>)}</div><ProjectSaveButton slug={project.slug} compact /></div>
                  <Link href={`/projects/${project.slug}`}>View project →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
