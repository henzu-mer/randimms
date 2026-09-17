import Link from 'next/link';
import { formatViews, formatDuration, formatDate } from '@/lib/utils';
import type { VideoWithRelations } from '@/lib/types';

export default function VideoCard({ video }: { video: VideoWithRelations }) {
  return (
    <Link href={`/watch/${video.id}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
        {/* Thumbnail */}
        <img
          src={video.thumbnail_path || '/placeholder.jpg'}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Duration */}
        <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur">
          {formatDuration(video.duration)}
        </div>

        {/* Hover play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="pt-3 flex gap-3">
        <div className="h-8 w-8 rounded-full bg-white/[0.08] shrink-0 mt-0.5 hidden sm:flex items-center justify-center text-[11px] font-bold text-white/60">
          {video.title[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14px] font-medium leading-[1.35] text-white group-hover:text-white/90 transition-colors">
            {video.title}
          </h3>
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-[13px] text-white/50 hover:text-white/70 transition-colors">
              {video.category_name || 'General'}
            </span>
            <div className="flex items-center gap-1.5 text-[12px] text-white/40">
              <span>{formatViews(video.views)} views</span>
              <span className="h-0.5 w-0.5 rounded-full bg-white/30" />
              <span>{formatDate(video.upload_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
