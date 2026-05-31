import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Ticker } from "@/components/site/Ticker";
import { Hero } from "@/components/site/Hero";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { FeaturesBento } from "@/components/site/FeaturesBento";
import { NewsShowcase } from "@/components/site/NewsShowcase";
import { Categories } from "@/components/site/Categories";
import { FAQ } from "@/components/site/FAQ";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoboDorshi — Independent Global Journalism" },
      {
        name: "description",
        content:
          "NoboDorshi is a next-generation digital news platform. Premium reporting on politics, business, technology and culture from 42 countries.",
      },
      { property: "og:title", content: "NoboDorshi — Independent Global Journalism" },
      {
        property: "og:description",
        content: "Premium reporting on politics, business, technology and culture.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setFooterHeight(entries[0].contentRect.height);
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main 
        className="relative z-10 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b border-border/10" 
        style={{ marginBottom: footerHeight }}
      >
        <section id="section-hero"><Hero /></section>
        <section id="section-ticker"><Ticker /></section>
        <section id="section-features"><FeaturesBento /></section>
        <section id="section-showcase"><NewsShowcase /></section>
        <section id="section-categories"><Categories /></section>
        <section id="section-faq"><FAQ /></section>
        <section id="section-newsletter"><Newsletter /></section>
      </main>
      
      <div 
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full z-0"
      >
        <Footer />
      </div>
    </div>
  );
}
