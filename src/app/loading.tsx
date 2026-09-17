export default function Loading() {
  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-10 rounded-[24px] overflow-hidden bg-white/[0.04] border border-white/[0.06] animate-pulse">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="aspect-video lg:aspect-[16/10] bg-white/[0.06]" />
          <div className="p-8 space-y-4">
            <div className="h-6 w-24 rounded-full bg-white/[0.06]" />
            <div className="h-8 w-full rounded bg-white/[0.06]" />
            <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
            <div className="h-10 w-32 rounded-full bg-white/[0.06] mt-6" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video rounded-xl bg-white/[0.06]" />
            <div className="mt-3 flex gap-3">
              <div className="h-8 w-8 rounded-full bg-white/[0.06]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full rounded bg-white/[0.06]" />
                <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
