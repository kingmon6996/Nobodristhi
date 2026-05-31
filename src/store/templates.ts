import { create } from "zustand";

export interface NewsTemplate {
  id: string;
  name: string;
  description: string;
  style: string;
  previewColor: string;   // accent color for the card border/badge
}

export const TEMPLATES: NewsTemplate[] = [
  {
    id: "template1",
    name: "The Daily Broadsheet",
    description:
      "Classic NYT-style front page with a 6-column grid, serif masthead, drop-caps, and vertical column rules. Best for general-purpose daily editions.",
    style: "Classic Broadsheet",
    previewColor: "#a6392e",
  },
  {
    id: "template2",
    name: "Special Investigation",
    description:
      "Long-form investigative layout with a dramatic hero image, 3-column body, pull quotes, and a key findings callout box. Ideal for in-depth reports.",
    style: "Magazine Investigation",
    previewColor: "#a6392e",
  },
  {
    id: "template3",
    name: "Obituaries & Public Records",
    description:
      "Dense, formal layout for obituaries, vital statistics, in memoriam notices, and public legal notices. Uses a 4-column grid with portrait images.",
    style: "Records & Notices",
    previewColor: "#a6392e",
  },
  {
    id: "template4",
    name: "Local & Metro",
    description:
      "City-focused page with a massive lead headline, CSS multi-column body text, secondary story grid, and a dense neighbourhood briefs sidebar.",
    style: "Metro / Local News",
    previewColor: "#a6392e",
  },
  {
    id: "template5",
    name: "Science & Health",
    description:
      "5-column layout with a scientific briefs sidebar, hero figure with caption, a medical journal sidebar, and formal byline block. Best for STEM coverage.",
    style: "Science Journal",
    previewColor: "#a6392e",
  },
];

interface TemplateState {
  templates: NewsTemplate[];
  activeTemplateId: string;
  setActiveTemplate: (id: string) => void;
  loadActiveTemplate: () => Promise<void>;
}

export const useTemplates = create<TemplateState>((set) => ({
  templates: TEMPLATES,
  activeTemplateId: "template1",
  loadActiveTemplate: async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/template/get`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.template_number) {
          set({ activeTemplateId: `template${json.template_number}` });
        }
      }
    } catch (err) {
      console.error("Failed to load active template", err);
    }
  },
  setActiveTemplate: async (id) => {
    set({ activeTemplateId: id });
    const match = id.match(/\d+/);
    if (match) {
      const template_number = parseInt(match[0], 10);
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/template/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ template_number }),
        });
      } catch (err) {
        console.error("Failed to save template", err);
      }
    }
  },
}));
