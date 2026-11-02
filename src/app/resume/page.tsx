import { ResumeWorkspace } from "@/components/resume/ResumeWorkspace";
import { mockEntries, mockResumes, mockTemplate } from "@/mocks/entries";

export const metadata = { title: "Resume · Resume Builder" };

// TODO: replace mocks with the logged-in user's entries and template once Person A's library is merged.
export default function ResumeRoute() {
  return <ResumeWorkspace entries={mockEntries} template={mockTemplate} seedResumes={mockResumes} />;
}
