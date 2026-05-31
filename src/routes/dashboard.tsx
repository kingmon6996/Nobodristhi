import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, FileEdit, FileText, Bookmark, Bell, Settings } from "lucide-react";
import { Sidebar } from "@/components/dash/Sidebar";
import { Topbar } from "@/components/dash/Topbar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NoboDorshi" }] }),
  component: DashboardLayout,
  notFoundComponent: () => (
    <>
      <Topbar crumbs={["Dashboard", "Not Found"]} />
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500">The dashboard page you are looking for does not exist.</p>
      </div>
    </>
  ),
});

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-foreground flex">
      <Sidebar
        brand="NoboDorshi"
        items={[
          { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { to: "/dashboard/submit", label: "Submit News", icon: FileEdit },
          { to: "/dashboard/reports", label: "My Reports", icon: FileText },
          { to: "/dashboard/settings", label: "Settings", icon: Settings },
        ]}
      />
      <div className="flex-1 min-w-0 pl-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-hover:pl-64">
        <div className="m-4 md:m-6 bg-white min-h-[calc(100vh-3rem)] rounded-[2.5rem] shadow-sm overflow-hidden relative border border-border/40">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
