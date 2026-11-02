This is a two-person team project. Each teammate uses their own AI agent, and the agents do not talk to each other. This file and PLAN.md are how you stay in sync with the other agent. Follow them.

Before every task
Read PLAN.md, especially Data model, Ownership, and How we keep from colliding.
Skim the latest entries in LOG.md to see what changed recently.
Ask which teammate you are working for if it isn't clear. Stay inside that person's folders (see Ownership in PLAN.md).
Project summary

A Next.js + TypeScript web app where users log in, set up a resume template, keep a library of entries (projects, experience, education, skills), and drag entries into multiple resumes. The resume is always a fixed page size (US Letter by default) and must never silently grow or shrink.

Rules
Shared contract
src/types/resume.ts is the shared data model. Do not change it without the user explicitly saying both teammates agreed. If a change seems needed, stop and propose it, then note it in LOG.md.
Resumes store entry ids, never copies of entries.
Git
Never commit to main. Work on a feature branch named a/... or b/... per PLAN.md.
Keep commits small and messages clear (Add drag from library to resume).
Do not merge pull requests. The other teammate reviews and merges.
Never force-push.
Files
Only edit files in the current owner's folders. Shared files (src/types/, root .md files, config) need the user's explicit go-ahead.
Until the real library exists, use mock data from src/mocks/entries.ts. Do not invent a different data shape.
Fixed page size
Render the resume at an exact page size (Letter: 8.5in × 11in). Use the template's margins and font settings.
Detect overflow by measuring rendered height, not by counting lines.
On overflow: show a warning and highlight the entries that don't fit. Never auto-shrink fonts, margins, or spacing without the user asking.
PDF export must match the on-screen page (use @page { size: letter; margin: 0 } and print styles).
Security
Secrets go in .env.local only. Never commit keys or put them in client code beyond the public Supabase anon key.
Every database query is scoped to the logged-in user. Use Supabase row-level security.
Code style
TypeScript strict mode. No any without a comment explaining why.
Tailwind for styling. Components in src/components/, one component per file.
Use dnd-kit for all drag and drop.
After every task

Add a line to LOG.md:

YYYY-MM-DD — [Person A/B] — what changed — any decision or open question

If anything you did differs from PLAN.md, say so in the log and tell the user so they can update the plan.

Commands
bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
