import { getTemplate } from "@/lib/db/template";
import TopBar from "@/components/library/TopBar";
import { btnPrimary, cardCls, hintCls, inputCls, labelCls, pageCls } from "@/components/library/ui";
import { updateTemplate } from "./actions";

export const metadata = { title: "Template · Resume Builder" };

const SECTION_LABELS = {
  education: "Education",
  experience: "Experience",
  project: "Projects",
  skills: "Skills",
} as const;

const FONTS = ["Times New Roman", "Georgia", "Arial", "Calibri", "Helvetica"];
const ORDINALS = ["First", "Second", "Third", "Fourth"];

export default async function TemplatePage() {
  const t = await getTemplate();
  return (
    <div className={pageCls}>
      <TopBar />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-semibold">Resume template</h1>
        <p className="mb-6 text-sm text-slate-600">Set this up once. Every resume you build uses it.</p>
        <form action={updateTemplate} className="flex flex-col gap-6">
          <fieldset className={`${cardCls} flex flex-col gap-3`}>
            <legend className="sr-only">Header</legend>
            <h2 className="font-semibold">Header</h2>
            <label className={labelCls}>
              Full name
              <input name="name" required defaultValue={t.header.name} placeholder="Alex Douk" className={inputCls} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>
                Email
                <input name="email" type="email" defaultValue={t.header.email} className={inputCls} />
              </label>
              <label className={labelCls}>
                Phone
                <input name="phone" defaultValue={t.header.phone} className={inputCls} />
              </label>
            </div>
            <label className={labelCls}>
              Links <span className={hintCls}>One per line, such as LinkedIn or GitHub</span>
              <textarea name="links" rows={3} defaultValue={t.header.links.join("\n")} className={inputCls} />
            </label>
          </fieldset>

          <fieldset className={`${cardCls} flex flex-col gap-3`}>
            <legend className="sr-only">Section order</legend>
            <div>
              <h2 className="font-semibold">Section order</h2>
              <p className={hintCls}>Which section appears first on the page. Each section must be used once.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {t.sectionOrder.map((current, i) => (
                <label key={i} className={labelCls}>
                  {ORDINALS[i]}
                  <select name={`order${i}`} defaultValue={current} className={inputCls}>
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
                <select name="fontFamily" defaultValue={t.style.fontFamily} className={inputCls}>
                  {FONTS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </label>
              <label className={labelCls}>
                Page size
                <select name="pageSize" defaultValue={t.pageSize} className={inputCls}>
                  <option value="letter">US Letter (8.5 x 11 in)</option>
                  <option value="a4">A4</option>
                </select>
              </label>
              <label className={labelCls}>
                Font size (pt)
                <input name="fontSizePt" type="number" step="0.5" min="8" max="14" defaultValue={t.style.fontSizePt} className={inputCls} />
              </label>
              <label className={labelCls}>
                Margins (inches)
                <input name="marginIn" type="number" step="0.05" min="0.25" max="1.5" defaultValue={t.style.marginIn} className={inputCls} />
              </label>
            </div>
          </fieldset>

          <button className={`${btnPrimary} self-start`}>Save template</button>
        </form>
      </main>
    </div>
  );
}
