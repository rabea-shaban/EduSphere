export function NotificationSkeleton() {
  return (
    <div className="space-y-3 animate-pulse text-right dir-rtl">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="p-4 rounded-2xl bg-slate-200 dark:bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-slate-300 dark:bg-white/10" />
            <div className="h-3 w-16 rounded bg-slate-300 dark:bg-white/10" />
          </div>
          <div className="h-3 w-3/4 rounded bg-slate-300 dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;
