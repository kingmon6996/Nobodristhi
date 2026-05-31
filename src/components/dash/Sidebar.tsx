import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { useUser } from "@civic/auth/react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function Sidebar({
  items,
  brand,
  badge,
}: {
  items: NavItem[];
  brand: string;
  badge?: string;
}) {
  const { location } = useRouterState();
  const { user, signOut } = useUser();
  
  return (
    <aside className="peer fixed top-0 bottom-0 left-0 z-50 w-20 hover:w-64 group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#6d68f1] rounded-r-[2.5rem] shadow-2xl overflow-hidden flex flex-col py-8">
      
      {/* Brand Icon / Logo */}
      <div className="flex items-center px-6 mb-10 shrink-0 w-full">
        <Link to="/" className="flex items-center gap-4 w-full">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-serif font-bold text-[#6d68f1] text-lg leading-none">N</span>
          </div>
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <span className="font-serif text-2xl tracking-tight text-white leading-none">{brand}</span>
            {badge && <span className="text-[10px] uppercase tracking-wider font-bold text-white/60 mt-1">{badge}</span>}
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 w-full">
        {items.map((it) => {
          const active = location.pathname === it.to || (it.to !== "/" && it.to !== "/dashboard" && it.to !== "/admin" && location.pathname.startsWith(`${it.to}/`));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-white text-[#6d68f1] shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#6d68f1]" : ""}`} strokeWidth={active ? 2.5 : 2} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">{it.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer / User Area */}
      <div className="px-4 w-full mt-auto">
         <button 
           onClick={() => signOut()}
           className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer text-left"
         >
           <LogOut className="w-5 h-5 shrink-0" />
           <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium delay-75">Log out</span>
         </button>
      </div>
    </aside>
  );
}
