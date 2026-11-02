"use client";

import { useCallback, useEffect, useState } from "react";
import type { Resume } from "@/types/resume";
import { emptySections, type Sections } from "./resumeOps";
import type { ResumeStore } from "./resumeStore";

function now(): string {
  return new Date().toISOString();
}

function persist(store: ResumeStore, resume: Resume): void {
  store.save(resume).catch((error: unknown) => console.error("Failed to save resume", error));
}

/**
 * Loads the user's resumes from a store and exposes create / rename / duplicate / delete / update.
 * `seed` is saved the very first time a user has no stored data at all.
 */
export function useResumes(store: ResumeStore, userId: string, seed: Resume[]) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    store
      .list(userId)
      .then((stored) => {
        if (cancelled) return;
        let list = stored;
        if (list === null) {
          list = seed;
          list.forEach((r) => persist(store, r));
        }
        setResumes(list);
        setActiveId(list[0]?.id ?? null);
        setLoaded(true);
      })
      .catch((error: unknown) => {
        console.error("Failed to load resumes", error);
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
    // `seed` is only used on first load; re-running when its identity changes would reload storage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, userId]);

  const replace = useCallback(
    (id: string, change: (r: Resume) => Resume) => {
      setResumes((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const next = { ...change(r), updatedAt: now() };
          // Saving is idempotent, so it's safe if React runs this updater twice in Strict Mode.
          persist(store, next);
          return next;
        }),
      );
    },
    [store],
  );

  const create = useCallback(
    (name: string) => {
      const resume: Resume = { id: crypto.randomUUID(), userId, name, sections: emptySections(), updatedAt: now() };
      persist(store, resume);
      setResumes((prev) => [...prev, resume]);
      setActiveId(resume.id);
    },
    [store, userId],
  );

  const duplicate = useCallback(
    (id: string) => {
      const source = resumes.find((r) => r.id === id);
      if (!source) return;
      const copy: Resume = {
        ...source,
        id: crypto.randomUUID(),
        name: `${source.name} (copy)`,
        sections: structuredClone(source.sections),
        updatedAt: now(),
      };
      persist(store, copy);
      setResumes((prev) => [...prev, copy]);
      setActiveId(copy.id);
    },
    [resumes, store],
  );

  const remove = useCallback(
    (id: string) => {
      store.remove(id).catch((error: unknown) => console.error("Failed to delete resume", error));
      const remaining = resumes.filter((r) => r.id !== id);
      setResumes(remaining);
      if (activeId === id) setActiveId(remaining[0]?.id ?? null);
    },
    [activeId, resumes, store],
  );

  const rename = useCallback((id: string, name: string) => replace(id, (r) => ({ ...r, name })), [replace]);

  const updateSections = useCallback(
    (id: string, change: (sections: Sections) => Sections) =>
      replace(id, (r) => ({ ...r, sections: change(r.sections) })),
    [replace],
  );

  const active = resumes.find((r) => r.id === activeId) ?? null;

  return { resumes, active, loaded, setActiveId, create, duplicate, remove, rename, updateSections };
}
