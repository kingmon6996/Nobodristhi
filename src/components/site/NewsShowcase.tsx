import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Reveal } from "./Reveal";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import tech from "@/assets/news-tech.jpg";
import culture from "@/assets/news-culture.jpg";
import world from "@/assets/news-world.jpg";
import business from "@/assets/news-business.jpg";
import science from "@/assets/news-science.jpg";
import politics from "@/assets/news-politics.jpg";

const fallbackItems = [
  { img: world, title: "Citizen reporters uncover local environmental hazards", category: "World" },
  { img: politics, title: "AI systems analyze credibility in new policy debates", category: "Politics" },
  { img: business, title: "Crowdsourced data reveals shifting market trends", category: "Business" },
  { img: tech, title: "New platform empowers grassroots journalism", category: "Technology" },
  { img: science, title: "Community tracking helps identify new cosmic phenomena", category: "Science" },
  { img: culture, title: "Independent creators challenge traditional media narratives", category: "Culture" },
];

export function NewsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: remoteItems = [] } = useQuery({
    queryKey: ['showcase_news'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/list`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map((r: any) => ({
        img: r.img_url || fallbackItems[0].img, 
        title: r.summary || r.breaking || "Live Update",
        category: r.category || "World",
        date: r.created_at || new Date().toISOString(),
      })).slice(0, 6);
    }
  });

  const newsItems = remoteItems.length >= 3 ? remoteItems : fallbackItems.map(item => ({ ...item, date: new Date().toISOString() }));

  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;

    // Optional auto-rotation if the user doesn't scroll much
    const autoSpin = gsap.to(carouselRef.current, {
      rotationY: "+=360",
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    const onScroll = () => {
      if (!containerRef.current || !carouselRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the section is scrolled into view (0 to 1)
      const scrollProgress = 1 - (rect.bottom / (viewportHeight + rect.height));
      
      if (scrollProgress >= -0.2 && scrollProgress <= 1.2) {
        // Boost the rotation speed while scrolling past
        // We pause the auto animation while scrolling and apply our own tween
        autoSpin.pause();
        const targetRotation = scrollProgress * -180; // Negative spins it nicely as you scroll down
        
        gsap.to(carouselRef.current, {
          rotationY: targetRotation,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
             // resume auto spinning from the new rotation point
             autoSpin.vars.rotationY = `+=${360}`;
             autoSpin.invalidate().play();
          }
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      autoSpin.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
            <h2 className="font-serif text-3xl md:text-5xl mb-6 tracking-tight">
              A Global Perspective
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore our real-time, citizen-driven journalism through a dynamic, AI-curated newsroom that brings the world's most critical stories directly to you.
            </p>
          </div>
        </Reveal>

        {/* 3D Carousel Container */}
        <div className="relative h-[450px] flex items-center justify-center max-w-full overflow-visible" style={{ perspective: "2000px" }}>
          <div 
            ref={carouselRef} 
            className="w-full h-full relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {newsItems.map((item: any, index: number) => {
              // Distribute items evenly in a circle (360 / 6 = 60 degrees each)
              const angle = (360 / newsItems.length) * index;
              
              // Push them out by 450px radius
              // Reduce radius slightly on smaller screens via CSS if needed, but 450px is generally ok for 1200px perspective
              const tz = 380; 

              return (
                <div
                  key={index}
                  onClick={() => {
                    const d = new Date(item.date);
                    const year = d.getFullYear().toString();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    navigate({ to: '/newspaper/$year/$month/$day', params: { year, month, day } });
                  }}
                  className="absolute top-1/2 left-1/2 w-[220px] md:w-[250px] h-[320px] bg-card rounded-2xl overflow-hidden border border-border shadow-xl hover:shadow-2xl hover:border-primary/30 cursor-pointer group"
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${tz}px)`,
                    backfaceVisibility: "hidden"
                  }}
                >
                  <img src={item.img} alt={item.title} className="w-full h-[50%] object-cover border-b border-border bg-neutral-100" />
                  <div className="p-5 h-[50%] flex flex-col justify-between bg-card">
                    <div>
                      <div className="text-[10px] font-semibold text-primary mb-1 uppercase tracking-wider">{item.category}</div>
                      <h3 className="font-serif text-base leading-tight line-clamp-3">{item.title}</h3>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 mt-2">
                      Read article <span aria-hidden="true">&rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}