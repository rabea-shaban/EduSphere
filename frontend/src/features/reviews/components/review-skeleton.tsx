export function ReviewSkeleton() {
  return (
    <div className="space-y-4 animate-pulse text-right dir-rtl">
      {[1, 2, 3].map((n) => (
        <div key={n} className="p-5 rounded-3xl bg-slate-200 dark:bg-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-300 dark:bg-white/10" />
              <div className="space-y-1">
                <div className="h-4 w-28 rounded bg-slate-300 dark:bg-white/10" />
                <div className="h-3 w-16 rounded bg-slate-300 dark:bg-white/10" />
              </div>
            </div>
            <div className="h-4 w-20 rounded bg-slate-300 dark:bg-white/10" />
          </div>
          <div className="h-4 w-3/4 rounded bg-slate-300 dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default ReviewSkeleton;
