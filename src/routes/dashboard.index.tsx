import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Check, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Topbar } from "@/components/dash/Topbar";
import { StatCard } from "@/components/dash/StatCard";
import { StatusBadge } from "@/components/dash/StatusBadge";
import { useReports } from "@/store/reports";

export const Route = createFileRoute("/dashboard/")({
  component: UserDashboard,
});

function UserDashboard() {
  const reports = useReports((s) => s.reports);
  const mine = reports.slice(0, 5);
  const counts = {
    total: reports.length,
    approved: reports.filter((r) => r.status === "approved").length,
    pending: reports.filter((r) => r.status === "pending" || r.status === "processing").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
  };
  return (
    <>
      <Topbar crumbs={["Dashboard"]} user="Aiko" />
      <main className="px-6 py-10 md:px-12 md:py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-[12px] uppercase tracking-[0.2em] font-semibold text-[#6d68f1] mb-2">
              Welcome back
            </div>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-slate-900 mb-3">Your newsroom</h1>
            <p className="text-slate-500 text-[15px] max-w-md leading-relaxed">
              Manage your editorial workflow, track article credibility, and publish breaking stories from your central hub.
            </p>
          </div>
          <Link
            to="/dashboard/submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6d68f1] text-white px-6 h-12 text-sm font-medium hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#6d68f1]/20"
          >
            Submit a new report <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total reports" value={counts.total} icon={FileText} delta="Lifetime" />
          <StatCard label="Approved" value={counts.approved} icon={Check} delta="+1 this week" />
          <StatCard label="In review" value={counts.pending} icon={Clock} delta="Median 3.2h" />
          <StatCard label="Rejected" value={counts.rejected} icon={AlertTriangle} delta="Low rate" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="rounded-[1.5rem] border border-slate-100 bg-white shadow-sm shadow-[#6d68f1]/5 overflow-hidden h-full">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                <h2 className="font-serif text-2xl text-slate-900">Recent activity</h2>
                <Link to="/dashboard/reports" className="text-sm font-medium text-[#6d68f1] hover:opacity-80 transition-opacity">
                  View all →
                </Link>
              </div>
              <ul className="divide-y divide-dashed divide-slate-200">
                {mine.map((r) => (
                  <li key={r.id} className="px-8 py-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate text-base">{r.headline}</div>
                      <div className="mt-1.5 text-sm text-slate-400 flex items-center gap-2">
                        <span className="font-medium text-slate-500">{r.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{new Date(r.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        {r.ai && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-emerald-500 font-medium">Credibility {r.ai.credibility}%</span>
                          </>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            </section>
          </div>
          
          <div className="lg:col-span-1 flex flex-col gap-6 sticky top-8 self-start">
            <div className="rounded-[1.5rem] bg-[#6d68f1] p-8 text-white shadow-md shadow-[#6d68f1]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>
              <h3 className="font-serif text-2xl mb-3 relative z-10">Writer's Hub</h3>
              <p className="text-white/80 text-[13px] mb-8 relative z-10 leading-relaxed">
                Get access to premium editorial tools, priority review queues, and direct collaboration with senior editors.
              </p>
              <button className="bg-white text-[#6d68f1] px-6 py-3 rounded-xl text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm relative z-10 w-full">
                Explore benefits
              </button>
            </div>
            
            <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm shadow-[#6d68f1]/5">
              <h3 className="font-serif text-lg mb-5 text-slate-900">Platform Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-medium text-slate-600">Editorial Review</div>
                  <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Optimal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-medium text-slate-600">Publishing Pipeline</div>
                  <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
