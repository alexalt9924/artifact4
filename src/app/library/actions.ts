"use server";

import { revalidatePath } from "next/cache";
import { createEntry, deleteEntry, updateEntry } from "@/lib/db/entries";
import type { EntryInput } from "@/lib/db/mappers";
import type { EntryType } from "@/types/resume";

const TYPES: EntryType[] = ["project", "experience", "education", "skills"];

function parse(formData: FormData): EntryInput {
  const type = String(formData.get("type"));
  const title = String(formData.get("title") ?? "").trim();
  if (!TYPES.includes(type as EntryType)) throw new Error("Invalid entry type");
  if (!title) throw new Error("Title is required");
  return {
    type: type as EntryType,
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim() || undefined,
    location: String(formData.get("location") ?? "").trim() || undefined,
    startDate: String(formData.get("startDate") ?? "").trim() || undefined,
    endDate: String(formData.get("endDate") ?? "").trim() || undefined,
    bullets: String(formData.get("bullets") ?? "")
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean),
  };
}

export async function saveEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const input = parse(formData);
  if (id) await updateEntry(id, input);
  else await createEntry(input);
  revalidatePath("/library");
}

export async function removeEntry(formData: FormData) {
  await deleteEntry(String(formData.get("id")));
  revalidatePath("/library");
}
