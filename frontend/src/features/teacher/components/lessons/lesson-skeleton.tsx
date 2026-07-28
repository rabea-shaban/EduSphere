export function LessonSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="p-3.5 rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50/50 dark:bg-[#0B2D5B]/40 animate-pulse flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="space-y-1">
              <div className="h-3.5 w-40 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-2.5 w-24 rounded bg-slate-100 dark:bg-white/5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LessonSkeleton;
