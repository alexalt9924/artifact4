"use client";

export default function DeleteButton({ title }: { title: string }) {
  return (
    <button
      onClick={(e) => {
        if (!confirm(`Delete "${title}"? It will be removed from every resume.`)) e.preventDefault();
      }}
      className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
