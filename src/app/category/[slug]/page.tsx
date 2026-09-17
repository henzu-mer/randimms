import { notFound } from 'next/navigation';
import { getCategoryBySlug, getVideos, getAllCategories } from '@/lib/db';
import VideoGrid from '@/components/VideoGrid';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Category not found' };
  return {
    title: `${category.name} videos`,
    description: category.description || `Watch ${category.name} videos on randimms`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Special handling for virtual categories
  let videos;
  let title = category.name;
  let description = category.description;

  if (slug === 'trending') {
    videos = getVideos({ limit: 48, orderBy: 'views', orderDir: 'DESC' });
    title = 'Trending now';
    description = 'Most watched videos right now across all categories';
  } else if (slug === 'new') {
    videos = getVideos({ limit: 48, orderBy: 'upload_date', orderDir: 'DESC' });
    title = 'New uploads';
    description = 'Fresh videos uploaded recently';
  } else if (slug === 'popular') {
    videos = getVideos({ limit: 48, orderBy: 'views', orderDir: 'DESC' });
    title = 'Popular videos';
    description = 'All-time most viewed videos on randimms';
  } else {
    videos = getVideos({ categoryId: category.id, limit: 48, orderBy: 'upload_date', orderDir: 'DESC' });
  }

  return (
    <div>
      <CategoryNav activeSlug={slug} />

      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[28px] font-bold tracking-tight">{title}</h1>
            <span className="text-[14px] text-white/40">{videos.length} videos</span>
          </div>
          {description && (
            <p className="mt-2 text-[14px] text-white/50 max-w-2xl">{description}</p>
          )}
        </div>

        <VideoGrid videos={videos} emptyMessage={`No videos in ${category.name} yet`} />

        <div className="mt-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
          <h3 className="text-[13px] font-medium text-white/60 mb-3">Browse other categories</h3>
          <div className="flex flex-wrap gap-2">
            {getAllCategories().map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className={`rounded-full px-4 h-8 flex items-center text-[13px] font-medium border transition-colors ${c.slug === slug ? 'bg-white text-black border-white' : 'bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.10] border-white/[0.06]'}`}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
