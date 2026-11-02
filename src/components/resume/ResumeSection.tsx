"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Entry, EntryType } from "@/types/resume";
import { resumeDndId } from "@/lib/layout/dnd";
import { SECTION_TITLES } from "@/lib/layout/resumeOps";
import { ResumeEntry, type InsertPosition } from "./ResumeEntry";

interface ResumeSectionProps {
  type: EntryType;
  entries: Entry[];
  overflowIds: Set<string>;
  insertion: { entryId: string; position: Exclude<InsertPosition, null> } | null;
  onRemove: (entryId: string) => void;
}

export function ResumeSection({ type, entries, overflowIds, insertion, onRemove }: ResumeSectionProps) {
  return (
    <section className="mt-[0.9em]">
      <h2 className="mb-[0.35em] border-b border-current text-[1.05em] font-bold tracking-wider uppercase">
        {SECTION_TITLES[type]}
      </h2>
      <SortableContext items={entries.map((e) => resumeDndId(e.id))} strategy={verticalListSortingStrategy}>
        {entries.map((entry) => (
          <ResumeEntry
            key={entry.id}
            entry={entry}
            overflowing={overflowIds.has(entry.id)}
            insert={insertion?.entryId === entry.id ? insertion.position : null}
            onRemove={onRemove}
          />
        ))}
      </SortableContext>
    </section>
  );
}
