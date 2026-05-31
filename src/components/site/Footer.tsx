import { Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const cols = [
  { h: "Company", links: ["About", "Careers", "Newsroom", "Press"] },
  { h: "Advertise", links: ["Advertise with us", "Brand studio", "Partnerships", "Sponsorships"] },
  { h: "Support", links: ["Contact", "Help center", "Subscriptions", "Corporate"] },
  { h: "Legal", links: ["Terms", "Privacy", "Cookie policy", "Accessibility"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <a href="/" className="font-serif text-3xl tracking-tight">
            NoboDorshi<span className="text-highlight">.</span>
          </a>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Independent global journalism. Reporting from 42 countries with the rigor of a
            newsroom and the depth of a magazine.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {[Twitter, Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h} className="md:col-span-2">
            <div className="eyebrow text-foreground">{c.h}</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="story-link hover:text-foreground">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© 2026 NoboDorshi Media Group. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground">Sitemap</a>
            <a href="#" className="hover:text-foreground">Ethics</a>
            <a href="#" className="hover:text-foreground">Corrections</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
