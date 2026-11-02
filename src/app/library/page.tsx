import Link from "next/link";
import { listEntries } from "@/lib/db/entries";
import EntryCard from "@/components/library/EntryCard";
import EntryForm from "@/components/library/EntryForm";
import TopBar from "@/components/library/TopBar";
import { cardCls, pageCls } from "@/components/library/ui";
import type { EntryType } from "@/types/resume";

export const metadata = { title: "Library · Resume Builder" };

const SECTIONS: { type: EntryType; label: string }[] = [
  { type: "education", label: "Education" },
  { type: "experience", label: "Experience" },
  { type: "project", label: "Projects" },
  { type: "skills", label: "Skills" },
];

export default async function LibraryPage() {
  const entries = await listEntries();
  return (
    <div className={pageCls}>
      <TopBar />
      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-8 lg:grid-cols-[1fr_22rem]">
        <section className="flex flex-col gap-8">
          <div>
            <h1 className="text-2xl font-semibold">Your library</h1>
            <p className="text-sm text-slate-600">
              Everything you have done, written once. Drag entries into a resume in the{" "}
              <Link href="/resume" className="font-medium text-indigo-600 hover:underline">
                resume builder
              </Link>
              .
            </p>
          </div>
          {entries.length === 0 && (
            <div className={`${cardCls} text-center text-slate-600`}>
              Nothing here yet. Add your first entry using the form.
            </div>
          )}
          {SECTIONS.map(({ type, label }) => {
            const items = entries.filter((e) => e.type === type);
            if (items.length === 0) return null;
            return (
              <div key={type}>
                <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">
                  {label} <span className="font-normal">({items.length})</span>
                </h2>
                <ul className="flex flex-col gap-3">
                  {items.map((e) => (
                    <EntryCard key={e.id} entry={e} />
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className={cardCls}>
            <h2 className="mb-4 font-semibold">New entry</h2>
            <EntryForm />
          </div>
        </aside>
      </main>
    </div>
  );
}
