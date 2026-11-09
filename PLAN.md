Every teammate and every agent works from this file. If the plan changes, update this file and add an entry to LOG.md.

1. What we're building

A web app where a user logs in, sets up their resume once as a template, keeps a library of projects, work experience, and other entries, and builds multiple tailored resumes by dragging entries from the library into the resume. The resume always stays the same page size, so formatting never breaks.

One-line pitch: Write your experience once, drag it into a tailored resume for every job, with formatting that never breaks.

2. Who it's for
User: CS students who want to format professional resumes
How we reach them: Discord
What they told us they need: Help with their resumes
3. Main screen (from our sketch)
+------------------+-----------------------------------+
|  LIBRARY         |            RESUME                 |
|                  |   (fixed page: 8.5" x 11")        |
|  Project 2       |                                   |
|   * bullet 1     |   Project 1                       |
|   * bullet 2     |    * bullet 1                     |
|                  |    * bullet 2                     |
|  [+ New entry]   |                                   |
|                  |   [page-full indicator]           |
+------------------+-----------------------------------+
Left panel: the user's library of entries. Drag one onto the resume to add it.
Right panel: the resume, rendered at a fixed page size. Drag entries to reorder, or drag back out to remove.
Top bar: resume switcher ("SWE Internship", "Data Analyst"), new resume, export PDF, log out.
4. Features
MVP (must have by handoff)
Log in / sign up (email + password, or Google).
Template setup: user enters header info (name, contact, links) and picks section order (Education, Experience, Projects, Skills) plus style settings (font, font size, margins). Page size is chosen once (US Letter by default).
Library: create, edit, and delete entries. Each entry has a type (project, experience, education, skill group), title, subtitle, dates, and bullets.
Multiple resumes: create, rename, duplicate, and delete resumes. Each resume uses the template and picks entries from the library.
Drag and drop: library → resume, reorder within a section, resume → library to remove.
Fixed page size: the resume never grows past one page. If content overflows, show a clear warning and highlight what doesn't fit (we do not auto-shrink fonts silently).
Export to PDF at the exact page size shown on screen.
Stretch (only if MVP is done)
Import an existing resume (PDF/DOCX): use AI to split it into library entries so the user doesn't retype everything.
Per-resume bullet selection: hide specific bullets of an entry on one resume without changing the library entry.
Job description matcher: paste a job posting, AI suggests which entries to include.
Multi-page resumes as an opt-in setting.
Out of scope
Reproducing the exact visual design of an uploaded resume file. "Template" means our layout + the user's chosen settings.
Sharing resumes between users, payments, mobile app.
5. Key decisions
Topic	Decision
Edits to a library entry	Update every resume that uses it (resumes store references, not copies).
Page size	Rendered at a fixed size (US Letter = 816 × 1056 px at 96 DPI, minus margins). Overflow is measured, not guessed.
Overflow behavior	Allow the drop, show a red "over one page" warning, and highlight the overflowing entries. Export is still allowed but warns.
Template vs. resume	One template per user (header + style + section order). Each resume inherits it.
6. Tech stack
Layer	Choice	Why
Framework	Next.js (App Router) + TypeScript	One repo for UI and API, easy to deploy
Auth + database	Supabase (Postgres + Auth)	Login and storage without writing a backend from scratch
Drag and drop	dnd-kit	Supports lists, sorting, and dragging between containers
Styling	Tailwind CSS	Fast, consistent
PDF export	Browser print with @page CSS sized to the page	Output matches the on-screen page exactly
Hosting	Vercel	Free tier, deploys from GitHub
7. Data model (shared contract — do not change without both teammates agreeing)

Lives in src/types/resume.ts. Database tables mirror it.

ts
type EntryType = "project" | "experience" | "education" | "skills";

interface Entry {
  id: string;
  userId: string;
  type: EntryType;
  title: string;        // "Resume Builder" or "Software Intern"
  subtitle?: string;    // "Acme Corp" or "Next.js, Supabase"
  location?: string;
  startDate?: string;   // "2025-06"
  endDate?: string;     // "2025-09" or "Present"
  bullets: string[];
  updatedAt: string;
}

interface Template {
  userId: string;
  header: { name: string; email?: string; phone?: string; links: string[] };
  sectionOrder: EntryType[];
  style: { fontFamily: string; fontSizePt: number; marginIn: number };
  pageSize: "letter" | "a4";
}

interface Resume {
  id: string;
  userId: string;
  name: string;                               // "SWE Internship"
  sections: Record<EntryType, string[]>;      // ordered Entry ids per section
  updatedAt: string;
}
8. Ownership
Area	Owner	Folders
Auth, database, library (create/edit/delete entries), template setup	Person A: Alex Douk	src/app/(auth)/, src/app/library/, src/app/template/, src/lib/db/
Resume page, drag and drop, fixed-page rendering, overflow check, PDF export	Person B: Alexander James Perry	src/app/resume/, src/components/resume/, src/lib/layout/
Shared types, this plan, LOG.md, CLAUDE.md	Both (changes by PR, reviewed by the other)	src/types/, root .md files

Until Person A's library is merged, Person B uses mock entries from src/mocks/entries.ts that match the data model.

9. How we keep from colliding
main is always working. Nobody commits directly to main.
One branch per feature: a/library-crud, b/drag-drop, etc.
Every change goes through a pull request. The other teammate reviews and merges.
Keep PRs small (one feature or fix).
Pull main before starting each work session.
Changes to src/types/ or this plan need a heads-up message before the PR.
Every merged PR gets a line in LOG.md.
10. Schedule
Day	Goal
Mon	Talk to user, finalize this plan, set up repo, Supabase, types, mocks
Tue	A: login + library CRUD · B: resume page with fixed page size using mocks
Wed	A: template setup · B: drag and drop (library → resume, reorder, remove)
Thu	Connect real data to resume page; overflow warning; show user a rough version
Fri	PDF export; fixes from user feedback
Sat	Polish, test end to end, deploy
Sun	Hand it to the user, finish log, fill in portfolio cards, submit
11. Definition of done
The user can sign up, set up a template, add entries, build two different resumes by dragging, and export both as PDFs that match the screen.
The user has seen and used it.
LOG.md records what we planned and what changed.
