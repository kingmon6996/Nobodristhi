import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-6 shadow-sm shadow-[#6d68f1]/5 transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-2 hover:shadow-[#6d68f1]/15 border border-slate-200 flex flex-col items-center text-center group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6d68f1]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"></div>
      
      <div className="w-12 h-12 rounded-[1rem] bg-[#6d68f1]/5 flex items-center justify-center mb-4 transition-all duration-500 ease-out group-hover:bg-[#6d68f1]/10 group-hover:scale-110 relative z-10">
        {Icon && <Icon className="h-5 w-5 text-[#6d68f1] transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110" strokeWidth={2.5} />}
      </div>
      
      <div className="text-[12px] font-semibold tracking-wide text-slate-500 mb-1 relative z-10 transition-colors duration-300 group-hover:text-[#6d68f1]">{label}</div>
      <div className="font-serif text-3xl text-slate-900 font-bold mb-1 relative z-10">{value}</div>
      {delta && <div className="text-xs text-slate-400 font-medium">{delta}</div>}
    </div>
  );
}
