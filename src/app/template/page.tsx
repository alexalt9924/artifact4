import { getTemplate } from "@/lib/db/template";
import TopBar from "@/components/library/TopBar";
import { updateTemplate } from "./actions";

const SECTION_LABELS = {
  education: "Education",
  experience: "Experience",
  project: "Projects",
  skills: "Skills",
} as const;

const FONTS = ["Times New Roman", "Arial", "Calibri", "Georgia", "Helvetica"];

export default async function TemplatePage() {
  const t = await getTemplate();
  const input = "w-full rounded border p-2 text-sm";
  return (
    <>
      <TopBar />
      <main className="mx-auto w-full max-w-xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Resume template</h1>
        <form action={updateTemplate} className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 font-medium">Header</legend>
            <input name="name" required defaultValue={t.header.name} placeholder="Full name" className={input} />
            <input name="email" type="email" defaultValue={t.header.email} placeholder="Email" className={input} />
            <input name="phone" defaultValue={t.header.phone} placeholder="Phone" className={input} />
            <textarea
              name="links"
              rows={3}
              defaultValue={t.header.links.join("\n")}
              placeholder="Links, one per line"
              className={input}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 font-medium">Section order (top to bottom)</legend>
            {t.sectionOrder.map((current, i) => (
              <select key={i} name={`order${i}`} defaultValue={current} className={input}>
                {Object.entries(SECTION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            ))}
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 font-medium">Style</legend>
            <select name="fontFamily" defaultValue={t.style.fontFamily} className={input}>
              {FONTS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <label className="text-sm">
              Font size (pt)
              <input name="fontSizePt" type="number" step="0.5" min="8" max="14" defaultValue={t.style.fontSizePt} className={input} />
            </label>
            <label className="text-sm">
              Margins (inches)
              <input name="marginIn" type="number" step="0.05" min="0.25" max="1.5" defaultValue={t.style.marginIn} className={input} />
            </label>
            <label className="text-sm">
              Page size
              <select name="pageSize" defaultValue={t.pageSize} className={input}>
                <option value="letter">US Letter (8.5 × 11 in)</option>
                <option value="a4">A4</option>
              </select>
            </label>
          </fieldset>

          <button className="self-start rounded bg-black px-4 py-2 text-white">Save template</button>
        </form>
      </main>
    </>
  );
}
