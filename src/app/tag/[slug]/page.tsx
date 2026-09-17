import { notFound } from 'next/navigation';
import { getTagBySlug, getVideos } from '@/lib/db';
import VideoGrid from '@/components/VideoGrid';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return { title: 'Tag not found' };
  return {
    title: `#${tag.name} videos`,
    description: `Watch videos tagged with ${tag.name} on randimms`,
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const videos = getVideos({ tagId: tag.id, limit: 48, orderBy: 'views', orderDir: 'DESC' });

  return (
    <div>
      <CategoryNav />

      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/[0.08] px-4 h-9 text-[14px] font-medium">
            <span className="text-white/40">#</span>
            <span>{tag.name}</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <h1 className="text-[28px] font-bold tracking-tight">#{tag.name}</h1>
            <span className="text-[14px] text-white/40">{videos.length} videos</span>
          </div>
          <p className="mt-2 text-[14px] text-white/50">Videos tagged with {tag.name}</p>
        </div>

        <VideoGrid videos={videos} emptyMessage={`No videos tagged with #${tag.name} yet`} />

        <div className="mt-12">
          <Link href="/" className="inline-flex h-9 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-[13px] font-medium items-center transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
