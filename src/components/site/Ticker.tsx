const items = [
  "Markets · S&P 500 +0.42%",
  "Brussels reaches accord on AI Act revisions",
  "Tokyo: Yen steadies after intervention chatter",
  "OpenAI unveils enterprise tier expansions",
  "UN convenes emergency climate session",
  "Bitcoin holds above $72k as ETF inflows rise",
];

export function Ticker() {
  return (
    <div className="border-y border-border bg-surface/60 overflow-hidden">
      <div className="mx-auto max-w-7xl flex items-center gap-6 px-5 md:px-8 py-2.5">
        <span className="eyebrow text-breaking shrink-0 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-breaking animate-pulse" />
          Live
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-[ticker_50s_linear_infinite] text-sm text-muted-foreground">
            {[...items, ...items].map((t, i) => (
              <span key={i} className="flex items-center gap-12">
                {t}
                <span className="text-border">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
