// Shared Tailwind class strings for Person A's pages.
export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";
export const labelCls = "flex flex-col gap-1 text-sm font-medium text-slate-700";
export const hintCls = "text-xs font-normal text-slate-500";
export const btnPrimary =
  "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300";
export const btnSecondary =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
export const cardCls = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
export const pageCls = "min-h-screen bg-slate-50 text-slate-900";

export const TYPE_LABELS = {
  education: "Education",
  experience: "Experience",
  project: "Project",
  skills: "Skill group",
} as const;

export const TYPE_BADGE = {
  education: "bg-amber-100 text-amber-800",
  experience: "bg-emerald-100 text-emerald-800",
  project: "bg-sky-100 text-sky-800",
  skills: "bg-violet-100 text-violet-800",
} as const;
