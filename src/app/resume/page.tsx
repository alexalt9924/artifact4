import { ResumeWorkspace } from "@/components/resume/ResumeWorkspace";
import { listEntries } from "@/lib/db/entries";
import { getTemplate } from "@/lib/db/template";
import { emptySections } from "@/lib/layout/resumeOps";
import type { Resume } from "@/types/resume";

export const metadata = { title: "Resume · Resume Builder" };

export default async function ResumeRoute() {
  const [entries, template] = await Promise.all([listEntries(), getTemplate()]);
  // Saved only if the user has no resumes yet, so first-time users land on an empty page to drag into.
  const seedResumes: Resume[] = [
    {
      id: crypto.randomUUID(),
      userId: template.userId,
      name: "My resume",
      sections: emptySections(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return <ResumeWorkspace entries={entries} template={template} seedResumes={seedResumes} />;
}
