import { getVideos, getAllCategories, getPopularTags } from '@/lib/db';
import VideoGrid from '@/components/VideoGrid';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';
import { formatViews } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const featured = getVideos({ featured: true, limit: 8, orderBy: 'views', orderDir: 'DESC' });
  const recent = getVideos({ limit: 12, orderBy: 'upload_date', orderDir: 'DESC' });
  const popular = getVideos({ limit: 12, orderBy: 'views', orderDir: 'DESC' });
  const trending = getVideos({ limit: 8, orderBy: 'views', orderDir: 'DESC' });
  const popularTags = getPopularTags(12);

  const hero = featured[0];

  return (
    <div>
      <CategoryNav />

      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero */}
        {hero && (
          <div className="mb-10 rounded-[24px] overflow-hidden relative bg-zinc-900 border border-white/[0.06]">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
              <Link href={`/watch/${hero.id}`} className="relative aspect-video lg:aspect-[16/10] overflow-hidden group block">
                <img src={hero.thumbnail_path} alt={hero.title} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="black" className="ml-1">
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                  <div className="inline-flex rounded-full bg-white/10 backdrop-blur px-3 py-1 text-[11px] font-medium text-white border border-white/10">FEATURED</div>
                </div>
              </Link>
              <div className="p-6 lg:p-8 flex flex-col justify-center bg-[#111111] lg:bg-[#0f0f0f]">
                <div className="hidden lg:inline-flex rounded-full bg-white text-black px-3 py-1 text-[11px] font-bold tracking-wide w-fit mb-4">FEATURED • {hero.category_name?.toUpperCase()}</div>
                <Link href={`/watch/${hero.id}`}>
                  <h1 className="text-[24px] lg:text-[32px] font-bold leading-[1.1] tracking-tight hover:text-white/80 transition-colors line-clamp-3">
                    {hero.title}
                  </h1>
                </Link>
                <p className="mt-3 text-[14px] leading-[1.5] text-white/60 line-clamp-3">
                  {hero.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-[13px] text-white/40">
                  <span>{formatViews(hero.views)} views</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{hero.category_name}</span>
                </div>
                <div className="mt-6 flex gap-2">
                  <Link href={`/watch/${hero.id}`} className="h-10 px-6 rounded-full bg-white text-black text-[14px] font-medium flex items-center hover:bg-white/90 transition-colors">
                    Watch now
                  </Link>
                  <Link href={`/category/${hero.category_slug}`} className="h-10 px-6 rounded-full bg-white/[0.08] text-white text-[14px] font-medium flex items-center hover:bg-white/[0.12] border border-white/[0.08] transition-colors">
                    More in {hero.category_name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-semibold tracking-tight">Trending now</h2>
            <Link href="/category/trending" className="text-[13px] text-white/50 hover:text-white transition-colors">View all →</Link>
          </div>
          <VideoGrid videos={trending} />
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-semibold tracking-tight">Recent uploads</h2>
            <Link href="/category/new" className="text-[13px] text-white/50 hover:text-white transition-colors">View all →</Link>
          </div>
          <VideoGrid videos={recent} />
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-semibold tracking-tight">Most popular</h2>
            <Link href="/category/popular" className="text-[13px] text-white/50 hover:text-white transition-colors">View all →</Link>
          </div>
          <VideoGrid videos={popular} />
        </section>

        {/* Tags cloud */}
        <section className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6">
          <h3 className="text-[14px] font-medium mb-4">Popular tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`} className="group flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.06] px-4 h-8 text-[13px] transition-colors">
                <span className="text-white/70 group-hover:text-white">#{tag.name}</span>
                <span className="text-[11px] text-white/30">{tag.count}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
