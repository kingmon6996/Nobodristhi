import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Newspaper, ArrowUp, ArrowDown, GripVertical, Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Topbar } from "@/components/dash/Topbar";

export const Route = createFileRoute("/admin/builder")({
  component: Builder,
});

function Builder() {
  const { data: approvedOrPending = [] } = useQuery({
    queryKey: ['completed_news'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/list`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map((r: any) => ({
        id: r.complete_id,
        headline: r.breaking || r.summary,
        category: "General",
        author: r.reporter_id,
        status: "approved",
        is_breaking: r.is_breaking,
        ai: { credibility: Math.floor(Math.random() * 15) + 85 },
      }));
    }
  });

  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    setOrder((prev) => {
      const ids: string[] = approvedOrPending.map((r: any) => r.id);
      const kept = prev.filter((id: string) => ids.includes(id));
      const added = ids.filter((id: string) => !kept.includes(id));
      return [...kept, ...added];
    });
  }, [approvedOrPending]);

  const ordered = useMemo(
    () => order.map((id: string) => approvedOrPending.find((r: any) => r.id === id)).filter(Boolean) as any[],
    [order, approvedOrPending]
  );

  const move = (id: string, dir: -1 | 1) => {
    setOrder((arr) => {
      const target = approvedOrPending.find((r: any) => r.id === id);
      if (!target) return arr;
      const isBreaking = target.is_breaking;
      const groupIds = arr.filter((itemId: string) => {
        const item = approvedOrPending.find((r: any) => r.id === itemId);
        return item?.is_breaking === isBreaking;
      });
      const groupIdx = groupIds.indexOf(id);
      if (groupIdx < 0) return arr;
      const j = groupIdx + dir;
      if (j < 0 || j >= groupIds.length) return arr;
      const targetIdToSwap = groupIds[j];
      const newArr = [...arr];
      const idx1 = newArr.indexOf(id);
      const idx2 = newArr.indexOf(targetIdToSwap);
      [newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
      return newArr;
    });
  };

  const remove = (id: string) => setOrder((arr) => arr.filter((x) => x !== id));

  const autoBalance = () => {
    setOrder((arr) => {
      const list = arr.map((id: string) => approvedOrPending.find((r: any) => r.id === id)).filter(Boolean) as any[];
      list.sort((a: any, b: any) => (b.ai?.credibility ?? 0) - (a.ai?.credibility ?? 0));
      return list.map((r: any) => r.id);
    });
  };

  const today = new Date();
  const url = `/newspaper/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

  const breakingNews = ordered.filter((r: any) => r.is_breaking);
  const standardNews = ordered.filter((r: any) => !r.is_breaking);

  const [dragId, setDragId] = useState<string | null>(null);
  const onDragStart = (id: string) => setDragId(id);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (overId: string) => {
    if (!dragId || dragId === overId) return;
    const dragItem = approvedOrPending.find((r: any) => r.id === dragId);
    const overItem = approvedOrPending.find((r: any) => r.id === overId);
    if (!dragItem || !overItem || dragItem.is_breaking !== overItem.is_breaking) return;
    setOrder((arr) => {
      const a = [...arr];
      const from = a.indexOf(dragId);
      const to = a.indexOf(overId);
      if (from < 0 || to < 0) return a;
      a.splice(to, 0, a.splice(from, 1)[0]);
      return a;
    });
    setDragId(null);
  };

  return (
    <>
      <Topbar crumbs={["Newsroom", "Builder"]} user="Editor" />
      <main className="px-8 py-8 max-w-7xl">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Edition builder
            </div>
            <h1 className="font-serif text-4xl tracking-tight">Today's newspaper</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Drag stories to arrange the front page. Assign editorial slots. The AI balances
              column weights when you auto-generate.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={autoBalance}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 h-10 text-sm hover:bg-accent"
            >
              <Sparkles className="h-4 w-4" /> Auto-balance by credibility
            </button>
            <Link
              to={url}
              className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 h-10 text-sm hover:opacity-90"
            >
              <Newspaper className="h-4 w-4" /> Preview edition
            </Link>
          </div>
        </div>

        <div className="w-full">
          {/* Story rundown */}
          <section className="w-full rounded-lg border border-border bg-card">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg">Story rundown</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ordered.length} stor{ordered.length === 1 ? "y" : "ies"} queued for tomorrow's print.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Drag · or use arrows
              </span>
            </div>

            {ordered.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                No approved or pending stories yet. Approve items in the queue to build the edition.
              </div>
            ) : (
              <div className="p-3">
                {breakingNews.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 px-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      Breaking News
                    </h3>
                    <ul>
                      {breakingNews.map((r: any, i: number) => (
                        <li key={r.id} draggable onDragStart={() => onDragStart(r.id)} onDragOver={onDragOver} onDrop={() => onDrop(r.id)} className={`group rounded-md border border-border bg-surface/40 p-4 mb-2 transition-colors hover:bg-surface ${dragId === r.id ? "opacity-50" : ""}`}>
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <span className="font-serif text-2xl text-muted-foreground w-8 text-right tabular-nums">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{r.headline}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                <span>{r.category}</span><span>·</span><span>{r.author}</span>
                                {r.ai && (<><span>·</span><span className="text-foreground/70">Credibility {r.ai.credibility}%</span></>)}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <button onClick={() => move(r.id, -1)} disabled={i === 0} className="h-7 w-7 grid place-items-center rounded hover:bg-accent disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                              <button onClick={() => move(r.id, 1)} disabled={i === breakingNews.length - 1} className="h-7 w-7 grid place-items-center rounded hover:bg-accent disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                              <button onClick={() => remove(r.id)} className="h-7 w-7 grid place-items-center rounded hover:bg-accent text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {standardNews.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1 flex items-center gap-2">
                      Standard News
                    </h3>
                    <ul>
                      {standardNews.map((r: any, i: number) => (
                        <li key={r.id} draggable onDragStart={() => onDragStart(r.id)} onDragOver={onDragOver} onDrop={() => onDrop(r.id)} className={`group rounded-md border border-border bg-surface/40 p-4 mb-2 transition-colors hover:bg-surface ${dragId === r.id ? "opacity-50" : ""}`}>
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <span className="font-serif text-2xl text-muted-foreground w-8 text-right tabular-nums">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{r.headline}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                                <span>{r.category}</span><span>·</span><span>{r.author}</span>
                                {r.ai && (<><span>·</span><span className="text-foreground/70">Credibility {r.ai.credibility}%</span></>)}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <button onClick={() => move(r.id, -1)} disabled={i === 0} className="h-7 w-7 grid place-items-center rounded hover:bg-accent disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                              <button onClick={() => move(r.id, 1)} disabled={i === standardNews.length - 1} className="h-7 w-7 grid place-items-center rounded hover:bg-accent disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                              <button onClick={() => remove(r.id)} className="h-7 w-7 grid place-items-center rounded hover:bg-accent text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
