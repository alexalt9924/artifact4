import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <nav className="flex gap-4 text-sm">
        <Link href="/library" className="underline">Library</Link>
        <Link href="/template" className="underline">Template</Link>
      </nav>
      <form action={logout}>
        <button className="text-sm underline">Log out</button>
      </form>
    </header>
  );
}
