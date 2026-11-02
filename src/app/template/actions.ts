"use server";

import { redirect } from "next/navigation";
import { saveTemplate } from "@/lib/db/template";
import type { EntryType, Template } from "@/types/resume";

const TYPES: EntryType[] = ["project", "experience", "education", "skills"];

const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim() || undefined;

export async function updateTemplate(formData: FormData) {
  // Section order comes from four position selects; fall back to the default if they repeat a section.
  const picked = [0, 1, 2, 3].map((i) => String(formData.get(`order${i}`)) as EntryType);
  const valid = new Set(picked).size === 4 && picked.every((t) => TYPES.includes(t));
  const pageSize = formData.get("pageSize") === "a4" ? "a4" : "letter";

  const template: Omit<Template, "userId"> = {
    header: {
      name: String(formData.get("name") ?? "").trim(),
      email: text(formData, "email"),
      phone: text(formData, "phone"),
      links: String(formData.get("links") ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    },
    sectionOrder: valid ? picked : ["education", "experience", "project", "skills"],
    style: {
      fontFamily: String(formData.get("fontFamily") ?? "Times New Roman"),
      fontSizePt: Math.min(14, Math.max(8, Number(formData.get("fontSizePt")) || 11)),
      marginIn: Math.min(1.5, Math.max(0.25, Number(formData.get("marginIn")) || 0.75)),
    },
    pageSize,
  };
  await saveTemplate(template);
  redirect("/library");
}
