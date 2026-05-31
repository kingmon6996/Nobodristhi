import type { ReportStatus } from "@/store/reports";

const styles: Record<ReportStatus, string> = {
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  revision: "bg-purple-50 text-purple-700 border-purple-200",
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.1em] font-bold shadow-sm ${styles[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {status}
    </span>
  );
}
