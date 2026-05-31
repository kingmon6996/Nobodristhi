import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  "Transcribing audio",
  "Detecting misinformation",
  "Structuring article",
  "Extracting entities",
  "Generating summary",
  "Assigning credibility score",
  "Sending to editorial review",
];

export function AIProcessing({ open, onDone }: { open: boolean; onDone: () => void }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!open) return;
    setI(0);
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setI(step);
      if (step >= STEPS.length) {
        clearInterval(id);
        setTimeout(onDone, 500);
      }
    }, 600);
    return () => clearInterval(id);
  }, [open, onDone]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          NoboDorshi AI
        </div>
        <h3 className="font-serif text-2xl mb-6">Processing your submission</h3>
        <ul className="space-y-3">
          {STEPS.map((s, idx) => {
            const done = idx < i;
            const active = idx === i;
            return (
              <li
                key={s}
                className={`flex items-center gap-3 text-sm transition-opacity ${
                  done || active ? "opacity-100" : "opacity-40"
                }`}
              >
                <span className="h-5 w-5 grid place-items-center">
                  {done ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  )}
                </span>
                <span className={done ? "line-through text-muted-foreground" : ""}>{s}…</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
