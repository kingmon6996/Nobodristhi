import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, User, Bell, Shield, Mail } from "lucide-react";
import { Topbar } from "@/components/dash/Topbar";
import { useUser } from "@civic/auth/react";

export const Route = createFileRoute("/dashboard/settings")({
  component: ContributorSettings,
});

function ContributorSettings() {
  const navigate = useNavigate();
  const { signOut } = useUser();
  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("nbd.session");
      sessionStorage.clear();
    } catch {}
    navigate({ to: "/" });
  };

  return (
    <>
      <Topbar crumbs={["Contributor", "Settings"]} user="You" />
      <main className="p-6 md:p-12 max-w-5xl mx-auto w-full">
        <div className="mb-10 text-center">
          <div className="text-[10px] font-bold text-[#5235ff] uppercase tracking-widest mb-2">
            Account
          </div>
          <h1 className="font-serif text-[36px] leading-tight font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500 text-[14px]">Manage your account preferences and configurations.</p>
        </div>

        <div className="space-y-4">
          <SettingCard icon={User} title="Profile" desc="Your public byline and avatar shown beside published reports." />
          <SettingCard icon={Mail} title="Notifications" desc="Editorial replies, approval and revision alerts." />
          <SettingCard icon={Bell} title="Push alerts" desc="Breaking news from sections you follow." />
          <SettingCard icon={Shield} title="Privacy & security" desc="Two-factor auth, session devices, data exports." />

          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white border border-red-100 flex items-center justify-center">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-[15px]">Sign out</div>
                <div className="text-[13px] text-slate-500 mt-0.5">
                  End your contributor session on this device.
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white px-5 h-11 text-[13px] font-bold hover:bg-red-700 transition-colors w-full sm:w-auto shrink-0"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </section>
        </div>
      </main>
    </>
  );
}

function SettingCard({ icon: Icon, title, desc }: { icon: typeof User; title: string; desc: string }) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 flex items-center justify-between hover:bg-accent/20 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-md bg-surface border border-border grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        </div>
      </div>
      <button className="text-xs text-muted-foreground hover:text-foreground">Manage →</button>
    </section>
  );
}
