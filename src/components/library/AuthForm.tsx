import Link from "next/link";
import { continueAsGuest, login, loginWithGoogle, signup } from "@/app/(auth)/actions";

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
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">{isLogin ? "Log in" : "Create account"}</h1>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded bg-green-50 p-2 text-sm text-green-700">{message}</p>}
      <form action={isLogin ? login : signup} className="flex flex-col gap-3">
        <input name="email" type="email" required placeholder="Email" className="rounded border p-2" />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          className="rounded border p-2"
        />
        <button className="rounded bg-black p-2 text-white">{isLogin ? "Log in" : "Sign up"}</button>
      </form>
      <form action={loginWithGoogle}>
        <button className="w-full rounded border p-2">Continue with Google</button>
      </form>
      <form action={continueAsGuest}>
        <button className="w-full rounded border border-dashed p-2">Continue as guest</button>
      </form>
      <p className="text-sm">
        {isLogin ? "No account? " : "Already have an account? "}
        <Link href={isLogin ? "/signup" : "/login"} className="underline">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </main>
  );
}
