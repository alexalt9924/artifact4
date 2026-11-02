import type { Template } from "@/types/resume";

interface ResumeHeaderProps {
  header: Template["header"];
}

// Jake's resume style: large small-caps name, one small contact line separated by "|".
export function ResumeHeader({ header }: ResumeHeaderProps) {
  const contact = [header.phone, header.email, ...header.links].filter(Boolean);
  return (
    <header className="text-center">
      <h1 className="text-[2.3em] leading-tight font-bold [font-variant:small-caps]">{header.name}</h1>
      {contact.length > 0 && <p className="mt-[0.1em] text-[0.9em]">{contact.join("  |  ")}</p>}
    </header>
  );
}
