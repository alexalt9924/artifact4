import { removeEntry } from "@/app/library/actions";
import type { Entry } from "@/types/resume";
import EntryForm from "./EntryForm";

export default function EntryCard({ entry }: { entry: Entry }) {
  const dates = [entry.startDate, entry.endDate].filter(Boolean).join(" – ");
  return (
    <li className="rounded border p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{entry.title}</p>
          {entry.subtitle && <p className="text-sm text-gray-600">{entry.subtitle}</p>}
          {(dates || entry.location) && (
            <p className="text-xs text-gray-500">{[dates, entry.location].filter(Boolean).join(" · ")}</p>
          )}
        </div>
        <form action={removeEntry}>
          <input type="hidden" name="id" value={entry.id} />
          <button className="text-sm text-red-600 underline">Delete</button>
        </form>
      </div>
      {entry.bullets.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-sm">
          {entry.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <details className="mt-2">
        <summary className="cursor-pointer text-sm underline">Edit</summary>
        <div className="mt-2">
          <EntryForm entry={entry} />
        </div>
      </details>
    </li>
  );
}
