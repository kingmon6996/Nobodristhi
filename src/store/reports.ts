import { create } from "zustand";

export type ReportStatus = "processing" | "pending" | "approved" | "rejected" | "revision";
export type Category =
  | "Politics"
  | "World"
  | "Technology"
  | "AI"
  | "Science"
  | "Business"
  | "Culture"
  | "Opinion"
  | "Local"
  | "Emergency";

export interface Report {
  id: string;
  headline: string;
  description: string;
  category: Category;
  location?: string;
  source?: string;
  images: string[];
  audioUrl?: string;
  status: ReportStatus;
  createdAt: number;
  author: string;
  // AI generated
  ai?: {
    rewritten: string;
    summary: string;
    tags: string[];
    credibility: number; // 0-100
    sentiment: "positive" | "neutral" | "negative";
    risk: "low" | "medium" | "high";
    misinformation: number;
    entities: { people: string[]; places: string[]; orgs: string[]; dates: string[] };
    duplicates: string[];
    urgency: "routine" | "breaking" | "developing";
  };
  adminNotes?: string;
  breaking?: boolean;
}

const CATEGORIES: Category[] = ["Politics", "World", "Technology", "Science", "Business", "Culture", "Opinion"];

function generateSeedData(): Report[] {
  const reports: Report[] = [];
  let idCounter = 1;

  CATEGORIES.forEach((category) => {
    for (let i = 1; i <= 10; i++) {
      const isBreaking = i === 1; // 1st item of each category is breaking
      const imageIndex = ((idCounter - 1) % 10) + 1; // 1 to 10
      
      reports.push({
        id: `r${idCounter}`,
        headline: `${isBreaking ? "BREAKING: " : ""}Major development in ${category} sector ${i}`,
        description: `This is a comprehensive report on the latest events regarding ${category}. The situation is ${isBreaking ? "developing rapidly" : "being analyzed by experts"}. Several key stakeholders have made statements today, reflecting on the profound implications of these changes. ${category} has always been at the forefront of such shifts.`,
        category: category,
        location: ["Tokyo", "London", "New York", "Berlin", "Paris"][i % 5],
        source: `https://news-${category.toLowerCase()}.com`,
        images: [`/src/images/${imageIndex}.png`],
        status: "approved",
        createdAt: Date.now() - 1000 * 60 * 60 * i,
        author: `Author ${i}`,
        breaking: isBreaking,
        ai: {
          rewritten: `In an unprecedented move within the ${category} landscape, new updates have emerged. Analysts are closely monitoring the impact. The implications are expected to resonate globally, shifting paradigms and challenging existing conventions. Stakeholders are advised to stay tuned as this story unfolds.`,
          summary: `Latest updates and comprehensive analysis on the ${category} situation.`,
          tags: [category.toLowerCase(), isBreaking ? "breaking" : "verified", "newsroom"],
          credibility: 90 + (i % 10),
          sentiment: i % 2 === 0 ? "positive" : "neutral",
          risk: "low",
          misinformation: 1,
          entities: {
            people: [],
            places: ["Global"],
            orgs: [`${category} Org`],
            dates: ["Today"],
          },
          duplicates: [],
          urgency: isBreaking ? "breaking" : "routine",
        },
      });
      idCounter++;
    }
  });

  return reports;
}

const seed: Report[] = generateSeedData();

interface ReportsState {
  reports: Report[];
  addReport: (r: Omit<Report, "id" | "createdAt" | "status">) => string;
  updateStatus: (id: string, status: ReportStatus, notes?: string) => void;
  setBreaking: (id: string, b: boolean) => void;
  attachAI: (id: string, ai: Report["ai"]) => void;
}

export const useReports = create<ReportsState>((set) => ({
  reports: seed,
  addReport: (r) => {
    const id = "r" + Math.random().toString(36).slice(2, 8);
    set((s) => ({
      reports: [
        {
          ...r,
          id,
          createdAt: Date.now(),
          status: "processing",
        },
        ...s.reports,
      ],
    }));
    return id;
  },
  updateStatus: (id, status, notes) =>
    set((s) => ({
      reports: s.reports.map((r) => (r.id === id ? { ...r, status, adminNotes: notes ?? r.adminNotes } : r)),
    })),
  setBreaking: (id, b) =>
    set((s) => ({ reports: s.reports.map((r) => (r.id === id ? { ...r, breaking: b } : r)) })),
  attachAI: (id, ai) =>
    set((s) => ({ reports: s.reports.map((r) => (r.id === id ? { ...r, ai, status: "pending" } : r)) })),
}));

export function mockAIProcess(input: { headline: string; description: string; category: Category }): NonNullable<Report["ai"]> {
  const words = input.description.split(/\s+/).filter(Boolean);
  const credibility = Math.min(98, 60 + Math.floor(words.length / 4));
  return {
    rewritten:
      input.description.trim().replace(/\s+/g, " ").slice(0, 800) +
      (words.length < 40 ? " — Editorial team will expand context shortly." : ""),
    summary: input.description.split(".").slice(0, 2).join(".").trim() + ".",
    tags: [input.category.toLowerCase(), "verified", "newsroom"],
    credibility,
    sentiment: "neutral",
    risk: credibility > 80 ? "low" : credibility > 50 ? "medium" : "high",
    misinformation: Math.max(2, 100 - credibility),
    entities: {
      people: [],
      places: [input.headline.match(/in ([A-Z][a-z]+)/)?.[1] ?? ""].filter(Boolean),
      orgs: [],
      dates: [new Date().toLocaleDateString()],
    },
    duplicates: [],
    urgency: /breaking|urgent|emergency/i.test(input.headline) ? "breaking" : "routine",
  };
}
