import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { Play, Headphones } from "lucide-react";
import a from "@/assets/news-tech.jpg";
import b from "@/assets/news-politics.jpg";
import c from "@/assets/news-culture.jpg";

const media = [
  { type: "Video", icon: Play, len: "14:22", title: "The chip wars, explained in six charts", img: a },
  { type: "Podcast", icon: Headphones, len: "38 min", title: "The Newsroom: this week in policy", img: b },
  { type: "Video", icon: Play, len: "8:04", title: "Inside the gallery rewriting modern curation", img: c },
];

export function Media() {
  return (
    <section className="bg-surface/60 border-y border-border">
      <Reveal className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
        <SectionHeader eyebrow="Watch & Listen" title="Reporting in your ear" link="All series" />
        <div className="grid md:grid-cols-3 gap-6">
          {media.map((m, i) => {
            const Icon = m.icon;
            return (
              <a
                href="#"
                key={i}
                className="group overflow-hidden rounded-sm border border-border bg-card hover:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.18)] transition-all"
                data-reveal
                style={{ opacity: 0, transform: "translateY(20px)" }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={m.img}
                    alt=""
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-background/95 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 eyebrow bg-background/90 backdrop-blur px-2 py-1 rounded-sm">
                    {m.type}
                  </span>
                  <span className="absolute bottom-3 right-3 text-xs font-mono text-white bg-black/55 px-2 py-1 rounded-sm">
                    {m.len}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-serif text-lg leading-snug">{m.title}</h4>
                </div>
              </a>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
