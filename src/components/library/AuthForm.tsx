import Link from "next/link";
import { continueAsGuest, login, loginWithGoogle, signup } from "@/app/(auth)/actions";
import { btnPrimary, btnSecondary, cardCls, hintCls, inputCls, labelCls, pageCls } from "./ui";

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
    <main className={`${pageCls} flex items-center justify-center p-6`}>
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Resume Builder</h1>
          <p className="mt-1 text-sm text-slate-600">Write your experience once. Build a tailored resume for every job.</p>
        </div>
        <div className={`${cardCls} flex flex-col gap-4`}>
          <h2 className="text-lg font-medium">{isLogin ? "Log in" : "Create your account"}</h2>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
          <form action={isLogin ? login : signup} className="flex flex-col gap-3">
            <label className={labelCls}>
              Email
              <input name="email" type="email" required autoComplete="email" className={inputCls} />
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
            <button className={btnPrimary}>{isLogin ? "Log in" : "Sign up"}</button>
          </form>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
          </div>
          <form action={loginWithGoogle}>
            <button className={`${btnSecondary} w-full`}>Continue with Google</button>
          </form>
          <form action={continueAsGuest} className="flex flex-col gap-1">
            <button className={`${btnSecondary} w-full`}>Continue as guest</button>
            <span className={`${hintCls} text-center`}>Try it with sample data, no account needed</span>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          {isLogin ? "New here? " : "Already have an account? "}
          <Link href={isLogin ? "/signup" : "/login"} className="font-medium text-indigo-600 hover:underline">
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
