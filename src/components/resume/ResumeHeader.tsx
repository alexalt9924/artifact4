import type { Template } from "@/types/resume";

interface ResumeHeaderProps {
  header: Template["header"];
}

export function ResumeHeader({ header }: ResumeHeaderProps) {
  const contact = [header.email, header.phone, ...header.links].filter(Boolean);
  return (
    <header className="text-center">
      <h1 className="text-[1.9em] leading-tight font-bold">{header.name}</h1>
      {contact.length > 0 && <p className="mt-[0.15em] text-[0.95em]">{contact.join("  ·  ")}</p>}
    </header>
  );
}
