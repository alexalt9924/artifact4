"use client";

import Link from "next/link";
import { useDroppable } from "@dnd-kit/core";
import type { Entry, EntryType } from "@/types/resume";
import { LIBRARY_DROP_ID } from "@/lib/layout/dnd";
import { ENTRY_TYPES, SECTION_TITLES } from "@/lib/layout/resumeOps";
import { LibraryCard } from "./LibraryCard";

interface LibraryPanelProps {
  entries: Entry[];
  sectionOrder: EntryType[];
  isOnResume: (entryId: string) => boolean;
  /** True while a resume entry is being dragged, so the panel can act as a "remove" target. */
  acceptingRemoval: boolean;
}

export function LibraryPanel({ entries, sectionOrder, isOnResume, acceptingRemoval }: LibraryPanelProps) {
  const { setNodeRef, isOver } = useDroppable({ id: LIBRARY_DROP_ID });
  // Template order first, then any type the template leaves out.
  const types = [...sectionOrder, ...ENTRY_TYPES.filter((type) => !sectionOrder.includes(type))];

  return (
    <aside
      ref={setNodeRef}
      className={[
        "relative flex w-80 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 print:hidden",
        acceptingRemoval && isOver ? "bg-red-50" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide text-neutral-700 uppercase">Library</h2>
        <Link href="/library" className="text-sm font-medium text-sky-700 hover:underline">
          + New entry
        </Link>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {types.map((type) => {
          const ofType = entries.filter((e) => e.type === type);
          if (ofType.length === 0) return null;
          return (
            <div key={type}>
              <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                {SECTION_TITLES[type]}
              </h3>
              <div className="space-y-2">
                {ofType.map((entry) => (
                  <LibraryCard key={entry.id} entry={entry} onResume={isOnResume(entry.id)} />
                ))}
              </div>
            </div>
          );
        })}
        {entries.length === 0 && <p className="text-sm text-neutral-500">Your library is empty.</p>}
      </div>
      {acceptingRemoval && (
        <div
          className={[
            "pointer-events-none absolute inset-2 flex items-center justify-center rounded-lg border-2 border-dashed text-sm font-medium",
            isOver ? "border-red-500 bg-red-50/90 text-red-700" : "border-neutral-400 bg-neutral-50/80 text-neutral-600",
          ].join(" ")}
        >
          Drop here to remove from resume
        </div>
      )}
    </aside>
  );
}
