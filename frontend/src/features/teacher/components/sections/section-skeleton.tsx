export function SectionSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F274D] animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-white/10" />
              <div className="h-4 w-48 rounded-lg bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
          <div className="h-3 w-3/4 rounded-lg bg-slate-100 dark:bg-white/5" />
          <div className="flex items-center gap-4">
            <div className="h-3 w-20 rounded-lg bg-slate-100 dark:bg-white/5" />
            <div className="h-3 w-20 rounded-lg bg-slate-100 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SectionSkeleton;
