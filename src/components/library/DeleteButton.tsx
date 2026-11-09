"use client";

export default function DeleteButton({ title }: { title: string }) {
  return (
    <button
      onClick={(e) => {
        if (!confirm(`Delete "${title}"? It will be removed from every resume.`)) e.preventDefault();
      }}
      className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
    >
      Delete
    </button>
  );
}
