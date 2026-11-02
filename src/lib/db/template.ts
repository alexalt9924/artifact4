import { createClient } from "./server";
import { templateFromRow, type TemplateRow } from "./mappers";
import type { Template } from "@/types/resume";

export const DEFAULT_TEMPLATE: Omit<Template, "userId"> = {
  header: { name: "", links: [] },
  sectionOrder: ["education", "experience", "project", "skills"],
  style: { fontFamily: "Times New Roman", fontSizePt: 11, marginIn: 0.5 },
  pageSize: "letter",
};

export async function getTemplate(): Promise<Template> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("templates").select("*").maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return templateFromRow(data as TemplateRow);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { userId: user?.id ?? "", ...DEFAULT_TEMPLATE };
}

export async function saveTemplate(t: Omit<Template, "userId">): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { error } = await supabase.from("templates").upsert({
    user_id: user.id,
    header: t.header,
    section_order: t.sectionOrder,
    style: t.style,
    page_size: t.pageSize,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
