import type { Entry, EntryType, Template } from "@/types/resume";
import { PAGE_SIZES, CSS_PX_PER_IN } from "@/lib/layout/pageSize";
import { SECTION_TITLES } from "@/lib/layout/resumeOps";
import { formatDateRange } from "@/lib/layout/formatDate";

interface ResumePreviewProps {
  header: Template["header"];
  sectionOrder: EntryType[];
  style: Template["style"];
  pageSize: Template["pageSize"];
  entries: Entry[];
  /** Display scale; the page itself is always laid out at its true Letter/A4 size. */
  scale?: number;
}

// Read-only look-alike of the resume page (Jake's style) for the library and template screens.
// Not draggable, so it does not depend on dnd-kit. Content past the page edge is clipped.
export default function ResumePreview({ header, sectionOrder, style, pageSize, entries, scale = 0.6 }: ResumePreviewProps) {
  const page = PAGE_SIZES[pageSize];
  const w = page.widthIn * CSS_PX_PER_IN;
  const h = page.heightIn * CSS_PX_PER_IN;
  const contact = [header.phone, header.email, ...header.links].filter(Boolean);

  return (
    <div style={{ width: w * scale, height: h * scale }} className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black/10">
      <div
        style={{
          width: w,
          height: h,
          padding: `${style.marginIn}in`,
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSizePt}pt`,
          lineHeight: 1.25,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="overflow-hidden bg-white text-black"
      >
        <header className="text-center">
          <h1 className="text-[2.3em] leading-tight font-bold [font-variant:small-caps]">
            {header.name || "Your Name"}
          </h1>
          {contact.length > 0 && <p className="mt-[0.1em] text-[0.9em]">{contact.join("  |  ")}</p>}
        </header>
        {sectionOrder.map((type) => {
          const items = entries.filter((e) => e.type === type);
          if (items.length === 0) return null;
          return (
            <section key={type} className="mt-[0.7em]">
              <h2 className="mb-[0.3em] border-b border-current text-[1.2em] leading-snug [font-variant:small-caps]">
                {SECTION_TITLES[type]}
              </h2>
              {items.map((e) => (
                <div key={e.id} className="mt-[0.5em] first:mt-0">
                  <PreviewEntry entry={e} />
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function PreviewEntry({ entry }: { entry: Entry }) {
  if (entry.type === "skills") {
    return (
      <p className="text-[0.9em]">
        <span className="font-bold">{entry.title}:</span> {entry.bullets.join(", ")}
      </p>
    );
  }
  const dates = formatDateRange(entry.startDate, entry.endDate);
  const isProject = entry.type === "project";
  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <span>
          <span className="font-bold">{entry.title}</span>
          {isProject && entry.subtitle && (
            <span className="text-[0.9em]"> | <em>{entry.subtitle}</em></span>
          )}
        </span>
        {dates && <span className="shrink-0">{dates}</span>}
      </div>
      {!isProject && (entry.subtitle || entry.location) && (
        <div className="flex items-baseline justify-between gap-4 text-[0.9em] italic">
          <span>{entry.subtitle}</span>
          {entry.location && <span className="shrink-0">{entry.location}</span>}
        </div>
      )}
      {entry.bullets.length > 0 && (
        <ul className="mt-[0.1em] list-disc pl-[1.5em] text-[0.9em]">
          {entry.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </>
  );
}
