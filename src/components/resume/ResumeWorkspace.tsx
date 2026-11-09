"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Entry, Resume, Template } from "@/types/resume";
import { LIBRARY_DROP_ID, PAGE_DROP_ID, dragData, resumeCollisionDetection, type EntryDragData } from "@/lib/layout/dnd";
import { contentHeightPx } from "@/lib/layout/pageSize";
import { addEntry, containsEntry, moveEntry, removeEntry } from "@/lib/layout/resumeOps";
import { supabaseResumeStore } from "@/lib/layout/supabaseResumeStore";
import { useOverflow } from "@/lib/layout/useOverflow";
import { useResumes } from "@/lib/layout/useResumes";
import { EntryDragPreview } from "./EntryDragPreview";
import { LibraryPanel } from "./LibraryPanel";
import { OverflowWarning } from "./OverflowWarning";
import { ResumePage } from "./ResumePage";
import { ResumeToolbar } from "./ResumeToolbar";

interface ResumeWorkspaceProps {
  entries: Entry[];
  template: Template;
  /** Resumes saved the first time a user has no stored resumes. */
  seedResumes: Resume[];
}

type Insertion = { entryId: string; position: "before" | "after" } | null;

/** Where a library entry should go relative to the resume entry it's over, based on vertical centers. */
function insertionFor(event: DragMoveEvent | DragEndEvent): Insertion {
  const { active, over } = event;
  const source = dragData(active);
  const target = dragData(over);
  if (source?.source !== "library" || target?.source !== "resume" || !over) return null;
  const dragged = active.rect.current.translated;
  if (!dragged) return null;
  const draggedCenter = dragged.top + dragged.height / 2;
  const overCenter = over.rect.top + over.rect.height / 2;
  return { entryId: target.entryId, position: draggedCenter > overCenter ? "after" : "before" };
}

export function ResumeWorkspace({ entries, template, seedResumes }: ResumeWorkspaceProps) {
  const { resumes, active, loaded, setActiveId, create, duplicate, remove, rename, updateSections } = useResumes(
    supabaseResumeStore,
    template.userId,
    seedResumes,
  );

  const entriesById = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries]);
  const contentRef = useRef<HTMLDivElement>(null);
  const overflow = useOverflow(contentRef, contentHeightPx(template), [active?.id, active?.sections, entries, template]);

  const [dragging, setDragging] = useState<EntryDragData | null>(null);
  const [insertion, setInsertion] = useState<Insertion>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragging(dragData(event.active) ?? null);
  }, []);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const next = insertionFor(event);
    setInsertion((prev) =>
      prev?.entryId === next?.entryId && prev?.position === next?.position ? prev : next,
    );
  }, []);

  const resetDrag = useCallback(() => {
    setDragging(null);
    setInsertion(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const source = dragData(event.active);
      const { over } = event;
      const finalInsertion = insertionFor(event);
      resetDrag();
      if (!active || !source || !over) return;

      if (source.source === "library") {
        if (over.id === PAGE_DROP_ID) {
          updateSections(active.id, (s) => addEntry(s, source.entryType, source.entryId));
          return;
        }
        const target = dragData(over);
        if (target?.source !== "resume" || target.entryType !== source.entryType) return;
        updateSections(active.id, (s) => {
          const index = s[source.entryType].indexOf(target.entryId);
          const at = finalInsertion?.position === "after" ? index + 1 : index;
          return addEntry(s, source.entryType, source.entryId, at);
        });
        return;
      }

      // Dragged from the resume.
      if (over.id === LIBRARY_DROP_ID) {
        updateSections(active.id, (s) => removeEntry(s, source.entryId));
        return;
      }
      const target = dragData(over);
      if (target?.source !== "resume" || target.entryType !== source.entryType) return;
      updateSections(active.id, (s) => {
        const ids = s[source.entryType];
        return moveEntry(s, source.entryType, ids.indexOf(source.entryId), ids.indexOf(target.entryId));
      });
    },
    [active, resetDrag, updateSections],
  );

  const handleRemove = useCallback(
    (entryId: string) => {
      if (active) updateSections(active.id, (s) => removeEntry(s, entryId));
    },
    [active, updateSections],
  );

  const handleCreate = useCallback(() => create(`Resume ${resumes.length + 1}`), [create, resumes.length]);

  const handleExport = useCallback(() => {
    if (!active) return;
    if (
      overflow.isOverflowing &&
      !window.confirm("This resume is over one page. Content past the bottom margin will be cut off. Export anyway?")
    ) {
      return;
    }
    // The browser uses the document title as the default PDF file name.
    const previousTitle = document.title;
    document.title = [template.header.name, active.name].filter(Boolean).join(" - ") || "Resume";
    window.addEventListener("afterprint", () => (document.title = previousTitle), { once: true });
    window.print();
  }, [active, overflow.isOverflowing, template.header.name]);

  const draggedEntry = dragging ? entriesById.get(dragging.entryId) : undefined;

  return (
    <DndContext
      // A stable id keeps dnd-kit's accessibility ids the same on server and client (avoids a hydration mismatch).
      id="resume-dnd"
      sensors={sensors}
      collisionDetection={resumeCollisionDetection}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={resetDrag}
    >
      <div className="flex h-screen flex-col bg-slate-100 print:block print:h-auto print:bg-white">
        <ResumeToolbar
          resumes={resumes}
          active={active}
          onSelect={setActiveId}
          onCreate={handleCreate}
          onRename={rename}
          onDuplicate={duplicate}
          onDelete={remove}
          onExport={handleExport}
        />
        <div className="flex min-h-0 flex-1 print:block">
          <LibraryPanel
            entries={entries}
            sectionOrder={template.sectionOrder}
            isOnResume={(id) => (active ? containsEntry(active.sections, id) : false)}
            acceptingRemoval={dragging?.source === "resume"}
          />
          <main className="flex min-w-0 flex-1 flex-col bg-slate-200 print:block print:bg-white">
            {active && (
              <OverflowWarning
                usedPx={overflow.usedPx}
                availablePx={overflow.availablePx}
                overflowCount={overflow.overflowIds.size}
              />
            )}
            <div className="flex-1 overflow-auto print:overflow-visible">
              {!loaded ? (
                <p className="p-8 text-sm text-slate-500 print:hidden">Loading…</p>
              ) : active ? (
                // Extra bottom padding leaves room to see content that spills past the page.
                <div className="mx-auto w-fit px-10 pt-8 pb-40 print:m-0 print:p-0">
                  <ResumePage
                    resume={active}
                    template={template}
                    entriesById={entriesById}
                    contentRef={contentRef}
                    overflowIds={overflow.overflowIds}
                    isOverflowing={overflow.isOverflowing}
                    acceptingDrop={dragging?.source === "library"}
                    insertion={insertion}
                    onRemove={handleRemove}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-16 text-slate-600 print:hidden">
                  <p>You don&apos;t have any resumes yet.</p>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Create a resume
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>{draggedEntry ? <EntryDragPreview entry={draggedEntry} /> : null}</DragOverlay>
    </DndContext>
  );
}
