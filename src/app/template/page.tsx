import { getTemplate } from "@/lib/db/template";
import { listEntries } from "@/lib/db/entries";
import TopBar from "@/components/library/TopBar";
import TemplateEditor from "@/components/library/TemplateEditor";
import { pageCls } from "@/components/library/ui";

export const metadata = { title: "Template · Resume Builder" };

export default async function TemplatePage() {
  const [t, entries] = await Promise.all([getTemplate(), listEntries()]);
  return (
    <div className={pageCls}>
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-semibold">Resume template</h1>
        <p className="mb-6 text-sm text-slate-600">
          Set this up once. Every resume you build uses it. The preview updates as you type.
        </p>
        <TemplateEditor template={t} entries={entries} />
      </main>
    </div>
  );
}
