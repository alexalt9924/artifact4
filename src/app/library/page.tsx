import { listEntries } from "@/lib/db/entries";
import EntryCard from "@/components/library/EntryCard";
import EntryForm from "@/components/library/EntryForm";
import TopBar from "@/components/library/TopBar";
import type { EntryType } from "@/types/resume";

const SECTIONS: { type: EntryType; label: string }[] = [
  { type: "education", label: "Education" },
  { type: "experience", label: "Experience" },
  { type: "project", label: "Projects" },
  { type: "skills", label: "Skills" },
];

export default async function LibraryPage() {
  const entries = await listEntries();
  return (
    <>
      <TopBar />
      <main className="mx-auto grid w-full max-w-5xl gap-8 p-6 md:grid-cols-[1fr_20rem]">
        <section className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Library</h1>
          {entries.length === 0 && <p className="text-gray-600">No entries yet. Add your first one.</p>}
          {SECTIONS.map(({ type, label }) => {
            const items = entries.filter((e) => e.type === type);
            if (items.length === 0) return null;
            return (
              <div key={type}>
                <h2 className="mb-2 font-medium">{label}</h2>
                <ul className="flex flex-col gap-3">
                  {items.map((e) => (
                    <EntryCard key={e.id} entry={e} />
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
        <aside>
          <h2 className="mb-2 font-medium">New entry</h2>
          <EntryForm />
        </aside>
      </main>
    </>
  );
}
