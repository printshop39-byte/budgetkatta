// Shimmer skeleton shown while a data page fetches its rows.
export default function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass-card overflow-hidden p-0" aria-hidden="true">
      <div className="flex gap-4 border-b border-slate-200 p-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 flex-1 animate-pulse rounded bg-slate-900/[0.05]" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-slate-100 p-3">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-4 flex-1 animate-pulse rounded bg-slate-900/[0.035]"
              style={{ animationDelay: `${(r * cols + c) * 40}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
