// src/components/dashboard/StatCard.tsx
type StatCardProps = {
  label: string;
  value: string;
  sublabel?: string;
};

export default function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-900">
          {value}
        </span>
      </div>
      {sublabel && (
        <p className="mt-1 text-xs text-slate-500">{sublabel}</p>
      )}
    </div>
  );
}
