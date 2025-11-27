// src/components/dashboard/StatCard.tsx
"use client";

export default function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-semibold mt-1 text-slate-900 dark:text-white">
        {value}
      </p>

      {sublabel && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {sublabel}
        </p>
      )}
    </div>
  );
}
