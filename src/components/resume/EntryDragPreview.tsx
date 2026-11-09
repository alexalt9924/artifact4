import type { Entry } from "@/types/resume";

/** The card that follows the pointer while dragging (rendered in dnd-kit's DragOverlay). */
export function EntryDragPreview({ entry }: { entry: Entry }) {
  return (
    <div className="w-72 cursor-grabbing rounded-md border border-brand-400 bg-white px-3 py-2 text-sm shadow-xl">
      <div className="font-medium text-slate-900">{entry.title}</div>
      {entry.subtitle && <div className="truncate text-slate-600">{entry.subtitle}</div>}
    </div>
  );
}
