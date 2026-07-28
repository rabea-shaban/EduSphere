export function WithdrawalSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-right dir-rtl">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-28 rounded-3xl bg-slate-200 dark:bg-white/5 p-5 space-y-3">
            <div className="h-4 w-28 rounded bg-slate-300 dark:bg-white/10" />
            <div className="h-7 w-24 rounded bg-slate-300 dark:bg-white/10" />
          </div>
        ))}
      </div>
      <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5 p-6" />
    </div>
  );
}

export default WithdrawalSkeleton;
