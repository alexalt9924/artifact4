import { saveEntry } from "@/app/library/actions";
import type { Entry } from "@/types/resume";

export default function EntryForm({ entry }: { entry?: Entry }) {
  const input = "w-full rounded border p-2 text-sm";
  return (
    <form action={saveEntry} className="flex flex-col gap-2">
      {entry && <input type="hidden" name="id" value={entry.id} />}
      <select name="type" defaultValue={entry?.type ?? "project"} className={input}>
        <option value="project">Project</option>
        <option value="experience">Experience</option>
        <option value="education">Education</option>
        <option value="skills">Skill group</option>
      </select>
      <input name="title" required defaultValue={entry?.title} placeholder="Title" className={input} />
      <input name="subtitle" defaultValue={entry?.subtitle} placeholder="Subtitle (company, tech stack)" className={input} />
      <input name="location" defaultValue={entry?.location} placeholder="Location" className={input} />
      <div className="flex gap-2">
        <input name="startDate" defaultValue={entry?.startDate} placeholder="Start (2025-06)" className={input} />
        <input name="endDate" defaultValue={entry?.endDate} placeholder="End (2025-09 or Present)" className={input} />
      </div>
      <textarea
        name="bullets"
        rows={4}
        defaultValue={entry?.bullets.join("\n")}
        placeholder="One bullet per line"
        className={input}
      />
      <button className="self-start rounded bg-black px-3 py-1.5 text-sm text-white">
        {entry ? "Save changes" : "Add entry"}
      </button>
    </form>
  );
}
