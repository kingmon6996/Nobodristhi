import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, Inbox, Sparkles, CheckCircle2, XCircle, Newspaper,
  FileText, BarChart3, Activity, Users, Settings,
} from "lucide-react";
import { Sidebar } from "@/components/dash/Sidebar";
import { Topbar } from "@/components/dash/Topbar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Newsroom Admin — NoboDorshi" }] }),
  component: AdminLayout,
  notFoundComponent: () => (
    <>
      <Topbar crumbs={["Admin", "Not Found"]} />
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500">The admin page you are looking for does not exist.</p>
      </div>
    </>
  ),
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-foreground flex">
      <Sidebar
        brand="NoboDorshi"
        badge="Newsroom CMS"
        items={[
          { to: "/admin", label: "Overview", icon: LayoutDashboard },
          { to: "/admin/incoming", label: "Incoming Reports", icon: Inbox },
          { to: "/admin/builder", label: "Newspaper Builder", icon: Newspaper },
          { to: "/admin/templates", label: "Templates", icon: FileText },
          { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
          { to: "/admin/users", label: "Users", icon: Users },
          { to: "/admin/settings", label: "Settings", icon: Settings },
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
