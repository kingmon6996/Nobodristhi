import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, Newspaper, Layout } from "lucide-react";
import { useState, useEffect } from "react";
import { Topbar } from "@/components/dash/Topbar";
import { useTemplates, type NewsTemplate } from "@/store/templates";

import template1Html from "@/templates/template1.html?raw";
import template2Html from "@/templates/template2.html?raw";
import template3Html from "@/templates/template3.html?raw";
import template4Html from "@/templates/template4.html?raw";
import template5Html from "@/templates/template5.html?raw";

const TEMPLATE_HTML: Record<string, string> = {
  template1: template1Html,
  template2: template2Html,
  template3: template3Html,
  template4: template4Html,
  template5: template5Html,
};

export const Route = createFileRoute("/admin/templates")({
  component: AdminTemplates,
});

function AdminTemplates() {
  const templates = useTemplates((s) => s.templates);
  const activeId = useTemplates((s) => s.activeTemplateId);
  const setActive = useTemplates((s) => s.setActiveTemplate);
  const loadActiveTemplate = useTemplates((s) => s.loadActiveTemplate);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    loadActiveTemplate();
  }, [loadActiveTemplate]);

  const previewHtml = previewId ? TEMPLATE_HTML[previewId] : null;

  return (
    <>
      <Topbar crumbs={["Newsroom", "Templates"]} user="Editor" />
      <main className="px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Page design
            </div>
            <h1 className="font-serif text-4xl tracking-tight">Templates</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Select the newspaper frame used to display published news.
              The active template determines how stories appear on the public newspaper page.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layout className="h-4 w-4" />
            <span>
              Active:{" "}
              <span className="text-foreground font-medium">
                {templates.find((t) => t.id === activeId)?.name}
              </span>
            </span>
          </div>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              isActive={t.id === activeId}
              onSelect={() => setActive(t.id)}
              onPreview={() => setPreviewId(t.id)}
              htmlContent={TEMPLATE_HTML[t.id]}
            />
          ))}
        </div>
      </main>

      {/* Full-screen preview overlay */}
      {previewId && previewHtml && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          {/* Preview header */}
          <div className="flex items-center justify-between px-6 h-14 bg-neutral-950 border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <Eye className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-neutral-200 font-medium">
                Preview: {templates.find((t) => t.id === previewId)?.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full border border-neutral-700 text-neutral-400">
                {templates.find((t) => t.id === previewId)?.style}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {previewId !== activeId && (
                <button
                  onClick={() => {
                    setActive(previewId);
                    setPreviewId(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-md bg-white text-neutral-900 px-4 h-9 text-sm hover:bg-neutral-200 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" /> Use this template
                </button>
              )}
              <button
                onClick={() => setPreviewId(null)}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-700 text-neutral-300 px-4 h-9 text-sm hover:bg-neutral-800 cursor-pointer"
              >
                Close preview
              </button>
            </div>
          </div>
          {/* iframe preview */}
          <div className="flex-1 overflow-hidden">
            <iframe
              srcDoc={previewHtml}
              title="Template preview"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </>
  );
}

function TemplateCard({
  template: t,
  isActive,
  onSelect,
  onPreview,
  htmlContent,
}: {
  template: NewsTemplate;
  isActive: boolean;
  onSelect: () => void;
  onPreview: () => void;
  htmlContent: string;
}) {
  return (
    <div
      className={`rounded-lg border-2 bg-card overflow-hidden transition-all ${
        isActive
          ? "border-foreground shadow-lg"
          : "border-border hover:border-foreground/30"
      }`}
    >
      {/* Mini preview via iframe */}
      <div
        className="relative w-full bg-white overflow-hidden cursor-pointer group"
        style={{ height: 220 }}
        onClick={onPreview}
      >
        <iframe
          srcDoc={htmlContent}
          title={t.name}
          className="w-[1440px] h-[900px] border-0 pointer-events-none select-none"
          style={{
            transform: "scale(0.18)",
            transformOrigin: "top left",
          }}
          tabIndex={-1}
          sandbox=""
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 bg-white text-neutral-900 px-4 h-9 rounded-md text-sm shadow-lg">
            <Eye className="h-4 w-4" /> Preview full page
          </div>
        </div>
        {/* Active badge */}
        {isActive && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-foreground text-background px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.14em] font-bold shadow">
            <Check className="h-3 w-3" /> Active
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-medium text-sm">{t.name}</h3>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.style}
            </span>
          </div>
          <div
            className="h-4 w-4 rounded-full border-2 border-border shrink-0 mt-0.5"
            style={{ backgroundColor: t.previewColor }}
          />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {t.description}
        </p>
        <div className="flex items-center gap-2">
          {isActive ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Newspaper className="h-3.5 w-3.5" /> Currently active
            </div>
          ) : (
            <button
              onClick={onSelect}
              className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 h-9 text-sm hover:opacity-90 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" /> Use template
            </button>
          )}
          <button
            onClick={onPreview}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 h-9 text-sm hover:bg-accent cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>
      </div>
    </div>
  );
}
