import { removeEntry } from "@/app/library/actions";
import type { Entry } from "@/types/resume";
import DeleteButton from "./DeleteButton";
import EntryForm from "./EntryForm";
import { cardCls, TYPE_BADGE, TYPE_LABELS } from "./ui";

export default function EntryCard({ entry }: { entry: Entry }) {
  const dates = [entry.startDate, entry.endDate].filter(Boolean).join(" – ");
  const meta = [dates, entry.location].filter(Boolean).join(" · ");
  return (
    <li className={cardCls}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{entry.title}</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TYPE_BADGE[entry.type]}`}>
              {TYPE_LABELS[entry.type]}
            </span>
          </div>
          {entry.subtitle && <p className="text-sm text-slate-600">{entry.subtitle}</p>}
          {meta && <p className="text-xs text-slate-500">{meta}</p>}
        </div>
        <form action={removeEntry}>
          <input type="hidden" name="id" value={entry.id} />
          <DeleteButton title={entry.title} />
        </form>
      </div>
      {entry.bullets.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {entry.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <details className="mt-3 border-t border-slate-100 pt-3">
        <summary className="cursor-pointer text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">Edit</summary>
        <div className="mt-3">
          <EntryForm entry={entry} />
        </div>
      </details>
    </li>
  );
}
