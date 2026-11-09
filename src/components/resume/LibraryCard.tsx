"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Entry } from "@/types/resume";
import { libraryDndId, type EntryDragData } from "@/lib/layout/dnd";
import { formatDateRange } from "@/lib/layout/formatDate";

interface LibraryCardProps {
  entry: Entry;
  /** Already on the current resume, so it can't be added twice. */
  onResume: boolean;
}

export function LibraryCard({ entry, onResume }: LibraryCardProps) {
  const data: EntryDragData = { source: "library", entryId: entry.id, entryType: entry.type };
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: libraryDndId(entry.id),
    data,
    disabled: onResume,
  });
  const dates = formatDateRange(entry.startDate, entry.endDate);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      title={onResume ? "Already on this resume" : "Drag onto the resume"}
      className={[
        "rounded-md border bg-white px-3 py-2 text-sm shadow-sm",
        onResume
          ? "cursor-default border-dashed border-slate-300 opacity-60"
          : "cursor-grab border-slate-200 hover:border-brand-400 active:cursor-grabbing",
        isDragging ? "opacity-40" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-slate-900">{entry.title}</span>
        {onResume && <span className="shrink-0 text-xs text-emerald-700">✓ on resume</span>}
      </div>
      {entry.subtitle && <div className="truncate text-slate-600">{entry.subtitle}</div>}
      {entry.type === "skills" ? (
        <div className="truncate text-xs text-slate-500">{entry.bullets.join(", ")}</div>
      ) : (
        <div className="text-xs text-slate-500">
          {[dates, `${entry.bullets.length} bullet${entry.bullets.length === 1 ? "" : "s"}`]
            .filter(Boolean)
            .join(" · ")}
        </div>
      )}
    </div>
  );
}
