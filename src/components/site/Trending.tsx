import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import business from "@/assets/cms.png";
import tech from "@/assets/news-tech.jpg";
import culture from "@/assets/news-culture.jpg";
import world from "@/assets/news-world.jpg";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Article = {
  category: string;
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  read: string;
  img: string;
};

const featured: Article = {
  category: "Platform",
  title: "Preview of the CMS portal",
  excerpt:
    "A decade of remote-first capital and policy experimentation has produced a generation of cities that punch far above their weight. We map the rise.",
  author: "Eliza Marston",
  date: "May 26, 2026",
  read: "12 min read",
  img: business,
};

const others: Article[] = [
  {
    category: "Technology",
    title: "Inside the lab building the chips that will train tomorrow's models",
    author: "Daniel Okafor",
    date: "May 25, 2026",
    read: "8 min",
    img: tech,
  },
  {
    category: "Culture",
    title: "Why the museum boom of the late 2020s is reshaping civic identity",
    author: "Hana Tachibana",
    date: "May 24, 2026",
    read: "6 min",
    img: culture,
  },
  {
    category: "World",
    title: "On the Adriatic, a quiet alliance is rewriting trade in southern Europe",
    author: "Marco Renna",
    date: "May 23, 2026",
    read: "10 min",
    img: world,
  },
];

export function Trending() {
  const imgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgContainerRef.current) return;
    
    gsap.to(imgContainerRef.current, {
      y: -15,
      rotationX: 3,
      rotationY: -3,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <Reveal className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
      <div className="flex flex-col items-center text-center mb-10 border-b border-border pb-5">
        {/* <div className="eyebrow text-highlight" data-reveal style={{ opacity: 0, transform: "translateY(20px)" }}>
          Trending Now
        </div> */}
        <h2 className="mt-2 font-serif text-3xl md:text-4xl" data-reveal style={{ opacity: 0, transform: "translateY(20px)" }}>
          Preview of the CMS portal
        </h2>
      </div>
      
      <div className="w-full" style={{ perspective: "1000px" }}>
        <article
          className="group"
          data-reveal
          style={{ opacity: 0, transform: "translateY(20px)" }}
        >
          <div 
            ref={imgContainerRef}
            className="overflow-hidden rounded-sm border border-border shadow-2xl"
          >
            <img
              src={featured.img}
              alt="CMS Portal Preview"
              width={1920}
              height={1080}
              loading="lazy"
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </article>
      </div>
    </Reveal>
  );
}
