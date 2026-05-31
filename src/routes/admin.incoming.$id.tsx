import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Check, X, RotateCcw, Zap, ShieldQuestion, Calendar, MapPin, Mic, Image as ImageIcon, ChevronLeft, ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/components/dash/StatusBadge";
import { Topbar } from "@/components/dash/Topbar";
import { useQuery } from "@tanstack/react-query";
import { getBackendUrl } from "@/lib/utils";

export const Route = createFileRoute("/admin/incoming/$id")({
  component: ReportReview,
});

function ReportReview() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  const { data: reports = [] } = useQuery({
    queryKey: ['processed_reports'],
    queryFn: async () => {
      const res = await fetch(getBackendUrl('/processed/'));
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data || [];
    }
  });

  const report = reports.find((r: any) => r.processed_id === id);

  if (!report) {
    return <div className="p-10 text-muted-foreground">Report not found.</div>;
  }

  const act = async (status: "approved" | "rejected", label: string) => {
    try {
      const finalImage = report.img_url && report.img_url.length > 0 ? report.img_url[selectedImageIndex] : null;
      
      let url = getBackendUrl(`/admin/${status === "approved" ? "approve" : "reject"}`);
      
      const payload: any = {
        processed_id: report.processed_id
      };
      
      if (status === "approved" && report.img_url && report.img_url.length > 0) {
        payload.img_index = selectedImageIndex;
      }

      console.log("🚀 Calling Backend URL:", url);
      console.log("📦 With Payload:", payload);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = errorText;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.message) errorMessage = parsed.message;
        } catch (e) {
          // Keep raw text if not JSON
        }
        console.error(`Backend Error (${res.status}):\n${errorMessage}`);
        return;
      }

      setSuccess(label);
      setTimeout(() => {
        setSuccess(null);
        navigate({ to: "/admin/incoming" });
      }, 1400);
    } catch (error) {
      console.error("Network error: Failed to reach the server.", error);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* RAW */}
      <section className="border-r border-border overflow-y-auto p-8">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          Raw submission
        </div>
        <h2 className="font-serif text-3xl tracking-tight leading-tight mb-4">{report.summary}</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6">
          <StatusBadge status="approved" />
          <span>{report.reporter_id}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(report.created_at).toLocaleString()}</span>
          {report.location && (
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{Array.isArray(report.location) ? report.location.join(', ') : report.location}</span>
          )}
        </div>
        <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {report.description}
        </p>

        {report.img_url && report.img_url.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2 flex items-center gap-1">
              <ImageIcon className="h-3 w-3" /> Attached images
            </div>
            <div className="grid grid-cols-3 gap-2">
              {report.img_url
                .map((src: string, originalIndex: number) => ({ src, originalIndex }))
                .filter((item: any) => item.src && item.src.trim() !== "")
                .map((item: any, i: number) => {
                  const { src, originalIndex } = item;
                  // Ensure relative URLs point to the backend
                  const imageUrl = src.startsWith("http") ? src : getBackendUrl(src.startsWith("/") ? src : `/${src}`);
                  
                  return (
                    <div 
                      key={originalIndex} 
                      className={`relative aspect-square ${report.img_url.length > 1 ? 'cursor-pointer' : ''}`}
                      onClick={() => report.img_url.length > 1 && setSelectedImageIndex(originalIndex)}
                    >
                      <img 
                        src={imageUrl} 
                        className={`w-full h-full object-cover rounded-md border ${
                          report.img_url.length > 1 && selectedImageIndex === originalIndex 
                            ? 'border-[3px] border-[#6d68f1]' 
                            : 'border-border'
                        }`} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x400/png?text=Image+Not+Found";
                        }}
                      />
                  {report.img_url.length > 1 && (
                    <div className="absolute top-2 left-2 bg-white/90 rounded-full p-1 shadow-sm flex items-center justify-center pointer-events-none">
                      <input 
                        type="radio" 
                        name={`image_select_${report.processed_id}`} 
                        checked={selectedImageIndex === originalIndex}
                        readOnly
                        className="w-4 h-4 text-[#6d68f1] focus:ring-[#6d68f1]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        )}

        {report.source && (
          <div className="mt-6 text-xs">
            <span className="text-muted-foreground">Source: </span>
            <a href={report.source} className="underline">{report.source}</a>
          </div>
        )}
      </section>

      {/* AI */}
      <section className="overflow-y-auto p-8 bg-surface/30">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          AI structured article
        </div>
        <h2 className="font-serif text-2xl tracking-tight leading-tight mb-4">{report.breaking}</h2>

        <div className="rounded-lg border border-border bg-card p-5 mb-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Summary</div>
          <p className="text-sm leading-relaxed">{report.summary}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 mb-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Detailed Description</div>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{report.description}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => act("approved", "Approved & published")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background h-11 text-sm hover:opacity-90"
          >
            <Check className="h-4 w-4" /> Approve & publish
          </button>
          <button
            onClick={() => act("rejected", "Rejected")}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border h-11 text-sm hover:bg-accent"
          >
            <X className="h-4 w-4" /> Reject
          </button>
        </div>
      </section>

      {success && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-sm grid place-items-center z-50">
          <div className="rounded-xl border border-border bg-card p-10 text-center shadow-xl">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto mb-4">
              <Check className="h-7 w-7" />
            </div>
            <div className="font-serif text-2xl">{success}</div>
            <div className="text-sm text-muted-foreground mt-1">Returning to queue…</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Score({ label, value, good }: { label: string; value: number; good?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-serif text-2xl mt-1">{value}%</div>
      <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full ${good ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
        {items.map((t) => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface/60">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
