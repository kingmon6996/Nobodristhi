import { useState } from "react";
import { useUser } from "@civic/auth/react";
import { useNavigate } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import admins from "../../admins.json";
import "./Newsletter.css";

export function Newsletter() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    // In a real app, POST to an API endpoint
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <Reveal className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
      <div
        id="newsletter-section"
        className="relative overflow-hidden rounded-sm border border-border bg-card px-6 md:px-16 py-16 md:py-24 text-center"
        data-reveal
        style={{ opacity: 0, transform: "translateY(20px)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <span className="eyebrow text-highlight">The Daily Brief</span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight">
            One email. The stories that shaped the day.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Delivered at 7am in your time zone. Curated by our editors — no noise, no filler. Join
            over 240,000 readers who start their morning with NoboDorshi.
          </p>

          {/* Newsletter email subscription — shown for both logged-in and logged-out users */}
          <form
            className="mt-9 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              className="newsletter-subscribe-btn rounded-full px-6 py-3 text-sm font-medium transition"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p className="mt-3 text-sm text-highlight animate-fade-in">
              🎉 You're in! Check your inbox to confirm your subscription.
            </p>
          )}

          {/* If logged in, show a small link to dashboard */}
          {user && (
            <div className="mt-5">
              <button
                type="button"
                className="user-profile-button flex items-center gap-2 mx-auto"
                onClick={() => {
                  const isAdmin = user?.email && admins.includes(user.email);
                  navigate({ to: isAdmin ? '/admin' : '/dashboard' });
                }}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name || "User"} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-medium">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.name || (user?.email && admins.includes(user.email) ? "Admin" : "Dashboard")}</span>
              </button>
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Free forever. Unsubscribe in one click. We respect your inbox.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
