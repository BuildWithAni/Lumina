export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
      <div className="w-full aspect-[4/3] bg-zinc-200/50 dark:bg-zinc-700/30 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
      </div>
      <div className="p-5 space-y-4">
        <div className="h-4 bg-zinc-200/50 dark:bg-zinc-700/30 rounded-md animate-pulse w-3/4 relative overflow-hidden">
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
        </div>
        <div className="h-3 bg-zinc-200/50 dark:bg-zinc-700/30 rounded-md animate-pulse w-1/2 relative overflow-hidden">
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-zinc-200/50 dark:bg-zinc-700/30 rounded-md animate-pulse w-16" />
          <div className="h-4 bg-zinc-200/50 dark:bg-zinc-700/30 rounded-md animate-pulse w-20" />
        </div>
      </div>
    </div>
  );
}
