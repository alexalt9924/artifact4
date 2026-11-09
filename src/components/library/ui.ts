// Shared Tailwind class strings for the app's screens. Colors come from the brand-* / slate-* tokens in globals.css.
export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100";
export const labelCls = "flex flex-col gap-1.5 text-sm font-medium text-slate-700";
export const hintCls = "text-xs font-normal text-slate-500";
export const btnPrimary =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 active:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60";
export const btnSecondary =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60";
export const cardCls = "rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
export const pageCls = "min-h-screen bg-slate-50 text-slate-900";
export const h1Cls = "text-2xl font-semibold tracking-tight text-slate-900";
export const eyebrowCls = "text-xs font-semibold tracking-wider text-slate-500 uppercase";

export const TYPE_LABELS = {
  education: "Education",
  experience: "Experience",
  project: "Project",
  skills: "Skill group",
} as const;

export const TYPE_BADGE = {
  education: "bg-amber-50 text-amber-800 ring-amber-200",
  experience: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  project: "bg-brand-50 text-brand-700 ring-brand-200",
  skills: "bg-violet-50 text-violet-800 ring-violet-200",
} as const;
