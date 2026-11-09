"use client";

import { logout } from "@/app/(auth)/actions";
import Logo from "@/components/library/Logo";
import NavLinks from "@/components/library/NavLinks";
import type { Resume } from "@/types/resume";

interface ResumeToolbarProps {
  resumes: Resume[];
  active: Resume | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

const buttonClass =
  "cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";
const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100";

export function ResumeToolbar({
  resumes,
  active,
  onSelect,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
  onExport,
}: ResumeToolbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white print:hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-2">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-900">
            <Logo />
            Resume Builder
          </span>
          <NavLinks />
        </div>
        <form action={logout}>
          <button className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
            Log out
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 px-4 py-2.5">
        <label className="sr-only" htmlFor="resume-switcher">
          Current resume
        </label>
        <select
          id="resume-switcher"
          value={active?.id ?? ""}
          onChange={(e) => onSelect(e.target.value)}
          disabled={resumes.length === 0}
          className={fieldClass}
        >
          {resumes.length === 0 && <option value="">No resumes</option>}
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name || "Untitled resume"}
            </option>
          ))}
        </select>

        {active && (
          <>
            <label className="sr-only" htmlFor="resume-name">
              Resume name
            </label>
            <input
              id="resume-name"
              value={active.name}
              onChange={(e) => onRename(active.id, e.target.value)}
              placeholder="Untitled resume"
              className={`${fieldClass} w-52`}
            />
          </>
        )}

        <button type="button" className={buttonClass} onClick={onCreate}>
          New
        </button>
        <button type="button" className={buttonClass} disabled={!active} onClick={() => active && onDuplicate(active.id)}>
          Duplicate
        </button>
        <button
          type="button"
          className={`${buttonClass} text-red-700`}
          disabled={!active}
          onClick={() => {
            if (active && window.confirm(`Delete "${active.name || "Untitled resume"}"? Library entries are kept.`)) {
              onDelete(active.id);
            }
          }}
        >
          Delete
        </button>

        <button
          type="button"
          disabled={!active}
          onClick={onExport}
          className="ml-auto cursor-pointer rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 active:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Export PDF
        </button>
      </div>
    </header>
  );
}
