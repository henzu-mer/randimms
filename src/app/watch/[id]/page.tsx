import { notFound } from 'next/navigation';
import { getVideoById, getRelatedVideos, incrementView } from '@/lib/db';
import VideoPlayer from '@/components/VideoPlayer';
import VideoCard from '@/components/VideoCard';
import TagList from '@/components/TagList';
import { formatViews, formatDate } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const video = getVideoById(id);
  if (!video) return { title: 'Video not found' };
  return {
    title: video.title,
    description: video.description.slice(0, 160),
    openGraph: {
      title: video.title,
      description: video.description.slice(0, 160),
      images: [video.thumbnail_path],
      type: 'video.other',
    },
  };
}

export default async function WatchPage({ params }: Props) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    notFound();
  }

  // Increment view - fire and forget
  try {
    incrementView(id);
  } catch {}

  const related = getRelatedVideos(video.id, video.category_id, 12);

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Main */}
        <div className="min-w-0">
          <VideoPlayer src={video.file_path} poster={video.thumbnail_path} />

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Link href={`/category/${video.category_slug}`} className="inline-flex rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.06] px-3 py-1 text-[12px] font-medium text-white/70 transition-colors">
                {video.category_name}
              </Link>
              <span className="inline-flex rounded-full bg-white/[0.06] px-3 py-1 text-[12px] text-white/40">
                {formatDate(video.upload_date)}
              </span>
            </div>

            <h1 className="text-[20px] sm:text-[24px] font-bold leading-[1.2] tracking-tight">
              {video.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-white/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/[0.08] flex items-center justify-center font-bold text-white/60 text-[12px]">
                  {video.title[0]}
                </div>
                <div>
                  <div className="text-white text-[13px] font-medium leading-none">{video.category_name} • Official</div>
                  <div className="text-[12px] mt-0.5">{formatViews(video.views + 1)} views</div>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="h-9 px-4 rounded-full bg-white text-black text-[13px] font-medium hover:bg-white/90 transition-colors">
                  Share
                </button>
                <button className="h-9 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-[13px] font-medium border border-white/[0.08] transition-colors">
                  Save
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[13px] font-medium">{formatViews(video.views + 1)} views</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[13px] text-white/50">{new Date(video.upload_date).toLocaleDateString()}</span>
              </div>
              <p className="text-[14px] leading-[1.6] text-white/70 whitespace-pre-wrap">
                {video.description}
              </p>
              <div className="mt-4">
                <TagList tags={video.tags} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - related */}
        <div className="lg:sticky lg:top-[88px] h-fit">
          <h2 className="text-[14px] font-semibold mb-4 tracking-tight">Up next • {related.length} videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {related.map((v) => (
              <div key={v.id} className="flex gap-3 group">
                <Link href={`/watch/${v.id}`} className="relative aspect-video w-[168px] shrink-0 overflow-hidden rounded-xl bg-zinc-900 block">
                  <img src={v.thumbnail_path} alt={v.title} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                  <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                    {Math.floor(v.duration / 60)}:{(v.duration % 60).toString().padStart(2, '0')}
                  </div>
                </Link>
                <div className="min-w-0 flex-1 py-0.5">
                  <Link href={`/watch/${v.id}`} className="line-clamp-2 text-[13px] font-medium leading-[1.3] hover:text-white/80">
                    {v.title}
                  </Link>
                  <div className="mt-1 text-[12px] text-white/40">
                    <div>{v.category_name}</div>
                    <div className="flex gap-1 mt-0.5">
                      <span>{formatViews(v.views)} views</span>
                      <span>•</span>
                      <span>{formatDate(v.upload_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {related.length === 0 && (
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-6 text-center text-[13px] text-white/40">
              No related videos yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
