import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, CheckCircle2, XCircle, AlertTriangle, Users, Zap } from "lucide-react";
import { Topbar } from "@/components/dash/Topbar";
import { StatCard } from "@/components/dash/StatCard";
import { useReports } from "@/store/reports";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const reports = useReports((s) => s.reports);
  const pending = reports.filter((r) => r.status === "pending").length;
  const approved = reports.filter((r) => r.status === "approved").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;
  const flagged = reports.filter((r) => (r.ai?.misinformation ?? 0) > 50).length;

  const categories = ["Politics", "World", "Technology", "Business", "Science", "Local"];
  const catCounts = categories.map((c) => ({
    c, n: reports.filter((r) => r.category === c).length,
  }));
  const max = Math.max(1, ...catCounts.map((x) => x.n));

  return (
    <>
      <Topbar crumbs={["Newsroom", "Overview"]} user="Editor" />
      <main className="px-8 py-8 max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Editorial control
            </div>
            <h1 className="font-serif text-4xl tracking-tight">Newsroom overview</h1>
          </div>
          <Link
            to="/admin/incoming"
            className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 h-10 text-sm hover:opacity-90"
          >
            Review queue
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          <StatCard label="Pending" value={pending} icon={Inbox} />
          <StatCard label="Approved today" value={approved} icon={CheckCircle2} />
          <StatCard label="Rejected today" value={rejected} icon={XCircle} />
          <StatCard label="AI flagged" value={flagged} icon={AlertTriangle} />
          <StatCard label="Journalists" value={42} icon={Users} />
          <StatCard label="Breaking" value={3} icon={Zap} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="rounded-lg border border-border bg-card lg:col-span-2">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-serif text-lg">Real-time activity</h2>
            </div>
            <ul className="divide-y divide-border max-h-[420px] overflow-y-auto">
              {reports.slice(0, 12).map((r) => (
                <li key={r.id} className="px-6 py-4 flex items-center gap-4 hover:bg-accent/30">
                  <div className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center text-xs">
                    {r.author.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">
                      <span className="font-medium">{r.author}</span>{" "}
                      <span className="text-muted-foreground">filed</span>{" "}
                      <span>{r.headline}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {r.category} · {new Date(r.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <Link
                    to="/admin/incoming/$id"
                    params={{ id: r.id }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Review →
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-border bg-card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-serif text-lg">Category mix</h2>
            </div>
            <div className="px-6 py-5 space-y-3">
              {catCounts.map(({ c, n }) => (
                <div key={c}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{c}</span>
                    <span className="text-muted-foreground tabular-nums">{n}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all"
                      style={{ width: `${(n / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
