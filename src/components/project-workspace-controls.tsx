"use client";

import { useEffect, useMemo, useState } from "react";

const FAVORITES_KEY = "tekora:project-favorites:v1";
const ACTIVE_KEY = "tekora:my-projects:v1";
const PROGRESS_KEY = "tekora:project-progress:v1";
const UPDATE_EVENT = "tekora-projects-updated";

type Phase = { title: string; description: string };

type ProgressMap = Record<string, number[]>;

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function writeList(key: string, value: string[]) {
  window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(value))));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function writeProgress(value: ProgressMap) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function useProjectState(slug: string) {
  const [favorite, setFavorite] = useState(false);
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    function sync() {
      setFavorite(readList(FAVORITES_KEY).includes(slug));
      setActive(readList(ACTIVE_KEY).includes(slug));
      setCompleted(readProgress()[slug] ?? []);
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(UPDATE_EVENT, sync);
    };
  }, [slug]);

  return { favorite, active, completed };
}

export function ProjectSaveButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { favorite } = useProjectState(slug);

  function toggleFavorite() {
    const current = readList(FAVORITES_KEY);
    writeList(FAVORITES_KEY, favorite ? current.filter((item) => item !== slug) : [...current, slug]);
  }

  return (
    <button
      type="button"
      className={compact ? "projectSaveButton compact" : "premiumSecondaryCta projectSaveButton"}
      onClick={toggleFavorite}
      aria-pressed={favorite}
    >
      <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
      {compact ? (favorite ? "Saved" : "Save") : favorite ? "Saved to favorites" : "Save project"}
    </button>
  );
}

export function ProjectStartButton({ slug }: { slug: string }) {
  const { active, completed } = useProjectState(slug);

  function startProject() {
    if (!active) writeList(ACTIVE_KEY, [...readList(ACTIVE_KEY), slug]);
    document.getElementById("phases")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button type="button" className="premiumPrimaryCta projectStartButton" onClick={startProject}>
      {active ? (completed.length ? "Resume project" : "Project started") : "Start project"} →
    </button>
  );
}

export function ProjectPhaseTracker({ slug, phases }: { slug: string; phases: Phase[] }) {
  const { completed } = useProjectState(slug);
  const percentage = phases.length ? Math.round((completed.length / phases.length) * 100) : 0;

  function togglePhase(index: number) {
    const progress = readProgress();
    const current = new Set(progress[slug] ?? []);
    if (current.has(index)) current.delete(index);
    else current.add(index);
    progress[slug] = Array.from(current).sort((a, b) => a - b);
    writeProgress(progress);

    if (!readList(ACTIVE_KEY).includes(slug)) {
      writeList(ACTIVE_KEY, [...readList(ACTIVE_KEY), slug]);
    }
  }

  const nextIndex = useMemo(() => phases.findIndex((_, index) => !completed.includes(index)), [completed, phases]);

  return (
    <div className="projectPhaseTracker">
      <div className="projectProgressSummary">
        <div>
          <span>YOUR PROGRESS</span>
          <strong>{percentage}% complete</strong>
        </div>
        <small>{completed.length} of {phases.length} phases finished</small>
      </div>
      <div className="projectProgressBar" aria-label={`${percentage}% project progress`}><span style={{ width: `${percentage}%` }} /></div>

      <div className="projectPhaseList">
        {phases.map((phase, index) => {
          const done = completed.includes(index);
          const isNext = nextIndex === index;
          return (
            <article className={done ? "completed" : isNext ? "next" : ""} key={phase.title}>
              <button type="button" className="projectPhaseCheck" onClick={() => togglePhase(index)} aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${phase.title}`} aria-pressed={done}>
                {done ? "✓" : String(index + 1).padStart(2, "0")}
              </button>
              <div><small>PHASE {index + 1}{isNext && !done ? " · NEXT" : ""}</small><h3>{phase.title}</h3><p>{phase.description}</p></div>
              <button type="button" className="projectPhaseStatus" onClick={() => togglePhase(index)}>{done ? "Completed" : "Mark done"}</button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export const projectStorageKeys = {
  favorites: FAVORITES_KEY,
  active: ACTIVE_KEY,
  progress: PROGRESS_KEY,
};
