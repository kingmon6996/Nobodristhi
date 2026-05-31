import { Reveal } from "./Reveal";
import adminDashboard from "@/assets/rms.png";

export function FeaturedGrid() {
  return (
    <section id="stories" className="bg-surface/60 border-y border-border">
      <Reveal className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-10 border-b border-border pb-5">
          <h2 className="mt-2 font-serif text-3xl md:text-4xl" data-reveal style={{ opacity: 0, transform: "translateY(20px)" }}>
            Preview of the Reporter Portal
          </h2>
        </div>
        
        <div className="w-full">
          <article
            className="group"
            data-reveal
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            <div className="overflow-hidden rounded-sm border border-border shadow-md">
              <img
                src={adminDashboard}
                alt="Reporter Portal Preview"
                width={1920}
                height={1080}
                loading="lazy"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </article>
        </div>
      </Reveal>
    </section>
  );
}
