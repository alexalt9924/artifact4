"use client";

import { useState } from "react";
import type { Entry, EntryType, Template } from "@/types/resume";
import { updateTemplate } from "@/app/template/actions";
import ResumePreview from "./ResumePreview";
import SubmitButton from "./SubmitButton";
import { btnPrimary, cardCls, hintCls, inputCls, labelCls } from "./ui";

const SECTION_LABELS: Record<EntryType, string> = {
  education: "Education",
  experience: "Experience",
  project: "Projects",
  skills: "Skills",
};
const FONTS = ["Times New Roman", "Georgia", "Arial", "Calibri", "Helvetica"];
const ORDINALS = ["First", "Second", "Third", "Fourth"];

// Form state drives the preview, so every keystroke shows up on the page immediately.
export default function TemplateEditor({ template, entries }: { template: Template; entries: Entry[] }) {
  const [name, setName] = useState(template.header.name);
  const [email, setEmail] = useState(template.header.email ?? "");
  const [phone, setPhone] = useState(template.header.phone ?? "");
  const [links, setLinks] = useState(template.header.links.join("\n"));
  const [order, setOrder] = useState<EntryType[]>(template.sectionOrder);
  const [fontFamily, setFontFamily] = useState(template.style.fontFamily);
  const [fontSizePt, setFontSizePt] = useState(String(template.style.fontSizePt));
  const [marginIn, setMarginIn] = useState(String(template.style.marginIn));
  const [pageSize, setPageSize] = useState<Template["pageSize"]>(template.pageSize);

  const num = (v: string, min: number, max: number, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.min(max, Math.max(min, n)) : fallback;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_31rem]">
      <form action={updateTemplate} className="flex flex-col gap-6">
        <fieldset className={`${cardCls} flex flex-col gap-3`}>
          <legend className="sr-only">Header</legend>
          <h2 className="font-semibold">Header</h2>
          <label className={labelCls}>
            Full name
            <input name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Douk" className={inputCls} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelCls}>
              Email
              <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Phone
              <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </label>
          </div>
          <label className={labelCls}>
            Links <span className={hintCls}>One per line, such as LinkedIn or GitHub</span>
            <textarea name="links" rows={3} value={links} onChange={(e) => setLinks(e.target.value)} className={inputCls} />
          </label>
        </fieldset>

        <fieldset className={`${cardCls} flex flex-col gap-3`}>
          <legend className="sr-only">Section order</legend>
          <div>
            <h2 className="font-semibold">Section order</h2>
            <p className={hintCls}>Which section appears first on the page. Each section must be used once.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {order.map((current, i) => (
              <label key={i} className={labelCls}>
                {ORDINALS[i]}
                <select
                  name={`order${i}`}
                  value={current}
                  onChange={(e) => setOrder(order.map((o, j) => (j === i ? (e.target.value as EntryType) : o)))}
                  className={inputCls}
                >
                  {Object.entries(SECTION_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={`${cardCls} flex flex-col gap-3`}>
          <legend className="sr-only">Style</legend>
          <h2 className="font-semibold">Style</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelCls}>
              Font
              <select name="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className={inputCls}>
                {FONTS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
            <label className={labelCls}>
              Page size
              <select name="pageSize" value={pageSize} onChange={(e) => setPageSize(e.target.value as Template["pageSize"])} className={inputCls}>
                <option value="letter">US Letter (8.5 x 11 in)</option>
                <option value="a4">A4</option>
              </select>
            </label>
            <label className={labelCls}>
              Font size (pt)
              <input name="fontSizePt" type="number" step="0.5" min="8" max="14" value={fontSizePt} onChange={(e) => setFontSizePt(e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Margins (inches)
              <input name="marginIn" type="number" step="0.05" min="0.25" max="1.5" value={marginIn} onChange={(e) => setMarginIn(e.target.value)} className={inputCls} />
            </label>
          </div>
        </fieldset>

        <SubmitButton className={`${btnPrimary} self-start`} pendingText="Saving…">
          Save template
        </SubmitButton>
      </form>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">Live preview</p>
        <ResumePreview
          header={{
            name,
            email: email || undefined,
            phone: phone || undefined,
            links: links.split("\n").map((l) => l.trim()).filter(Boolean),
          }}
          sectionOrder={order}
          style={{
            fontFamily,
            fontSizePt: num(fontSizePt, 8, 14, 11),
            marginIn: num(marginIn, 0.25, 1.5, 0.5),
          }}
          pageSize={pageSize}
          entries={entries}
        />
      </aside>
    </div>
  );
}
