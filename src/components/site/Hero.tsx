import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Play } from "lucide-react";
import cmsPreview from "@/assets/cms.png";
import LottieModule from "lottie-react";
import earthAnimation from "@/assets/earth.json";

const Lottie = (LottieModule as any).default || LottieModule;

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const imgContainer = useRef<HTMLDivElement>(null);
  const globeContainer = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ctx = gsap.context(() => {
      // 1. Text entrance animation
      gsap.from(".hero-anim", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
      });

      // Globe entrance
      gsap.from(".hero-image", { opacity: 0, scale: 1.04, duration: 1.2, ease: "power3.out" });

      // 2. Image 3D entrance animation
      gsap.fromTo(
        imgContainer.current,
        { 
          y: 100, 
          opacity: 0, 
          rotationX: 25, 
          scale: 0.9 
        },
        { 
          y: 0, 
          opacity: 1, 
          rotationX: 0, 
          scale: 1, 
          duration: 1.5, 
          ease: "expo.out",
          delay: 0.3 
        }
      );

      // 3. Continuous floating animation post-entrance
      gsap.to(imgContainer.current, {
        y: -40,
        rotationX: 12,
        rotationY: -10,
        rotationZ: 2,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        delay: 0.5
      });

      const onScroll = () => {
        if (!globeContainer.current) return;
        const y = Math.min(window.scrollY * 0.15, 80);
        globeContainer.current.style.transform = `translateY(${y}px)`;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);

    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Top Grid: Text and Globe */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="hero-anim inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              NoboDorshi CMS is now available
            </div>
            
            <h1 className="hero-anim font-serif text-[42px] leading-[1.05] md:text-[68px] md:leading-[1.02] tracking-tight">
              Turn Scattered Work Into
              <span className="block text-primary">Seamless Teamwork</span>
            </h1>
            
            <p className="hero-anim mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              From boardrooms in Singapore to research labs in Zurich, a new generation of
              institutions is rewriting the rules of capital, technology, and trust.
            </p>
            
            <div className="hero-anim mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-medium hover:opacity-90 transition shadow-xl shadow-primary/25"
              >
                Get Started <ArrowUpRight className="h-5 w-5" />
              </a>
              <a
                href="#stories"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-base font-medium hover:bg-secondary transition shadow-sm"
              >
                <Play className="h-4 w-4" /> Watch Demo
              </a>
            </div>
            <div className="hero-anim mt-4 text-sm text-muted-foreground">
              ✓ No credit card required
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div ref={globeContainer} className="hero-image relative w-full h-[420px] md:h-[520px] flex items-center justify-center pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-[120%] md:w-[140%] aspect-square rounded-full border-2 border-primary/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] orbit-ring" />
              {mounted && <Lottie animationData={earthAnimation} loop={true} className="relative z-10 w-[200%] md:w-[260%] h-auto max-w-none transform scale-125 md:scale-[1.6]" />}
            </div>
          </div>
        </div>

        {/* Dashboard Image / Preview */}
        <div className="w-full mt-24" style={{ perspective: "1200px" }}>
          <div 
            ref={imgContainer} 
            className="relative mx-auto max-w-5xl rounded-2xl shadow-2xl p-[2px] overflow-hidden group"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Spinning gradient background for the border */}
            <div className="absolute inset-[-150%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(59,130,246,0.8)_50%,transparent_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            
            <div className="relative rounded-2xl bg-card border border-border/50 overflow-hidden shadow-inner flex p-1">
              {/* Inner subtle blue glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[100px] -z-10 rounded-full" />
              
              <img
                src={cmsPreview}
                alt="NoboDorshi CMS Portal"
                width={1920}
                height={1080}
                loading="eager"
                className="w-full h-auto rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
