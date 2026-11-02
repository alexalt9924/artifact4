import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

const LINKS = [
  { href: "/library", label: "Library" },
  { href: "/template", label: "Template" },
  { href: "/resume", label: "Resume builder" },
];

export default function TopBar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-indigo-600">Resume Builder</span>
          <nav className="flex gap-1 text-sm">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <button className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Log out</button>
        </form>
      </div>
    </header>
  );
}
