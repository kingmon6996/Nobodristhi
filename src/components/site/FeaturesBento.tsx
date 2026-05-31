import { Reveal } from "./Reveal";
import { Layout, Workflow, Users, Sparkles, BarChart3, LayoutDashboard, Send } from "lucide-react";

export function FeaturesBento() {
  return (
    <section className="bg-background py-24 md:py-32 relative overflow-hidden">
      {/* Subtle Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-highlight/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-4 tracking-tight text-foreground">
              Features To Boost Your Productivity
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to plan, track, and deliver on all your tasks.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Top Left: Adaptive Organizer */}
          <Reveal className="lg:col-span-5 h-full">
            <div className="bg-card border border-border shadow-sm rounded-3xl p-8 h-full flex flex-col justify-between group hover:border-primary/30 transition-colors">
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl border border-border flex items-center justify-center">
                <div className="w-full space-y-3">
                  <div className="h-2 w-1/3 bg-muted-foreground/20 rounded-full" />
                  <div className="h-10 w-full bg-primary/10 border border-primary/20 rounded-lg flex items-center px-4">
                    <LayoutDashboard className="w-4 h-4 text-primary mr-3" />
                    <span className="text-sm font-medium text-foreground">Smart Campaign</span>
                  </div>
                  <div className="h-10 w-full bg-muted rounded-lg flex items-center px-4 opacity-50">
                    <span className="text-sm font-medium text-muted-foreground">Weekly Planning</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <Layout className="w-5 h-5 text-primary" />
                  Adaptive Organizer
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your tasks automatically rearrange based on deadlines and importance, so you always know what to focus on.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Top Right: Templates & Workflows */}
          <Reveal className="lg:col-span-7 h-full">
            <div className="bg-card border border-border shadow-sm rounded-3xl p-8 h-full flex flex-col justify-between group hover:border-highlight/30 transition-colors">
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl border border-border flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-3/4 h-24 bg-background rounded-lg border border-border shadow-md transform translate-x-12 translate-y-4 opacity-90 p-4">
                  <div className="flex gap-2 mb-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center"><Workflow className="w-4 h-4 text-primary" /></div>
                    <div>
                      <div className="w-20 h-3 bg-muted rounded mb-1" />
                      <div className="w-12 h-2 bg-muted/70 rounded" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 w-3/4 h-24 bg-background rounded-lg border border-border shadow-lg p-4">
                  <div className="flex gap-2 mb-3">
                    <div className="w-8 h-8 rounded bg-highlight/10 flex items-center justify-center"><Send className="w-4 h-4 text-highlight" /></div>
                    <div>
                      <div className="w-24 h-3 bg-muted rounded mb-1" />
                      <div className="w-16 h-2 bg-muted/70 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <Workflow className="w-5 h-5 text-highlight" />
                  Templates & Workflows
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Set up repeatable workflows or start with ready-made templates for projects, sprints, or personal routines.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Middle Left: Collaboration Made Easy */}
          <Reveal className="lg:col-span-7 h-full">
            <div className="bg-card border border-border shadow-sm rounded-3xl p-8 h-full flex flex-col justify-between group hover:border-primary/30 transition-colors">
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl border border-border flex items-center justify-center gap-4">
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center z-[${5-i}]`}>
                        <Users className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                 </div>
                 <div className="w-24 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30">
                    Invite +
                 </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Collaboration Made Easy
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Share projects with your team, assign responsibilities, and track progress in real-time.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Middle Right: AI Integration */}
          <Reveal className="lg:col-span-5 h-full">
            <div className="bg-gradient-to-br from-primary/5 to-card border border-border shadow-sm rounded-3xl p-8 h-full flex flex-col justify-between group hover:border-primary/30 transition-colors">
              <div className="mb-8 p-6 bg-secondary/50 rounded-xl border border-border flex items-center justify-center">
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-md shadow-primary/20 hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                  Ask AI
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-foreground">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Integration
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get AI recommendations, insights, reminders, and even auto-generated task breakdowns.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
