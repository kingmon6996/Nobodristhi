import { useEffect, useState } from "react";
import { Menu, X, Home, Clock, Landmark, Monitor, Briefcase, Newspaper, Globe } from "lucide-react";
import { useUser } from "@civic/auth/react";
import { useNavigate } from "@tanstack/react-router";
import "./Navbar.css";
import adminsData from "../../admins.json";

const admins = adminsData as string[];

const navItems = [
  { name: "Home", icon: Home, targetId: "section-hero" },
  { name: "Latest", icon: Clock, targetId: "section-showcase" },
  { name: "Politics", icon: Landmark, targetId: "section-features" },
  { name: "Technology", icon: Monitor, targetId: "section-categories" },
  { name: "Business", icon: Briefcase, targetId: "section-faq" },
  { name: "All News", icon: Newspaper, targetId: "section-newsletter" },
  { name: "World", icon: Globe, targetId: "section-newsletter" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signIn } = useUser();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSignIn = async () => {
    try {
      const { user } = await signIn();
      const isAdmin = user?.email && admins.includes(user.email);
      navigate({ to: isAdmin ? '/admin' : '/dashboard' });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 pointer-events-none ${
        scrolled
          ? "bg-background/60 backdrop-blur-md border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          : "bg-transparent pt-2"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8 pointer-events-auto">
        <div className="flex items-center gap-6 relative w-full">
          <a href="/" className="font-serif text-2xl tracking-tight z-20 shrink-0">
            NoboDorshi<span className="text-highlight">.</span>
          </a>
          
          <div className="hidden lg:flex flex-1 overflow-x-auto scrollbar-hide pb-8 -mb-8 pt-2 -mt-2 mask-linear-fade">
            <nav className="flex relative items-center bg-background rounded-full h-16 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] border border-border/50 min-w-max mx-auto px-2">
              {/* The Gooey Curve Indicator */}
              <div 
                className="curve-indicator"
                style={{ transform: `translateX(${activeIndex * 80 + 8}px)` }} /* +8px for px-2 padding */
              >
                <div className="curve-bump" />
              </div>

              {navItems.map((item, index) => {
                const isActive = activeIndex === index;
                const Icon = item.icon;
                return (
                  <a 
                    key={item.name} 
                    href="#"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setActiveIndex(index);
                      
                      const scrollToSection = () => {
                        const el = document.getElementById(item.targetId);
                        if (el) {
                          const y = el.getBoundingClientRect().top + window.scrollY - 100;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      };

                      if (window.location.pathname !== '/') {
                        navigate({ to: '/' });
                        setTimeout(scrollToSection, 150);
                      } else {
                        scrollToSection();
                      }
                    }}
                    className="relative z-10 flex flex-col items-center justify-center w-[80px] h-full group shrink-0"
                  >
                    {/* Unselected State (Icon + Text) */}
                    <div className={`flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'translate-y-8 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-blue-400 transition-colors duration-300" />
                      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-blue-400 transition-colors duration-300 mt-1">
                        {item.name}
                      </span>
                    </div>
                    
                    {/* Active State (Solid Circle with Icon) */}
                    <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center rounded-full pointer-events-none ${isActive ? '-bottom-[18px] w-12 h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/40 border-[4px] border-background opacity-100 scale-100' : 'bottom-0 w-8 h-8 opacity-0 scale-50'}`}>
                      <Icon className="w-[22px] h-[22px]" />
                    </div>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:inline-flex items-center gap-3">
            {!user ? (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 whitespace-nowrap"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-all hover:opacity-90 border border-transparent hover:border-border/50"
                onClick={() => {
                  const isAdmin = user?.email && admins.includes(user.email);
                  navigate({ to: isAdmin ? '/admin' : '/dashboard' });
                }}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name || "User"} className="w-6 h-6 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-[10px] font-medium shrink-0">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="whitespace-nowrap truncate max-w-[140px] text-[13px] leading-none">
                  {user.name || (user?.email && admins.includes(user.email) ? "Admin" : "Dashboard")}
                </span>
              </button>
            )}
          </div>
          <button
            aria-label="Menu"
            className="lg:hidden p-2 rounded-full hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background pointer-events-auto">
          <nav className="flex flex-col px-6 py-4 gap-3 text-sm">
            {navItems.map((item) => (
              <a key={item.name} href="#" className="py-1">
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
