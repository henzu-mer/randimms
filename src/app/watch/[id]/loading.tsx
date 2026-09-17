export default function Loading() {
  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6 animate-pulse">
          <div className="aspect-video rounded-2xl bg-white/[0.06]" />
          <div className="h-8 w-3/4 rounded bg-white/[0.06]" />
          <div className="h-20 rounded-2xl bg-white/[0.04]" />
        </div>
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-[168px] aspect-video rounded-xl bg-white/[0.06]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded bg-white/[0.06]" />
                <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
