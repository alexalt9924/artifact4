"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Entry } from "@/types/resume";
import { resumeDndId, type EntryDragData } from "@/lib/layout/dnd";
import { formatDateRange } from "@/lib/layout/formatDate";

export type InsertPosition = "before" | "after" | null;

interface ResumeEntryProps {
  entry: Entry;
  overflowing: boolean;
  /** Where a library entry being dragged would be inserted relative to this one. */
  insert: InsertPosition;
  onRemove: (entryId: string) => void;
}

// Highlights, drop lines, and the remove button never change layout, so they can't affect overflow measurement.
export function ResumeEntry({ entry, overflowing, insert, onRemove }: ResumeEntryProps) {
  const data: EntryDragData = { source: "resume", entryId: entry.id, entryType: entry.type };
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: resumeDndId(entry.id),
    data,
  });

  return (
    <div
      ref={setNodeRef}
      data-entry-id={entry.id}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={[
        "group relative mt-[0.5em] cursor-grab rounded-[2px] first:mt-0 active:cursor-grabbing",
        "outline-offset-2 hover:outline hover:outline-1 hover:outline-sky-300",
        overflowing ? "bg-red-50 outline outline-2 outline-red-500 hover:outline-2 hover:outline-red-500" : "",
        "print:bg-transparent print:outline-none",
        isDragging ? "opacity-40" : "",
      ].join(" ")}
      {...attributes}
      {...listeners}
    >
      {insert && (
        <div
          aria-hidden
          className={`pointer-events-none absolute right-0 left-0 h-0.5 bg-sky-500 ${
            insert === "before" ? "-top-[0.3em]" : "-bottom-[0.3em]"
          }`}
        />
      )}
      <button
        type="button"
        aria-label={`Remove ${entry.title} from resume`}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(entry.id)}
        className="absolute top-0 -right-7 hidden h-5 w-5 items-center justify-center rounded-full bg-neutral-700 font-sans text-xs text-white group-hover:flex focus:flex print:hidden"
      >
        ×
      </button>
      <EntryBody entry={entry} />
    </div>
  );
}

function EntryBody({ entry }: { entry: Entry }) {
  if (entry.type === "skills") {
    return (
      <p>
        <span className="font-bold">{entry.title}:</span> {entry.bullets.join(", ")}
      </p>
    );
  }

  const dates = formatDateRange(entry.startDate, entry.endDate);
  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-bold">{entry.title}</span>
        {dates && <span className="shrink-0">{dates}</span>}
      </div>
      {(entry.subtitle || entry.location) && (
        <div className="flex items-baseline justify-between gap-4 italic">
          <span>{entry.subtitle}</span>
          {entry.location && <span className="shrink-0">{entry.location}</span>}
        </div>
      )}
      {entry.bullets.length > 0 && (
        <ul className="mt-[0.15em] list-disc pl-[1.3em]">
          {entry.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
    </>
  );
}
