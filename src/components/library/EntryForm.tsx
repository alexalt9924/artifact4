import { saveEntry } from "@/app/library/actions";
import type { Entry } from "@/types/resume";
import SubmitButton from "./SubmitButton";
import { btnPrimary, hintCls, inputCls, labelCls, TYPE_LABELS } from "./ui";

export default function EntryForm({ entry }: { entry?: Entry }) {
  return (
    <form action={saveEntry} className="flex flex-col gap-3">
      {entry && <input type="hidden" name="id" value={entry.id} />}
      <label className={labelCls}>
        Type
        <select name="type" defaultValue={entry?.type ?? "project"} className={inputCls}>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className={labelCls}>
        Title
        <input name="title" required defaultValue={entry?.title} placeholder="Software Engineer Intern" className={inputCls} />
      </label>
      <label className={labelCls}>
        Subtitle <span className={hintCls}>Company, school, or tech stack</span>
        <input name="subtitle" defaultValue={entry?.subtitle} placeholder="Expedia Group" className={inputCls} />
      </label>
      <label className={labelCls}>
        Location
        <input name="location" defaultValue={entry?.location} placeholder="Seattle, WA" className={inputCls} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={labelCls}>
          Start
          <input name="startDate" defaultValue={entry?.startDate} placeholder="2025-06" className={inputCls} />
        </label>
        <label className={labelCls}>
          End
          <input name="endDate" defaultValue={entry?.endDate} placeholder="2025-09 or Present" className={inputCls} />
        </label>
      </div>
      <label className={labelCls}>
        Bullets <span className={hintCls}>One per line. For a skill group, list the skills.</span>
        <textarea name="bullets" rows={5} defaultValue={entry?.bullets.join("\n")} className={inputCls} />
      </label>
      <SubmitButton className={`${btnPrimary} self-start`} pendingText="Saving…">
        {entry ? "Save changes" : "Add to library"}
      </SubmitButton>
    </form>
  );
}
