// Shared dnd-kit ids, drag data, and collision rules for the resume editor.

import {
  closestCenter,
  pointerWithin,
  type CollisionDetection,
  type DroppableContainer,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import type { EntryType } from "@/types/resume";

export const LIBRARY_DROP_ID = "library";
export const PAGE_DROP_ID = "page";

export interface EntryDragData {
  source: "library" | "resume";
  entryId: string;
  entryType: EntryType;
}

export const libraryDndId = (entryId: string) => `lib:${entryId}`;
export const resumeDndId = (entryId: string) => `res:${entryId}`;

export function dragData(container: { data: { current?: Record<string, unknown> } } | null | undefined) {
  return container?.data.current as EntryDragData | undefined;
}

function isResumeEntry(container: DroppableContainer): boolean {
  return dragData(container)?.source === "resume";
}

/**
 * - Over the library panel: only resume entries can drop there (to remove them).
 * - Over the page: an entry can only land in its own section, so we pick the closest entry of the same type.
 *   If that section is empty, the page itself is the target and the entry is appended.
 * - Anywhere else: no target.
 */
export const resumeCollisionDetection: CollisionDetection = (args) => {
  const active = dragData(args.active);
  if (!active) return closestCenter(args);

  const within = pointerWithin(args);
  const has = (id: UniqueIdentifier) => within.some((c) => c.id === id);

  if (has(LIBRARY_DROP_ID)) {
    return active.source === "resume" ? within.filter((c) => c.id === LIBRARY_DROP_ID) : [];
  }

  // Keyboard drags have no pointer; let them target the page freely.
  const overResume =
    has(PAGE_DROP_ID) ||
    within.some((c) => {
      const container = args.droppableContainers.find((d) => d.id === c.id);
      return container ? isResumeEntry(container) : false;
    });
  if (args.pointerCoordinates && !overResume) return [];

  const sameSection = args.droppableContainers.filter(
    (c) => isResumeEntry(c) && dragData(c)?.entryType === active.entryType,
  );
  if (sameSection.length === 0) {
    const page = args.droppableContainers.find((c) => c.id === PAGE_DROP_ID);
    return page ? [{ id: page.id, data: { droppableContainer: page, value: 0 } }] : [];
  }
  return closestCenter({ ...args, droppableContainers: sameSection });
};
