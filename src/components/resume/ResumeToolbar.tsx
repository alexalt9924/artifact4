"use client";

import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
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
  "rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40";

const linkClass = "rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900";

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
    <header className="flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-white px-4 py-2.5 print:hidden">
      <span className="font-semibold text-neutral-900">Resume Builder</span>
      <nav className="mr-2 flex gap-1">
        <Link href="/library" className={linkClass}>
          Library
        </Link>
        <Link href="/template" className={linkClass}>
          Template
        </Link>
      </nav>

      <label className="sr-only" htmlFor="resume-switcher">
        Current resume
      </label>
      <select
        id="resume-switcher"
        value={active?.id ?? ""}
        onChange={(e) => onSelect(e.target.value)}
        disabled={resumes.length === 0}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
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
            className="w-48 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
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
        className={buttonClass}
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
        className="ml-auto rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
      >
        Export PDF
      </button>
      <form action={logout}>
        <button type="submit" className={linkClass}>
          Log out
        </button>
      </form>
    </header>
  );
}
