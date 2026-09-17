import Link from 'next/link';
import { formatViews, formatDuration, formatDate } from '@/lib/utils';
import type { VideoWithRelations } from '@/lib/types';

export default function VideoCard({ video }: { video: VideoWithRelations }) {
  return (
    <Link href={`/watch/${video.id}`} className="group block" prefetch={false}>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-white/[0.04]">
        {/* Thumbnail with lazy loading and modern format handling */}
        <img
          src={video.thumbnail_path || '/placeholder.jpg'}
          alt={video.title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] will-change-transform"
          // Add srcSet for responsive if external supports it - we keep simple
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Duration */}
        <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-md border border-white/10">
          {formatDuration(video.duration)}
        </div>

        {/* Quality badge if HLS */}
        {video.file_path.includes('.m3u8') && (
          <div className="absolute top-2 left-2 rounded-md bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
            HLS
          </div>
        )}

        {/* Hover play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="h-12 w-12 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black" className="ml-0.5">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        </div>

        {/* View count on hover */}
        <div className="absolute top-2 right-2 sm:hidden md:hidden lg:group-hover:block hidden rounded-full bg-black/60 backdrop-blur px-2 py-1 text-[11px] text-white/80">
          {formatViews(video.views)} views
        </div>
      </div>

      <div className="pt-3 flex gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/[0.12] to-white/[0.06] border border-white/[0.06] shrink-0 mt-0.5 hidden sm:flex items-center justify-center text-[11px] font-bold text-white/60">
          {video.title[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14px] font-medium leading-[1.35] text-white group-hover:text-white/90 transition-colors">
            {video.title}
          </h3>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[13px] text-white/50 hover:text-white/70 transition-colors flex items-center gap-1.5">
              {video.category_name || 'General'}
              {video.featured ? <span className="h-1 w-1 rounded-full bg-amber-400" title="Featured" /> : null}
            </span>
            <div className="flex items-center gap-1.5 text-[12px] text-white/40">
              <span>{formatViews(video.views)} views</span>
              <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
              <span>{formatDate(video.upload_date)}</span>
              {video.file_path.includes('.m3u8') && (
                <>
                  <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
                  <span className="text-red-400/70 text-[11px]">• HLS</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
