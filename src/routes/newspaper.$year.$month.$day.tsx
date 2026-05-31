import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download, Printer,
  BookOpen, X, Home, Search, Move,
} from "lucide-react";
import { useReports, type Report } from "@/store/reports";
import { SECTION_FILLERS, type FillerStory } from "@/lib/section-fillers";
import { getBackendUrl } from "@/lib/utils";

export const Route = createFileRoute("/newspaper/$year/$month/$day")({
  head: ({ params }) => ({
    meta: [
      { title: `Nobodosrshi · Edition ${params.year}.${params.month}.${params.day}` },
      { name: "description", content: "Digital newspaper archive viewer with sections, reading mode, and print." },
    ],
  }),
  component: NewspaperViewer,
});

const SECTIONS = ["World", "Politics", "Business", "Technology", "Science", "Culture", "Opinion"] as const;
type Section = (typeof SECTIONS)[number];

const CATEGORY_TO_SECTION: Record<string, Section> = {
  World: "World", Politics: "Politics", Business: "Business",
  Technology: "Technology", AI: "Technology", Science: "Science",
  Local: "World", Emergency: "World",
};

type SelectedStory =
  | { kind: "report"; report: Report; section: string }
  | { kind: "filler"; story: FillerStory; section: string }
  | null;

import { useQuery } from "@tanstack/react-query";
import { useTemplates } from "@/store/templates";
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

function NewspaperViewer() {
  const { year, month, day } = Route.useParams();
  const [zoom, setZoom] = useState(1);
  const [reading, setReading] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [showIndex, setShowIndex] = useState(false);
  const [selected, setSelected] = useState<SelectedStory>(null);
  
  const loadActiveTemplate = useTemplates((s) => s.loadActiveTemplate);
  const activeTemplateId = useTemplates((s) => s.activeTemplateId);
  useEffect(() => {
    loadActiveTemplate();
  }, [loadActiveTemplate]);
  
  const { data: reports = [] } = useQuery<Report[]>({
    queryKey: ['daily_news', year, month, day],
    queryFn: async () => {
      const res = await fetch(getBackendUrl('/admin/list-daily'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp: `${year}-${month}-${day}` }),
      });
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map((r: any) => ({
        id: r.complete_id || r.raw_id,
        headline: r.breaking && r.breaking !== "none" ? r.breaking : r.summary || "News Update",
        description: r.description || "No description provided.",
        category: "World", 
        location: r.location ? (Array.isArray(r.location) ? r.location.join(", ") : r.location) : undefined,
        source: r.source,
        images: r.img_url ? [r.img_url] : [],
        audioUrl: r.voice_url,
        status: "approved",
        createdAt: new Date(r.created_at).getTime(),
        author: r.reporter_id || "Staff Writer",
        breaking: !!r.breaking && r.breaking !== "none",
        ai: {
          rewritten: r.description || "",
          summary: r.summary || "",
        }
      }));
    }
  });

  const paperRef = useRef<HTMLDivElement>(null);

  const dateStr = new Date(`${year}-${month}-${day}`).toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).toUpperCase();

  const pages = useMemo(() => {
    const front = { kind: "front" as const, label: "Front Page", section: "Front" };
    return [front];
  }, []);

  const totalPages = pages.length;
  const page = pages[pageIdx];

  const lead = reports[0];
  const secondaries = reports.slice(1, 4);
  const briefs = reports.slice(4, 10);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") setPageIdx((p) => Math.min(totalPages - 1, p + 1));
      if (e.key === "ArrowLeft") setPageIdx((p) => Math.max(0, p - 1));
      if (e.key === "Escape") { setShowIndex(false); setSelected(null); }
    };
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'open_report' && e.data.id) {
        const r = reports.find(rep => String(rep.id) === String(e.data.id));
        if (r) {
          setSelected({ kind: "report", report: r, section: "Front Page" });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMessage);
    };
  }, [totalPages, reports]);

  const openReport = (r: Report, section: string) => setSelected({ kind: "report", report: r, section });
  const openFiller = (s: FillerStory, section: string) => setSelected({ kind: "filler", story: s, section });

  const prevPage = pages[pageIdx - 1];
  const nextPage = pages[pageIdx + 1];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 print:bg-white print:text-black">
      {/* Top dark bar — NYT TimesMachine style */}
      <div className="sticky top-0 z-40 bg-neutral-950 border-b border-neutral-800 print:hidden">
        <div className="px-6 h-14 flex items-center justify-center">
          <div className="font-serif text-2xl tracking-tight text-white">
            NoboDorshi
          </div>
        </div>
        {/* Secondary toolbar: date / PAGE x OF y */}
        <div className="px-6 h-10 flex items-center justify-between border-t border-neutral-800/60 relative">
          <div className="flex-1" />
          <div className="absolute left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.22em] text-neutral-200">
            <span className="text-neutral-400">{dateStr.split(",")[0]},</span>{" "}
            <span className="underline underline-offset-4 decoration-neutral-500">{dateStr.split(",").slice(1).join(",").trim()}</span>
          </div>
          <div className="flex-1 flex justify-end items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-300">
            <button
              onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
              disabled={pageIdx === 0}
              className="h-7 w-7 grid place-items-center hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>Page</span>
            <span className="bg-white text-neutral-900 px-2 h-6 inline-flex items-center tabular-nums">
              {pageIdx + 1}
            </span>
            <span className="text-neutral-500">of {totalPages}</span>
            <button
              onClick={() => setPageIdx((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageIdx === totalPages - 1}
              className="h-7 w-7 grid place-items-center hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating right-side zoom toolbar */}
      <div className="fixed right-6 top-32 z-30 flex flex-col bg-neutral-950/90 border border-neutral-800 rounded-md backdrop-blur print:hidden">
        <ToolBtn icon={Move} label="Pan" />
        <Divider />
        <ToolBtn icon={ZoomIn} label="Zoom in" onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(2)))} />
        <ToolBtn icon={ZoomOut} label="Zoom out" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} />
        <ToolBtn
          icon={Maximize2}
          label="Fullscreen"
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen?.();
            else document.documentElement.requestFullscreen?.();
          }}
        />
        <Divider />
        <ToolBtn icon={BookOpen} label="Reading mode" active={reading} onClick={() => setReading((r) => !r)} />
        <ToolBtn icon={Download} label="Download PDF" onClick={() => window.print()} />
        <ToolBtn icon={Printer} label="Print" onClick={() => window.print()} />
      </div>

      {/* Paper canvas — horizontally scrollable, current page centered with neighbors */}
      <div className="relative py-12 overflow-x-auto print:p-0">
        <div className="flex items-start justify-center gap-8 px-[12vw] min-w-max">
          {prevPage && (
            <PaperPreview
              label={prevPage.label}
              onClick={() => setPageIdx(pageIdx - 1)}
            />
          )}

          <div
            ref={paperRef}
            className={activeTemplateId === 'template1' ? "bg-[#fdfcf7] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] origin-top transition-transform print:shadow-none" : "bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] origin-top transition-transform print:shadow-none"}
            style={{
              width: activeTemplateId === 'template1' ? (reading ? "min(720px, 90vw)" : "min(1100px, 92vw)") : "1440px",
              height: activeTemplateId === 'template1' ? "auto" : "2000px",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            {activeTemplateId === 'template1' ? (
            <div className="px-12 pt-10 pb-12 text-[#1a1a1a] bg-[#f4f4f2]" style={{ fontFamily: '"Libre Baskerville", serif' }}>
              <header className="text-center mb-8">
                <div className="flex justify-between items-end border-b border-[#1a1a1a] py-1 text-[10px] font-bold uppercase tracking-widest">
                  <div className="text-left w-1/3">VOL. MMXXVI .... No. {Number(day)}</div>
                  <div className="w-1/3 text-center">{dateStr}</div>
                  <div className="text-right w-1/3 italic">Late City Edition</div>
                </div>
                <div className="py-6 border-b-4 border-[#1a1a1a]">
                  <h1 className="text-[80px] md:text-[140px] leading-none tracking-tight" style={{ fontFamily: '"Chomsky", "Playfair Display", serif' }}>
                    NoboDorshi
                  </h1>
                </div>
                <div className="flex justify-between border-b-2 border-[#1a1a1a] py-1 text-[10px] font-bold uppercase">
                  <div>"All the News That's Fit to Print"</div>
                  <div className="flex gap-4">
                    <span>Weather: High 78, Low 62. Details, Page C10.</span>
                  </div>
                  <div>$2.00</div>
                </div>
              </header>

              {reading && lead ? (
                <div className="pt-8">
                  <ReadingMode report={lead} />
                </div>
              ) : (
                <FrontPage
                  lead={lead}
                  secondaries={secondaries}
                  briefs={briefs}
                  onPick={(r) => openReport(r, "Front Page")}
                />
              )}

              <footer className="mt-12 pt-4 border-t-2 border-[#1a1a1a] text-center text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/70">
                <div className="flex justify-between items-center mb-2">
                  <span>Page {pageIdx + 1} of {totalPages}</span>
                  <span>{page.label}</span>
                  <span>nobodorshi.com</span>
                </div>
                <p>© 2026 THE NOBODORSHI PUBLISHING COMPANY • ALL RIGHTS RESERVED • HIGH-DENSITY EDITORIAL EXCELLENCE</p>
              </footer>
            </div>
            ) : (
              <iframe
                srcDoc={injectDataIntoHTML(TEMPLATE_HTML[activeTemplateId] || "", reports)}
                title="Newspaper Template"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            )}
          </div>

          {nextPage && (
            <PaperPreview
              label={nextPage.label}
              onClick={() => setPageIdx(pageIdx + 1)}
            />
          )}
        </div>
      </div>



      {/* SUBJECTS drawer (left) — opens when a story is clicked */}
      {selected && (
        <Drawer side="left" onClose={() => setSelected(null)} title="Subjects" backLabel="Pages">
          {selected.kind === "report" ? (
            <ReportDetail report={selected.report} section={selected.section} />
          ) : (
            <FillerDetail story={selected.story} section={selected.section} />
          )}
        </Drawer>
      )}
    </div>
  );
}

// ---------- Chrome ----------

function PaperPreview({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden lg:block w-[200px] h-[640px] shrink-0 bg-[#fdfcf7]/70 hover:bg-[#fdfcf7] shadow-xl border border-neutral-700 overflow-hidden text-neutral-900 transition"
      title={`Go to ${label}`}
    >
      <div className="p-3 font-serif">
        <div className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 text-center">NoboDorshi</div>
        <div className="text-center text-[10px] uppercase tracking-[0.25em] text-neutral-700 border-b border-neutral-400 pb-1 mt-1">
          {label}
        </div>
        <div className="mt-3 space-y-1.5">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="h-1 bg-neutral-300/80 rounded-sm" style={{ width: `${60 + ((i * 37) % 40)}%` }} />
          ))}
        </div>
      </div>
    </button>
  );
}

function Drawer({
  side, onClose, title, subtitle, backLabel, children,
}: {
  side: "left" | "right";
  onClose: () => void;
  title: string;
  subtitle?: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 print:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={`absolute top-0 ${side === "left" ? "left-0" : "right-0"} h-full w-full max-w-md bg-neutral-950 text-neutral-100 border-${side === "left" ? "r" : "l"} border-neutral-800 p-6 overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            {backLabel && (
              <button onClick={onClose} className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-white">
                ‹ {backLabel}
              </button>
            )}
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-1">{subtitle ?? "Edition"}</div>
            <div className="font-serif text-2xl text-white">{title}</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded hover:bg-neutral-800">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ToolBtn({
  icon: Icon, label, onClick, active,
}: { icon: typeof ZoomIn; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`h-10 w-10 grid place-items-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition ${
        active ? "bg-neutral-800 text-white" : ""
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <div className="h-px w-full bg-neutral-800" />;
}

// ---------- Detail panels ----------

function ReportDetail({ report, section }: { report: Report; section: string }) {
  const [authorName, setAuthorName] = useState<string | null>(null);

  useEffect(() => {
    if (!report.author) return;
    // Assuming report.author might be the member ID
    fetch(getBackendUrl('/member/data'), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: report.author })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.name) {
          setAuthorName(data.data.name);
        }
      })
      .catch(console.error);
  }, [report.author]);

  const bylineAuthor = authorName || report.author;

  const handleDownload = async () => {
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(`report-detail-${report.id}`);
    const opt = {
      margin:       10,
      filename:     `Nobodorshi-${report.headline.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, backgroundColor: '#0a0a0a' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <article id={`report-detail-${report.id}`} className="space-y-5 bg-neutral-950 text-neutral-100 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">{section}</div>
          <h3 className="font-serif text-2xl text-white mt-1 leading-tight">{report.headline}</h3>
          <div className="text-[11px] text-neutral-500 italic mt-2">
            By {bylineAuthor}
            {report.location && (
              <span>
                {" · "}
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.location)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="underline hover:text-white"
                >
                  {report.location}
                </a>
              </span>
            )}
          </div>
        </div>

        {report.audioUrl && (
          <div className="mt-4 bg-neutral-900 p-2 rounded-md border border-neutral-800">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">volume_up</span> Audio Report
            </div>
            <audio controls className="w-full h-8" style={{ filter: 'invert(0.9) hue-rotate(180deg)' }}>
              <source src={getBackendUrl(report.audioUrl)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {report.ai?.summary && (
          <div className="border-l-2 border-white pl-3 text-sm text-neutral-200 italic">
            {report.ai.summary}
          </div>
        )}

        <p className="text-[13.5px] leading-relaxed text-neutral-300">
          {report.ai?.rewritten ?? report.description}
        </p>

        {report.ai?.tags && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {report.ai.tags.map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-[0.18em] text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>

      <div className="pt-2 border-t border-neutral-800">
        <button 
          onClick={handleDownload} 
          className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 transition border border-neutral-700 rounded px-4 py-3 w-full"
        >
          <Download className="w-4 h-4" />
          Download Section PDF
        </button>
      </div>
    </div>
  );
}

function FillerDetail({ story, section }: { story: FillerStory; section: string }) {
  const handleDownload = async () => {
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(`filler-detail-${story.id}`);
    const opt = {
      margin:       10,
      filename:     `Nobodorshi-${story.headline.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, backgroundColor: '#0a0a0a' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <article id={`filler-detail-${story.id}`} className="space-y-4 bg-neutral-950 text-neutral-100 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">{section} · {story.tag ?? story.kind}</div>
          <h3 className="font-serif text-2xl text-white mt-1 leading-tight">{story.headline}</h3>
          {story.dek && <div className="text-sm text-neutral-300 italic mt-2">{story.dek}</div>}
          <div className="text-[11px] text-neutral-500 italic mt-2">
            By {story.author}{story.location ? ` · ${story.location}` : ""}
          </div>
        </div>
        {story.body && <p className="text-[13.5px] leading-relaxed text-neutral-300">{story.body}</p>}
        <div className="border border-neutral-800 rounded p-4 space-y-2 text-[12px] mt-4">
          <Row k="Section" v={section} />
          <Row k="Story type" v={story.kind} />
          <Row k="Filed" v="Today" />
        </div>
      </article>

      <div className="pt-2 border-t border-neutral-800">
        <button 
          onClick={handleDownload} 
          className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 transition border border-neutral-700 rounded px-4 py-3 w-full"
        >
          <Download className="w-4 h-4" />
          Download Section PDF
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{k}</span>
      <span className="capitalize text-neutral-100">{v}</span>
    </div>
  );
}

function injectDataIntoHTML(html: string, reports: Report[]) {
  if (!reports || reports.length === 0 || !html) return html;
  
  // Replace titles globally
  let processedHtml = html.replace(/ZAIRA/g, 'Nobodorshi')
                          .replace(/Zaira/g, 'Nobodorshi')
                          .replace(/The Chronicle/gi, 'Nobodorshi');
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedHtml, "text/html");
    const updatedElements = new Set<Element>();
    
    const h1s = Array.from(doc.querySelectorAll("h1"));
    const h2s = Array.from(doc.querySelectorAll("h2"));
    const h3s = Array.from(doc.querySelectorAll("h3"));
    
    if (h1s[0] && reports[0]) {
      h1s[0].textContent = reports[0].headline;
      updatedElements.add(h1s[0]);
      
      let nextElement = h1s[0].nextElementSibling;
      while (nextElement && nextElement.tagName.toLowerCase() !== 'p') {
        nextElement = nextElement.nextElementSibling;
      }
      if (nextElement) {
        nextElement.textContent = reports[0].ai?.summary || reports[0].description.slice(0, 200) + "...";
        updatedElements.add(nextElement);
      }
      
      if (reports[0].images?.[0]) {
        const imgs = Array.from(doc.querySelectorAll('img'));
        const firstImg = imgs.find(img => !img.alt.toLowerCase().includes('author'));
        if (firstImg) firstImg.src = reports[0].images[0];
      }
      
      const parent = h1s[0].closest('article') || h1s[0].parentElement || h1s[0];
      parent.setAttribute('data-report-id', String(reports[0].id));
      parent.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
    } else if (h1s[0]) {
      const parent = h1s[0].closest('article') || h1s[0].parentElement;
      if (parent) parent.remove();
    }
    
    const secondaries = reports.slice(1, 1 + h2s.length);
    h2s.forEach((h2, index) => {
      if (secondaries[index]) {
        h2.textContent = secondaries[index].headline;
        updatedElements.add(h2);
        let nextP = h2.nextElementSibling;
        if (nextP && nextP.tagName.toLowerCase() === 'p') {
          nextP.textContent = secondaries[index].ai?.summary || secondaries[index].description.slice(0, 150) + "...";
          updatedElements.add(nextP);
        }
        const parent = h2.closest('article') || h2.parentElement || h2;
        if (parent && secondaries[index].images?.[0]) {
          const img = parent.querySelector('img');
          if (img) img.src = secondaries[index].images[0];
        }
        parent.setAttribute('data-report-id', String(secondaries[index].id));
        parent.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
      } else {
        const parent = h2.closest('article') || h2.parentElement;
        if (parent) parent.remove();
      }
    });

    const briefs = reports.slice(1 + h2s.length, 1 + h2s.length + h3s.length);
    h3s.forEach((h3, index) => {
      if (briefs[index]) {
        h3.textContent = briefs[index].headline;
        updatedElements.add(h3);
        let nextP = h3.nextElementSibling;
        if (nextP && nextP.tagName.toLowerCase() === 'p') {
          nextP.textContent = briefs[index].ai?.summary || briefs[index].description.slice(0, 100) + "...";
          updatedElements.add(nextP);
        }
        const parent = h3.closest('article') || h3.parentElement || h3;
        if (parent && briefs[index].images?.[0]) {
          const img = parent.querySelector('img');
          if (img) img.src = briefs[index].images[0];
        }
        parent.setAttribute('data-report-id', String(briefs[index].id));
        parent.classList.add('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
      } else {
        const parent = h3.closest('article') || h3.parentElement;
        if (parent) parent.remove();
      }
    });

    // Cleanup extra paragraphs that are likely dummy text
    const allParagraphs = doc.querySelectorAll('p');
    allParagraphs.forEach(p => {
      if (!updatedElements.has(p) && p.textContent && p.textContent.length > 80) {
        // Only remove if it's not a short metadata paragraph
        p.remove();
      }
    });

    // Remove grayscale effect from all images to make them natural colors
    const allImages = doc.querySelectorAll('img');
    allImages.forEach(img => {
      img.classList.remove('grayscale');
    });

    const script = doc.createElement('script');
    script.textContent = `
      document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-report-id]');
        if (target) {
          const id = target.getAttribute('data-report-id');
          window.parent.postMessage({ type: 'open_report', id: id }, '*');
        }
      });
    `;
    doc.body.appendChild(script);
    
    return doc.documentElement.outerHTML;
  } catch (e) {
    console.error("Failed to parse and inject template data", e);
    return processedHtml;
  }
}


// ---------- Pages ----------

function FrontPage({
  lead, secondaries, briefs, onPick,
}: {
  lead?: Report; secondaries: Report[]; briefs: Report[];
  onPick: (r: Report) => void;
}) {
  if (!lead) return <Empty label="No stories in this edition." />;
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.cdnfonts.com/css/chomsky');
        .font-headline { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Libre Baskerville', serif; }
        .justified { text-align: justify; text-justify: inter-word; }
        .broadsheet-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; }
        .rule-vertical { border-right: 1px solid #1a1a1a; padding-right: 10px; margin-right: -10px; }
        .rule-top { border-top: 1px solid #1a1a1a; }
        .rule-bottom { border-bottom: 1px solid #1a1a1a; }
        .double-rule-bottom { border-bottom: 3px double #1a1a1a; }
        .dropcap::first-letter { float: left; font-size: 3.5rem; line-height: 0.8; margin: 0.1em 0.1em 0.1em 0; font-family: 'Playfair Display', serif; font-weight: 900; }
        @media (max-width: 1024px) { .broadsheet-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px) { .broadsheet-grid { grid-template-columns: 1fr; } .rule-vertical { border-right: none; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px; } }
      `}} />

      <div className="font-body mt-6">
        <div className="broadsheet-grid">
          {/* Column 1 & 2: Lead Story */}
          <div className="col-span-1 md:col-span-3 lg:col-span-4 rule-vertical">
            <article className="mb-8 cursor-pointer hover:opacity-80 transition" onClick={() => onPick(lead)}>
              <h2 className="font-headline text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tighter">
                {lead.headline}
              </h2>
              {lead.images?.[0] && (
                <div className="aspect-video mb-4 overflow-hidden border border-[#1a1a1a]">
                  <img alt={lead.headline} className="w-full h-full object-cover" src={lead.images[0]} />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-bold text-sm mb-2 uppercase">By {lead.author}</p>
                  <p className="justified dropcap leading-relaxed text-sm">
                    {lead.ai?.rewritten ?? lead.description}
                  </p>
                </div>
                <div className="justified text-sm leading-relaxed">
                  <p className="mb-4">
                    {lead.ai?.summary ?? lead.description.slice(0, 300)}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#1a1a1a] italic text-xs">
                    Continued on Page A14
                  </div>
                </div>
              </div>
            </article>

            {secondaries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rule-top pt-6">
                {secondaries.slice(0, 2).map((s, i) => (
                  <article key={s.id} className={`cursor-pointer hover:opacity-80 transition ${i === 0 ? "rule-vertical pr-6" : ""}`} onClick={() => onPick(s)}>
                    {s.images?.[0] && (
                      <div className="aspect-video mb-3 overflow-hidden border border-[#1a1a1a]">
                        <img alt={s.headline} className="w-full h-full object-cover" src={s.images[0]} />
                      </div>
                    )}
                    <h3 className="font-headline text-2xl font-bold leading-tight mb-2">{s.headline}</h3>
                    <p className="justified text-xs leading-relaxed">{s.ai?.summary ?? s.description.slice(0, 150) + "..."}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Secondary Headlines */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2 flex flex-col gap-6">
            {secondaries.slice(2, 5).map((s) => (
              <article key={s.id} className="rule-bottom pb-6 cursor-pointer hover:opacity-80 transition" onClick={() => onPick(s)}>
                <div className={`mb-2 uppercase text-[10px] font-bold tracking-widest ${s.breaking ? "text-red-600 border-red-600" : "text-[#a6392e] border-[#a6392e]"} border-b inline-block`}>
                  {s.breaking ? "BREAKING" : s.category}
                </div>
                <p className="justified text-[13px] font-bold leading-relaxed">{s.ai?.summary ?? s.headline}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Full Width Separator */}
        <div className="my-8 py-2 border-y-2 border-[#1a1a1a] bg-white/50 text-center font-bold italic text-sm">
          Inside Today’s Edition: Arts & Leisure (Page B1), The Business Times (Page D1), Weekend Reviews (Page E1)
        </div>

        {/* Lower Grid Sections */}
        <div className="broadsheet-grid">
          <div className="col-span-1 md:col-span-1 rule-vertical border-[#1a1a1a]">
            <div className="border-b-4 border-[#1a1a1a] mb-4 pb-1">
              <h4 className="font-headline font-black text-lg uppercase">The Briefing</h4>
            </div>
            <div className="flex flex-col gap-6">
              {briefs.slice(0, 3).map((b, i) => (
                <div key={b.id} className="rule-bottom pb-4 cursor-pointer hover:opacity-80 transition" onClick={() => onPick(b)}>
                  <span className={`text-[10px] font-black block mb-1 uppercase ${b.breaking ? "text-red-600" : ""}`}>
                    0{8 - i}:45 AM {b.breaking && "- BREAKING"}
                  </span>
                  <p className="text-xs font-bold leading-tight mb-1">{b.ai?.summary ?? b.headline}</p>
                  <p className="text-[10px] italic">{b.author}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-4 rule-vertical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {briefs.slice(3, 5).map((b) => (
                <article key={b.id} className="cursor-pointer hover:opacity-80 transition" onClick={() => onPick(b)}>
                  <div className={`mb-2 uppercase text-[10px] font-bold tracking-widest ${b.breaking ? "text-red-600 border-red-600" : "text-[#1a1a1a] border-[#1a1a1a]"} border-b inline-block`}>
                    {b.breaking ? "BREAKING" : b.category}
                  </div>
                  <p className="justified text-[13px] font-bold leading-relaxed mb-4">{b.ai?.summary ?? b.headline}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-1">
            {briefs.slice(5, 7).map((b) => (
              <article key={b.id} className="mb-6 cursor-pointer hover:opacity-80 transition" onClick={() => onPick(b)}>
                <div className={`mb-2 uppercase text-[10px] font-bold tracking-widest ${b.breaking ? "text-red-600 border-red-600" : "text-[#1a1a1a] border-[#1a1a1a]"} border-b inline-block`}>
                  {b.breaking ? "BREAKING" : b.category}
                </div>
                <p className="justified text-[13px] font-bold leading-relaxed">{b.ai?.summary ?? b.headline}</p>
              </article>
            ))}
            <div className="border-4 border-[#1a1a1a] p-2 mt-8">
              <h4 className="font-headline font-black text-center text-sm uppercase border-b border-[#1a1a1a] mb-2">Index</h4>
              <div className="text-[10px] leading-relaxed">
                <div className="flex justify-between"><span>Arts</span><span>B1</span></div>
                <div className="flex justify-between"><span>Business</span><span>D1</span></div>
                <div className="flex justify-between"><span>Crossword</span><span>C12</span></div>
                <div className="flex justify-between"><span>Editorials</span><span>A22</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionPage({
  section, items, onPickReport, onPickFiller,
}: {
  section: Section; items: Report[];
  onPickReport: (r: Report) => void;
  onPickFiller: (f: FillerStory) => void;
}) {
  const fillers = SECTION_FILLERS[section as keyof typeof SECTION_FILLERS] ?? [];
  const reportLead = items[0];
  const fillerLead = fillers.find((f) => f.kind === "lead");
  const columns = fillers.filter((f) => f.kind === "column");
  const briefs = fillers.filter((f) => f.kind === "brief");
  const analysis = fillers.find((f) => f.kind === "analysis" || f.kind === "opinion");
  const stats = { stories: items.length + fillers.length, columns: columns.length, briefs: briefs.length };

  return (
    <div className="mt-6">
      <div className="flex items-end justify-between border-b-2 border-neutral-900 pb-3 mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">Section</div>
          <h2 className="text-5xl tracking-tight">{section}</h2>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-600">
            {stats.stories} stories · {stats.columns} columns · {stats.briefs} briefs
          </div>
          <div className="text-[10px] italic text-neutral-500 mt-1">Edited by the {section} desk</div>
        </div>
      </div>
      <div className="text-[11px] italic text-neutral-600 mb-6 border-b border-neutral-300 pb-3">
        Click any headline to open the dossier panel with context, credibility and entities.
      </div>

      <div className="grid grid-cols-12 gap-8">
        <article className="col-span-12 md:col-span-7 md:border-r border-neutral-300 md:pr-8">
          {reportLead ? (
            <div onClick={() => onPickReport(reportLead)} className="cursor-pointer group">
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-2">
                Newsroom · {reportLead.category}
              </div>
              <h3 className="text-3xl md:text-4xl leading-[1.1] tracking-tight mb-3 group-hover:underline underline-offset-4 decoration-neutral-400">
                {reportLead.headline}
              </h3>
              <div className="text-[11px] italic text-neutral-600 mb-5">
                By {reportLead.author}{reportLead.location ? `, ${reportLead.location}` : ""}
              </div>
              <p
                className="text-[15px] leading-relaxed columns-1 md:columns-2 gap-8 first-letter:font-serif first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {reportLead.ai?.rewritten ?? reportLead.description}
              </p>
            </div>
          ) : fillerLead ? (
            <div onClick={() => onPickFiller(fillerLead)} className="cursor-pointer">
              <FillerArticle story={fillerLead} dropcap multicolumn />
            </div>
          ) : (
            <Empty label={`No lead story in ${section} today.`} />
          )}

          {columns[0] && (
            <div onClick={() => onPickFiller(columns[0])} className="mt-8 pt-6 border-t border-neutral-300 cursor-pointer hover:opacity-80">
              <FillerArticle story={columns[0]} />
            </div>
          )}
        </article>

        <section className="col-span-12 md:col-span-3 md:border-r border-neutral-300 md:pr-6 space-y-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 border-b border-neutral-900 pb-2">
            Also developing
          </div>
          {columns.slice(1, 3).map((c) => (
            <div key={c.id} onClick={() => onPickFiller(c)} className="cursor-pointer hover:opacity-80">
              <FillerArticle story={c} compact />
            </div>
          ))}
          {items.slice(1, 3).map((r) => (
            <div key={r.id} onClick={() => onPickReport(r)} className="cursor-pointer hover:opacity-80">
              <ReportSnippet report={r} />
            </div>
          ))}
        </section>

        <aside className="col-span-12 md:col-span-2 space-y-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 border-b border-neutral-900 pb-2">
            Section facts
          </div>
          <DetailRow label="Desk" value={section} />
          <DetailRow label="Stories" value={String(stats.stories)} />
          <DetailRow label="Filed today" value={String(items.length)} />
          <DetailRow label="Wires" value={String(stats.briefs)} />
          {reportLead?.ai && (
            <>
              <DetailRow label="Credibility" value={`${reportLead.ai.credibility}%`} />
              <DetailRow label="Urgency" value={reportLead.ai.urgency} />
              <DetailRow label="Sentiment" value={reportLead.ai.sentiment} />
            </>
          )}
          <div className="pt-3 border-t border-neutral-300">
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 mb-2">
              Weather · {section === "World" ? "Global" : "Regional"}
            </div>
            <div className="font-serif text-2xl leading-none">21°</div>
            <div className="text-[11px] text-neutral-600 mt-1">Partly cloudy · winds light</div>
          </div>
        </aside>
      </div>

      {briefs.length > 0 && (
        <section className="border-t-2 border-neutral-900 pt-6 mt-10">
          <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-700 mb-4">In brief · {section}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
            {briefs.map((b) => (
              <div key={b.id} onClick={() => onPickFiller(b)} className="border-l border-neutral-400 pl-4 cursor-pointer hover:opacity-80">
                <h4 className="text-base leading-snug tracking-tight mb-1">{b.headline}</h4>
                <p className="text-[12px] leading-relaxed text-neutral-700" style={{ fontFamily: '"Inter", sans-serif' }}>
                  {b.dek}
                </p>
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-1.5">
                  {b.author}{b.location ? ` · ${b.location}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(items.length > 1 || analysis) && (
        <section className="border-t-2 border-neutral-900 pt-6 mt-10">
          <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-700 mb-4">More from {section}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {analysis && (
              <article
                onClick={() => onPickFiller(analysis)}
                className="md:col-span-2 border-r border-neutral-300 md:pr-8 cursor-pointer hover:opacity-80"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1">
                  {analysis.kind === "opinion" ? "Opinion" : "Analysis"}
                </div>
                <h4 className="text-2xl leading-tight tracking-tight mb-2">{analysis.headline}</h4>
                <div className="text-[11px] italic text-neutral-600 mb-3">
                  By {analysis.author}{analysis.location ? `, ${analysis.location}` : ""}
                </div>
                <p className="text-[13px] leading-relaxed text-neutral-800" style={{ fontFamily: '"Inter", sans-serif' }}>
                  {analysis.body}
                </p>
              </article>
            )}
            <div className="space-y-5">
              {items.slice(1).map((r) => (
                <div key={r.id} onClick={() => onPickReport(r)} className="cursor-pointer hover:opacity-80">
                  <ReportSnippet report={r} />
                </div>
              ))}
              {items.length <= 1 && (
                <div className="text-[11px] italic text-neutral-500">
                  Wire-desk updates roll throughout the day.
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function FillerArticle({
  story, dropcap, multicolumn, compact,
}: { story: FillerStory; dropcap?: boolean; multicolumn?: boolean; compact?: boolean }) {
  return (
    <article>
      {story.tag && (
        <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1.5">{story.tag}</div>
      )}
      <h4 className={`tracking-tight mb-2 ${compact ? "text-lg leading-snug" : "text-2xl md:text-[28px] leading-[1.15] mb-3"}`}>
        {story.headline}
      </h4>
      {!compact && <div className="text-[12px] italic text-neutral-600 mb-3">{story.dek}</div>}
      {story.body && (
        <p
          className={`leading-relaxed text-neutral-800 ${compact ? "text-[12.5px]" : "text-[14px]"} ${
            multicolumn ? "columns-1 md:columns-2 gap-8" : ""
          } ${dropcap ? "first-letter:font-serif first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]" : ""}`}
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {story.body}
        </p>
      )}
      <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-2">
        {story.author}{story.location ? ` · ${story.location}` : ""}
      </div>
    </article>
  );
}

function ReportSnippet({ report }: { report: Report }) {
  return (
    <article className="border-b border-neutral-300 pb-4 last:border-0">
      <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1">
        Newsroom · {report.category}
      </div>
      <h4 className="text-lg leading-snug tracking-tight mb-1.5">{report.headline}</h4>
      <p className="text-[12.5px] leading-relaxed text-neutral-700" style={{ fontFamily: '"Inter", sans-serif' }}>
        {report.ai?.summary ?? report.description.slice(0, 160) + "…"}
      </p>
      <div className="text-[10px] italic text-neutral-600 mt-1.5">— {report.author}</div>
    </article>
  );
}

function ReadingMode({ report }: { report: Report }) {
  return (
    <article className="max-w-prose mx-auto">
      <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-2">{report.category}</div>
      <h2 className="text-4xl leading-tight tracking-tight mb-4">{report.headline}</h2>
      <div className="text-[11px] italic text-neutral-600 mb-6">By {report.author}</div>
      <p className="text-[17px] leading-[1.8]" style={{ fontFamily: '"Inter", sans-serif' }}>
        {report.ai?.rewritten ?? report.description}
      </p>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]" style={{ fontFamily: '"Inter", sans-serif' }}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">{label}</span>
      <span className="capitalize text-neutral-900">{value}</span>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="py-20 text-center text-sm text-neutral-500 italic border border-dashed border-neutral-300 rounded">
      {label}
    </div>
  );
}
