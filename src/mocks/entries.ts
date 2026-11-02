// Mock data that matches src/types/resume.ts.
// Used until Person A's library and template setup are wired to Supabase.
// There is intentionally more content here than fits on one page, so overflow can be tested.

import type { Entry, Resume, Template } from "@/types/resume";

export const MOCK_USER_ID = "mock-user";

const updatedAt = "2026-11-01T00:00:00.000Z";

export const mockEntries: Entry[] = [
  {
    id: "edu-uw",
    userId: MOCK_USER_ID,
    type: "education",
    title: "University of Washington",
    subtitle: "B.S. Computer Science, GPA 3.7",
    location: "Seattle, WA",
    startDate: "2023-09",
    endDate: "2027-06",
    bullets: [
      "Coursework: Data Structures, Algorithms, Databases, Systems Programming, Machine Learning",
    ],
    updatedAt,
  },
  {
    id: "exp-acme",
    userId: MOCK_USER_ID,
    type: "experience",
    title: "Software Engineering Intern",
    subtitle: "Acme Corp",
    location: "Seattle, WA",
    startDate: "2025-06",
    endDate: "2025-09",
    bullets: [
      "Built an internal dashboard in React and TypeScript used by 40+ support agents daily",
      "Cut API response time by 35% by adding Redis caching to the slowest endpoints",
      "Wrote integration tests that raised coverage of the billing service from 52% to 81%",
    ],
    updatedAt,
  },
  {
    id: "exp-ta",
    userId: MOCK_USER_ID,
    type: "experience",
    title: "Teaching Assistant, Intro to Programming",
    subtitle: "University of Washington",
    location: "Seattle, WA",
    startDate: "2024-09",
    endDate: "Present",
    bullets: [
      "Lead two weekly sections of 25 students covering Java fundamentals",
      "Hold office hours and grade weekly programming assignments with detailed feedback",
    ],
    updatedAt,
  },
  {
    id: "exp-cafe",
    userId: MOCK_USER_ID,
    type: "experience",
    title: "Barista",
    subtitle: "Campus Coffee",
    location: "Seattle, WA",
    startDate: "2023-10",
    endDate: "2024-06",
    bullets: [
      "Trained four new hires on opening and closing procedures",
      "Handled cash and card transactions during peak hours with zero register discrepancies",
    ],
    updatedAt,
  },
  {
    id: "proj-resume",
    userId: MOCK_USER_ID,
    type: "project",
    title: "Resume Builder",
    subtitle: "Next.js, TypeScript, Supabase, dnd-kit",
    startDate: "2026-11",
    endDate: "Present",
    bullets: [
      "Drag-and-drop resume editor that keeps every resume at a fixed page size",
      "Detects overflow by measuring rendered layout and highlights entries that don't fit",
      "Exports PDFs that match the on-screen page exactly using print CSS",
    ],
    updatedAt,
  },
  {
    id: "proj-transit",
    userId: MOCK_USER_ID,
    type: "project",
    title: "Transit Delay Predictor",
    subtitle: "Python, pandas, scikit-learn",
    startDate: "2025-01",
    endDate: "2025-03",
    bullets: [
      "Trained a gradient-boosted model on 2M King County Metro arrivals to predict delays",
      "Served predictions through a Flask API and a small map-based web front end",
    ],
    updatedAt,
  },
  {
    id: "proj-chat",
    userId: MOCK_USER_ID,
    type: "project",
    title: "Realtime Study Chat",
    subtitle: "Node.js, WebSockets, PostgreSQL",
    startDate: "2024-04",
    endDate: "2024-06",
    bullets: [
      "Chat app for study groups with rooms, presence indicators, and message history",
      "Load-tested to 500 concurrent connections on a single small VM",
      "Added rate limiting and input sanitization after a classmate's red-team review",
    ],
    updatedAt,
  },
  {
    id: "proj-garden",
    userId: MOCK_USER_ID,
    type: "project",
    title: "Smart Garden Monitor",
    subtitle: "Raspberry Pi, C, MQTT",
    startDate: "2024-01",
    endDate: "2024-03",
    bullets: [
      "Soil moisture and light sensors publishing readings over MQTT every 30 seconds",
      "Phone notifications when plants need water, cutting manual checks to zero",
    ],
    updatedAt,
  },
  {
    id: "skills-lang",
    userId: MOCK_USER_ID,
    type: "skills",
    title: "Languages",
    bullets: ["TypeScript", "JavaScript", "Python", "Java", "C", "SQL"],
    updatedAt,
  },
  {
    id: "skills-tools",
    userId: MOCK_USER_ID,
    type: "skills",
    title: "Frameworks & Tools",
    bullets: ["React", "Next.js", "Node.js", "PostgreSQL", "Redis", "Git", "Docker", "Tailwind CSS"],
    updatedAt,
  },
];

export const mockTemplate: Template = {
  userId: MOCK_USER_ID,
  header: {
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    phone: "(206) 555-0142",
    links: ["github.com/jordanlee", "linkedin.com/in/jordanlee"],
  },
  sectionOrder: ["education", "experience", "project", "skills"],
  style: { fontFamily: "Georgia, 'Times New Roman', serif", fontSizePt: 10.5, marginIn: 0.5 },
  pageSize: "letter",
};

export const mockResumes: Resume[] = [
  {
    id: "resume-swe",
    userId: MOCK_USER_ID,
    name: "SWE Internship",
    sections: {
      education: ["edu-uw"],
      experience: ["exp-acme", "exp-ta"],
      project: ["proj-resume", "proj-transit"],
      skills: ["skills-lang", "skills-tools"],
    },
    updatedAt,
  },
];
