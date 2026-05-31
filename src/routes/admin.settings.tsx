import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Shield, Users, Sliders, KeyRound, Activity } from "lucide-react";
import { Topbar } from "@/components/dash/Topbar";
import { useUser } from "@civic/auth/react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const navigate = useNavigate();
  const { signOut } = useUser();
  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("nbd.admin.session");
      sessionStorage.clear();
    } catch {}
    navigate({ to: "/" });
  };

  return (
    <>
      <Topbar crumbs={["Newsroom", "Settings"]} user="Editor" />
      <main className="px-8 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Administration
          </div>
          <h1 className="font-serif text-4xl tracking-tight">Newsroom settings</h1>
        </div>

        <div className="space-y-4">
          <SettingCard icon={Sliders} title="Editorial preferences" desc="Default desks, auto-routing, embargo rules." />
          <SettingCard icon={Users} title="Team & roles" desc="Editors, sub-editors, fact-checkers and permissions." />
          <SettingCard icon={Shield} title="Moderation policy" desc="AI thresholds for misinformation and credibility." />
          <SettingCard icon={KeyRound} title="API & integrations" desc="Wire feeds, syndication keys and webhooks." />
          <SettingCard icon={Activity} title="Audit log" desc="Approval history, revision trails and AI overrides." />

          <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-md bg-background border border-border grid place-items-center">
                <LogOut className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <div className="font-medium">Sign out of newsroom</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  End your editor session and return to the public site.
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md bg-destructive text-destructive-foreground px-4 h-10 text-sm hover:opacity-90"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </section>
        </div>
      </main>
    </>
  );
}

function SettingCard({ icon: Icon, title, desc }: { icon: typeof Shield; title: string; desc: string }) {
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
      <button className="text-xs text-muted-foreground hover:text-foreground">Configure →</button>
    </section>
  );
}
