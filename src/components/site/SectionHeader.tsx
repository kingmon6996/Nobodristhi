export function SectionHeader({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-10 border-b border-border pb-5">
      <div>
        <div className="eyebrow text-highlight" data-reveal style={{ opacity: 0, transform: "translateY(20px)" }}>
          {eyebrow}
        </div>
        <h2
          className="mt-2 font-serif text-3xl md:text-4xl"
          data-reveal
          style={{ opacity: 0, transform: "translateY(20px)" }}
        >
          {title}
        </h2>
      </div>
      {link && (
        <a
          href="#"
          className="story-link text-sm text-muted-foreground hover:text-foreground hidden sm:inline-block"
          data-reveal
          style={{ opacity: 0, transform: "translateY(20px)" }}
        >
          {link} →
        </a>
      )}
    </div>
  );
}
