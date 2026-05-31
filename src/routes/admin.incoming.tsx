import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/dash/Topbar";
import { StatusBadge } from "@/components/dash/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { getBackendUrl } from "@/lib/utils";

export const Route = createFileRoute("/admin/incoming")({
  component: IncomingLayout,
});

function IncomingLayout() {
  const { data: reports = [] } = useQuery({
    queryKey: ['processed_reports'],
    queryFn: async () => {
      const res = await fetch(getBackendUrl('/processed'));
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data || [];
    }
  });
  const matchRoute = useMatchRoute();
  const detail = matchRoute({ to: "/admin/incoming/$id" });

  return (
    <>
      <Topbar crumbs={["Newsroom", "Incoming"]} user="Editor" />
      <main className="flex">
        <aside className="w-96 border-r border-border h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="px-6 py-5 border-b border-border">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Review queue
            </div>
            <h1 className="font-serif text-2xl mt-1">{reports.length} reports</h1>
          </div>
          <ul className="divide-y divide-border">
            {reports.map((r: any) => {
              const active = typeof detail === "object" && detail?.id === r.processed_id;
              return (
                <li key={r.processed_id}>
                  <Link
                    to="/admin/incoming/$id"
                    params={{ id: r.processed_id }}
                    className={`block px-6 py-4 hover:bg-accent/40 transition-colors ${
                      active ? "bg-accent/60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <StatusBadge status="approved" />
                    </div>
                    <div className="font-medium text-sm leading-snug line-clamp-2">{r.summary}</div>
                    <div className="mt-1.5 text-xs text-muted-foreground flex items-center gap-2">
                      <span>{r.reporter_id}</span>
                      <span>·</span>
                      <span className="truncate max-w-[150px]">{r.breaking || "General"}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </main>
    </>
  );
}
