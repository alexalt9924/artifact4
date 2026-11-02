"use client";

import type { RefObject } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Entry, Resume, Template } from "@/types/resume";
import { PAGE_DROP_ID } from "@/lib/layout/dnd";
import { PAGE_SIZES } from "@/lib/layout/pageSize";
import { orderedSectionTypes } from "@/lib/layout/resumeOps";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeSection } from "./ResumeSection";
import type { InsertPosition } from "./ResumeEntry";

interface ResumePageProps {
  resume: Resume;
  template: Template;
  entriesById: Map<string, Entry>;
  contentRef: RefObject<HTMLDivElement | null>;
  overflowIds: Set<string>;
  isOverflowing: boolean;
  /** True while a library entry is being dragged, to hint that the page accepts drops. */
  acceptingDrop: boolean;
  insertion: { entryId: string; position: Exclude<InsertPosition, null> } | null;
  onRemove: (entryId: string) => void;
}

/**
 * The resume at its exact physical page size. The page box never grows: content that doesn't fit spills
 * visibly below the sheet on screen (and is clipped in print) so overflow is never silent.
 */
export function ResumePage({
  resume,
  template,
  entriesById,
  contentRef,
  overflowIds,
  isOverflowing,
  acceptingDrop,
  insertion,
  onRemove,
}: ResumePageProps) {
  const { setNodeRef } = useDroppable({ id: PAGE_DROP_ID });
  const page = PAGE_SIZES[template.pageSize];
  const { fontFamily, fontSizePt, marginIn } = template.style;

  const sections = orderedSectionTypes(template.sectionOrder, resume.sections)
    .map((type) => ({
      type,
      entries: resume.sections[type].map((id) => entriesById.get(id)).filter((e): e is Entry => Boolean(e)),
    }))
    .filter((section) => section.entries.length > 0);

  return (
    <>
      {/* Print must match the screen: exact page size, no browser margins, only the page visible. */}
      <style>{`
        @page { size: ${page.cssSize}; margin: 0; }
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <div
        ref={setNodeRef}
        className={[
          "relative shrink-0 bg-white text-black shadow-lg ring-1 ring-black/5",
          "print:overflow-hidden print:shadow-none print:ring-0",
          acceptingDrop ? "ring-2 ring-sky-400" : "",
        ].join(" ")}
        style={{
          width: `${page.widthIn}in`,
          height: `${page.heightIn}in`,
          padding: `${marginIn}in`,
          fontFamily,
          fontSize: `${fontSizePt}pt`,
          lineHeight: 1.25,
        }}
      >
        <div ref={contentRef} className="relative">
          <ResumeHeader header={template.header} />
          {sections.map((section) => (
            <ResumeSection
              key={section.type}
              type={section.type}
              entries={section.entries}
              overflowIds={overflowIds}
              insertion={insertion}
              onRemove={onRemove}
            />
          ))}
          {sections.length === 0 && (
            <p className="mt-[2em] text-center font-sans text-sm text-neutral-400 print:hidden">
              Drag entries from the library onto this page.
            </p>
          )}
        </div>
        {isOverflowing && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 left-0 border-t-2 border-dashed border-red-500 print:hidden"
            style={{ top: `${page.heightIn - marginIn}in` }}
          />
        )}
      </div>
    </>
  );
}
