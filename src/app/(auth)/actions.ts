"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/db/server";
import { createEntries } from "@/lib/db/entries";
import { saveTemplate } from "@/lib/db/template";
import { mockEntries, mockTemplate } from "@/mocks/entries";

function creds(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(creds(formData));
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/library");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    ...creds(formData),
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  // With email confirmation on, there is no session yet.
  if (!data.session) redirect("/login?message=Check your email to confirm your account");
  redirect("/template");
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error || !data.url) redirect(`/login?error=${encodeURIComponent(error?.message ?? "Google sign-in failed")}`);
  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Guest mode: Supabase anonymous sign-in gives a real (temporary) user, so RLS still applies.
// Seeds sample data so reviewers see a populated library right away.
export async function continueAsGuest() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInAnonymously();
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  const { header, sectionOrder, style, pageSize } = mockTemplate;
  // Two round trips in parallel instead of one per entry.
  await Promise.all([
    saveTemplate({ header, sectionOrder, style, pageSize }),
    createEntries(
      mockEntries.map((e) => ({
        type: e.type,
        title: e.title,
        subtitle: e.subtitle,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        bullets: e.bullets,
      })),
    ),
  ]);
  redirect("/library");
}
