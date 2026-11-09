import Link from "next/link";
import { continueAsGuest, login, loginWithGoogle, signup } from "@/app/(auth)/actions";
import Logo from "./Logo";
import SubmitButton from "./SubmitButton";
import { btnPrimary, btnSecondary, hintCls, inputCls, labelCls } from "./ui";

const POINTS = [
  "One library of projects, jobs, and skills, written once",
  "Drag entries into a tailored resume for every application",
  "A fixed US Letter page, so formatting never breaks",
];

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" strokeOpacity="0.5" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export default function AuthForm({
  mode,
  error,
  message,
}: {
  mode: "login" | "signup";
  error?: string;
  message?: string;
}) {
  const isLogin = mode === "login";
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel: desktop only, so mobile gets straight to the form. */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <Logo size={34} />
          Resume Builder
        </div>
        <div className="max-w-md">
          <h2 className="text-4xl leading-tight font-semibold tracking-tight">Write it once. Tailor it everywhere.</h2>
          <ul className="mt-8 space-y-4 text-brand-100">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3">
                <Check />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Decorative faux resume page. */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-24 w-72 rotate-6 rounded-md bg-white p-6 shadow-2xl">
          <div className="mx-auto mb-3 h-3 w-24 rounded bg-slate-800" />
          <div className="mx-auto mb-5 h-1.5 w-36 rounded bg-slate-300" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-4">
              <div className="mb-2 h-2 w-20 rounded bg-slate-700" />
              <div className="mb-1.5 h-1.5 w-full rounded bg-slate-200" />
              <div className="mb-1.5 h-1.5 w-5/6 rounded bg-slate-200" />
              <div className="h-1.5 w-2/3 rounded bg-slate-200" />
            </div>
          ))}
        </div>
        <p className="relative text-sm text-brand-200">Built for TCSS 490 · Artifact 4</p>
      </section>

      <section className="flex items-center justify-center bg-slate-50 p-6 lg:bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 font-semibold tracking-tight text-slate-900 lg:hidden">
            <Logo />
            Resume Builder
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 mb-6 text-sm text-slate-600">
            {isLogin ? "Log in to keep building your resumes." : "Start building tailored resumes in minutes."}
          </p>

          {error && (
            <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {message}
            </p>
          )}

          <form action={isLogin ? login : signup} className="flex flex-col gap-4">
            <label className={labelCls}>
              Email
              <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
            </label>
            <label className={labelCls}>
              Password
              <input
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className={inputCls}
              />
              {!isLogin && <span className={hintCls}>At least 6 characters</span>}
            </label>
            <SubmitButton className={`${btnPrimary} w-full`} pendingText={isLogin ? "Logging in…" : "Creating account…"}>
              {isLogin ? "Log in" : "Sign up"}
            </SubmitButton>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex flex-col gap-3">
            <form action={loginWithGoogle}>
              <SubmitButton className={`${btnSecondary} w-full`} pendingText="Redirecting…">
                Continue with Google
              </SubmitButton>
            </form>
            <form action={continueAsGuest} className="flex flex-col gap-1.5">
              <SubmitButton className={`${btnSecondary} w-full`} pendingText="Setting up sample data…">
                Continue as guest
              </SubmitButton>
              <span className={`${hintCls} text-center`}>Try it with sample data, no account needed</span>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "New here? " : "Already have an account? "}
            <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
