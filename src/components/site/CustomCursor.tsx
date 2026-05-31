import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Show cursor when mouse enters screen
    gsap.set(cursor, { x: -100, y: -100, opacity: 1 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.15 });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, input, textarea, [role="button"]');
      
      if (isHoverable) {
        gsap.to(cursor, { 
          scale: 1.8, 
          backgroundColor: "rgba(59, 130, 246, 0.4)", // deeper translucent blue 
          borderColor: "rgba(59, 130, 246, 0.8)",
          duration: 0.2 
        });
      } else {
        gsap.to(cursor, { 
          scale: 1, 
          backgroundColor: "rgba(96, 165, 250, 0.15)", // light translucent blue
          borderColor: "rgba(96, 165, 250, 0.5)",
          duration: 0.2 
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-blue-400/50 bg-blue-400/15 backdrop-blur-[2px] pointer-events-none z-[10000] transform -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-normal"
    />
  );
}
