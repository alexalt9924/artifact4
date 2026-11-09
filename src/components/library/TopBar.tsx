import { logout } from "@/app/(auth)/actions";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
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
    </header>
  );
}
