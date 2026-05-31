import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/dash/Topbar";
import { useReports, type ReportStatus } from "@/store/reports";
import { Search, SlidersHorizontal, ChevronDown, MoreVertical, Calendar, ShieldCheck, BarChart2, LayoutGrid, CheckCircle2, Clock, XCircle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const FILTERS: { id: ReportStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "processing", label: "Processing" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const trendData = [
  { name: 'May 1', uv: 60 },
  { name: 'May 5', uv: 72 },
  { name: 'May 10', uv: 65 },
  { name: 'May 15', uv: 75 },
  { name: 'May 20', uv: 68 },
  { name: 'May 25', uv: 85 },
  { name: 'May 30', uv: 91 },
];

export const Route = createFileRoute("/dashboard/reports")({
  component: MyReports,
});

function StatusBadge({ status }: { status: ReportStatus }) {
  const getStyles = () => {
    switch (status) {
      case 'approved': return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
      case 'pending': return { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' };
      case 'processing': return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
      case 'rejected': return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-500' };
    }
  };
  const s = getStyles();
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg} ${s.text} text-[10px] font-bold uppercase tracking-widest`}>
      <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></div>
      {status}
    </div>
  );
}

function MyReports() {
  const reports = useReports((s) => s.reports);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");
  const list = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <>
      <Topbar crumbs={["Dashboard", "My Reports"]} user="Aiko" />
      <main className="p-6 md:p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 xl:gap-12">
          
          {/* Left Column: Main List */}
          <div className="space-y-6 min-w-0">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
              <div>
                <div className="text-[10px] font-bold text-[#5235ff] uppercase tracking-widest mb-1.5">Workspace</div>
                <h1 className="font-serif text-[32px] leading-tight font-bold text-slate-900 mb-1">My reports</h1>
                <p className="text-slate-500 text-[14px]">Track and manage all your submitted reports.</p>
              </div>
              <button className="bg-[#5235ff] text-white px-5 py-2.5 rounded-xl font-semibold text-[13px] hover:bg-[#4325e6] transition-colors shrink-0">
                + Submit New Report
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 lg:gap-8 border-b border-slate-200 overflow-x-auto pb-0">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`pb-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                    filter === f.id
                      ? "border-[#5235ff] text-[#5235ff]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search & Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search reports..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#5235ff] focus:ring-1 focus:ring-[#5235ff] shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[13px] font-bold hover:bg-slate-50 shadow-sm transition-colors">
                  <SlidersHorizontal className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[13px] font-bold hover:bg-slate-50 shadow-sm transition-colors">
                  Sort: Newest <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {list.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-stretch shadow-sm hover:shadow-md transition-shadow gap-6">
                  
                  {/* Left content */}
                  <div className="flex-1 sm:border-r sm:border-slate-100 sm:pr-6 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <StatusBadge status={r.status} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.category}</span>
                    </div>
                    <h3 className="text-[17px] font-bold text-slate-900 mb-1.5 truncate">{r.headline}</h3>
                    <p className="text-[14px] text-slate-500 line-clamp-1 mb-4">{r.ai?.summary || r.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> 
                        Credibility {r.ai?.credibility || 0}%
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" /> 
                        Risk {r.ai?.risk || 'low'}
                      </div>
                    </div>
                  </div>

                  {/* Right content (AI Score) */}
                  <div className="sm:w-32 shrink-0 flex sm:flex-col items-center sm:justify-center justify-between relative sm:pl-2">
                    <button className="absolute top-0 right-0 text-slate-400 hover:text-slate-600 sm:block hidden">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Score</div>
                      <div className="text-[36px] leading-none font-bold text-slate-900">{r.ai?.credibility || '-'}</div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 sm:hidden block">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              ))}
              
              {list.length === 0 && (
                <div className="text-center py-20 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-2xl">
                  No reports in this view.
                </div>
              )}

              {list.length > 0 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 border border-slate-200">←</button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#5235ff] text-white font-bold text-[13px]">1</button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold text-[13px]">2</button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold text-[13px]">3</button>
                  <span className="text-slate-400 px-1">...</span>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold text-[13px]">12</button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 border border-slate-200">→</button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar Widgets */}
          <div className="hidden lg:block space-y-6">

            {/* AI Score Trend */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[15px] text-slate-900">AI Score Trend</h3>
                <button className="flex items-center gap-2 text-[11px] font-bold text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50">
                  This Month <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              
              <div className="h-[280px] w-full mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#5235ff', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="uv" stroke="#5235ff" strokeWidth={3} dot={{ r: 4, fill: "#5235ff", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#5235ff", stroke: "#fff", strokeWidth: 2 }} isAnimationActive={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2">
                <span>May 1</span>
                <span>May 10</span>
                <span>May 20</span>
                <span>May 30</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[15px] text-slate-900">Recent Activity</h3>
                <button className="text-[12px] font-bold text-[#5235ff] hover:underline">
                  View all
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="text-[13px] font-bold text-slate-900">Report approved</div>
                      <div className="text-[11px] text-slate-400 whitespace-nowrap">2 min ago</div>
                    </div>
                    <div className="text-[12px] text-slate-500 truncate">BREAKING: Major development...</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="text-[13px] font-bold text-slate-900">Report submitted</div>
                      <div className="text-[11px] text-slate-400 whitespace-nowrap">15 min ago</div>
                    </div>
                    <div className="text-[12px] text-slate-500 truncate">New AI tools transforming...</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#5235ff]/5 border border-[#5235ff]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#5235ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="text-[13px] font-bold text-slate-900">Report processing</div>
                      <div className="text-[11px] text-slate-400 whitespace-nowrap">32 min ago</div>
                    </div>
                    <div className="text-[12px] text-slate-500 truncate">Championship finals deliver...</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="text-[13px] font-bold text-slate-900">Report approved</div>
                      <div className="text-[11px] text-slate-400 whitespace-nowrap">1 hr ago</div>
                    </div>
                    <div className="text-[12px] text-slate-500 truncate">Economic policy reforms announced</div>
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

