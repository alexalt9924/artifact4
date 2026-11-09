import { createClient } from "./server";
import { entryFromRow, entryToRow, type EntryInput, type EntryRow } from "./mappers";
import type { Entry } from "@/types/resume";

// RLS scopes every query to the logged-in user; user_id defaults to auth.uid().

export async function listEntries(): Promise<Entry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as EntryRow[]).map(entryFromRow);
}

export async function createEntry(input: EntryInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("entries").insert(entryToRow(input));
  if (error) throw new Error(error.message);
}

/** One round trip for many entries (used to seed guest accounts quickly). */
export async function createEntries(inputs: EntryInput[]): Promise<void> {
  if (inputs.length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase.from("entries").insert(inputs.map(entryToRow));
  if (error) throw new Error(error.message);
}

export async function updateEntry(id: string, input: EntryInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("entries").update(entryToRow(input)).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEntry(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
