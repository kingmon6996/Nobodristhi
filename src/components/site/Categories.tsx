import { useState } from "react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { Tv, Radio, Video, Mic, Newspaper, Monitor, Satellite, Cast, ChevronLeft, ChevronRight } from "lucide-react";

const clients = [
  { icon: Tv, name: "ABP News", metric: "Enterprise", bg: "bg-[#da251c]", text: "text-white", iconColor: "text-yellow-400" },
  { icon: Radio, name: "Republic", metric: "Live CMS", bg: "bg-[#e21b22]", text: "text-white", iconColor: "text-white" },
  { icon: Video, name: "Aaj Tak", metric: "Digital Desk", bg: "bg-black", text: "text-white", iconColor: "text-[#ed1c24]" },
  { icon: Mic, name: "NDTV", metric: "Enterprise", bg: "bg-[#003b5c]", text: "text-white", iconColor: "text-white" },
  { icon: Newspaper, name: "Zee News", metric: "Web Portal", bg: "bg-[#00518f]", text: "text-white", iconColor: "text-[#f18218]" },
  { icon: Monitor, name: "India TV", metric: "Live CMS", bg: "bg-[#004e9c]", text: "text-white", iconColor: "text-yellow-400" },
  { icon: Satellite, name: "News18", metric: "Network", bg: "bg-[#e21b22]", text: "text-white", iconColor: "text-white" },
  { icon: Cast, name: "Times Now", metric: "Enterprise", bg: "bg-black", text: "text-white", iconColor: "text-[#ed1c24]" },
];

export function Categories() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % clients.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + clients.length) % clients.length);
  };

  const getCardStyle = (index: number) => {
    // Calculate distance from active index, wrapping around
    const diff = index - activeIndex;
    let offset = diff;
    
    // Handle wrap around for infinite loop feel
    if (diff > clients.length / 2) offset -= clients.length;
    if (diff < -clients.length / 2) offset += clients.length;

    let translateX = 0;
    let scale = 1;
    let zIndex = 10;
    let opacity = 1;
    let brightness = 1;

    if (!isExpanded) {
      // Stacked State
      if (offset === 0) {
        translateX = 0;
        scale = 1.1;
        zIndex = 50;
        opacity = 1;
        brightness = 1;
      } else {
        const direction = offset > 0 ? 1 : -1;
        const absOffset = Math.abs(offset);
        translateX = direction * (absOffset * 15); // Stacked tightly (15%, 30%, 45%)
        scale = 1.1 - (absOffset * 0.05); // Scales down slightly
        zIndex = 50 - absOffset * 10;
        opacity = 1 - (absOffset * 0.15); // Fades out slightly backwards
        brightness = 1 - (absOffset * 0.15);
      }
    } else {
      // Spread State (Expanded)
      if (offset === 0) {
        translateX = 0;
        scale = 1.1;
        zIndex = 50;
        opacity = 1;
        brightness = 1;
      } else if (offset === 1) {
        translateX = 90; // 90% to the right
        scale = 0.85;
        zIndex = 40;
        opacity = 0.9;
        brightness = 0.8;
      } else if (offset === -1) {
        translateX = -90;
        scale = 0.85;
        zIndex = 40;
        opacity = 0.9;
        brightness = 0.8;
      } else if (offset === 2) {
        translateX = 170; // pushed further out
        scale = 0.65;
        zIndex = 30;
        opacity = 0.6;
        brightness = 0.6;
      } else if (offset === -2) {
        translateX = -170;
        scale = 0.65;
        zIndex = 30;
        opacity = 0.6;
        brightness = 0.6;
      } else {
        translateX = offset > 0 ? 250 : -250;
        scale = 0.5;
        zIndex = 10;
        opacity = 0;
        brightness = 0.4;
      }
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity,
      filter: `brightness(${brightness})`,
      transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
    };
  };

  return (
    <Reveal className="mx-auto max-w-[1400px] px-5 md:px-8 py-16 md:py-32 overflow-hidden">
      <SectionHeader eyebrow="Trusted By" title="Powering Leading Newsrooms" />
      
      <div 
        className="relative w-full h-[450px] flex items-center justify-center mt-12 md:mt-20 group"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <button 
          onClick={handlePrev}
          className={`absolute left-0 md:left-12 z-[100] p-4 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-xl hover:bg-muted hover:scale-110 transition-all duration-500 text-foreground ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}
          aria-label="Previous client"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative w-[260px] md:w-[320px] h-[360px] md:h-[400px] flex items-center justify-center perspective-[1000px]">
          {clients.map((client, index) => {
            const { icon: Icon, name, metric, bg, text, iconColor } = client;
            const style = getCardStyle(index);
            
            return (
              <div
                key={name}
                onClick={() => setActiveIndex(index)}
                className={`absolute inset-0 ${bg} ${text} rounded-[2rem] shadow-2xl p-8 flex flex-col items-center justify-center cursor-pointer select-none`}
                style={{
                  ...style,
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <div className={`p-5 rounded-full bg-white/10 backdrop-blur-md mb-8 shadow-inner ${iconColor}`}>
                  <Icon className="w-12 h-12" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-3xl font-bold mb-3 text-center tracking-tight">{name}</h3>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] opacity-75">{metric}</div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={handleNext}
          className={`absolute right-0 md:right-12 z-[100] p-4 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-xl hover:bg-muted hover:scale-110 transition-all duration-500 text-foreground ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
          aria-label="Next client"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </Reveal>
  );
}
