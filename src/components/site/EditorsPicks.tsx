import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import a from "@/assets/news-science.jpg";
import b from "@/assets/news-business.jpg";
import c from "@/assets/news-world.jpg";

const picks = [
  { img: a, cat: "Science", title: "Quiet breakthroughs in fusion research are starting to compound", author: "Dr. Lena Voss", read: "9 min" },
  { img: b, cat: "Business", title: "How a generation of CFOs is rewriting the playbook on AI capex", author: "Tomás Reyes", read: "7 min" },
  { img: c, cat: "World", title: "The Mediterranean fishing villages going circular — and exporting their model", author: "Ines Kovač", read: "11 min" },
];

export function EditorsPicks() {
  return (
    <Reveal className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
      <SectionHeader eyebrow="Editor's Picks" title="Hand-selected this week" link="All picks" />
      <div className="flex flex-col divide-y divide-border">
        {picks.map((p, i) => (
          <article
            key={i}
            className="grid md:grid-cols-[240px_1fr_auto] gap-6 md:gap-10 py-8 first:pt-0 group items-center"
            data-reveal
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            <div className="overflow-hidden rounded-sm border border-border">
              <img
                src={p.img}
                alt=""
                width={1024}
                height={768}
                loading="lazy"
                className="h-40 md:h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <span className="eyebrow text-highlight">{p.cat}</span>
              <h3 className="mt-2 font-serif text-xl md:text-2xl leading-snug">
                <a href="#" className="story-link">{p.title}</a>
              </h3>
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="text-foreground font-medium">{p.author}</span> · {p.read}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition">
              →
            </div>
          </article>
        ))}
      </div>
    </Reveal>
  );
}
