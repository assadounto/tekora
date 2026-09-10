"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/modules/projects/catalog";

const FAVORITES_KEY = "tekora:project-favorites:v1";
const ACTIVE_KEY = "tekora:my-projects:v1";
const PROGRESS_KEY = "tekora:project-progress:v1";
const UPDATE_EVENT = "tekora-projects-updated";

type ProgressMap = Record<string, number[]>;

function readList(key: string): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readProgress(): ProgressMap {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function MyProjectsBoard() {
  const [activeSlugs, setActiveSlugs] = useState<string[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [tab, setTab] = useState<"active" | "saved">("active");

  useEffect(() => {
    function sync() {
      setActiveSlugs(readList(ACTIVE_KEY));
      setFavoriteSlugs(readList(FAVORITES_KEY));
      setProgress(readProgress());
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(UPDATE_EVENT, sync);
    };
  }, []);

  const visible = useMemo(() => {
    const slugs = tab === "active" ? activeSlugs : favoriteSlugs;
    return slugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean);
  }, [activeSlugs, favoriteSlugs, tab]);

  return (
    <section className="myProjectsBoard">
      <div className="myProjectsTabs" role="tablist" aria-label="My project lists">
        <button className={tab === "active" ? "active" : ""} type="button" onClick={() => setTab("active")}>In progress <span>{activeSlugs.length}</span></button>
        <button className={tab === "saved" ? "active" : ""} type="button" onClick={() => setTab("saved")}>Favorites <span>{favoriteSlugs.length}</span></button>
      </div>

      {visible.length === 0 ? (
        <div className="myProjectsEmpty">
          <span>{tab === "active" ? "PR" : "♡"}</span>
          <div>
            <h2>{tab === "active" ? "No projects started yet." : "No favorites yet."}</h2>
            <p>{tab === "active" ? "Start any guided or DIY project and your progress will appear here." : "Save projects you like so you can compare them or come back later."}</p>
          </div>
          <Link href="/projects" className="premiumPrimaryCta">Browse projects →</Link>
        </div>
      ) : (
        <div className="myProjectsGrid">
          {visible.map((project) => {
            if (!project) return null;
            const completed = progress[project.slug]?.length ?? 0;
            const percentage = project.phases.length ? Math.round((completed / project.phases.length) * 100) : 0;
            return (
              <article key={project.slug}>
                <div className="myProjectCardTop"><span>{project.field}</span><em>{project.difficulty}</em></div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                {tab === "active" ? <><div className="myProjectProgress"><span style={{ width: `${percentage}%` }} /></div><div className="myProjectProgressMeta"><span>{percentage}% complete</span><span>{completed}/{project.phases.length} phases</span></div></> : <div className="myProjectModes">{project.mode.map((mode) => <span key={mode}>{mode}</span>)}</div>}
                <div className="myProjectFooter"><span>{project.area}</span><Link href={`/projects/${project.slug}`}>{tab === "active" ? "Continue →" : "View project →"}</Link></div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
