import { searchVideos } from '@/lib/db';
import VideoGrid from '@/components/VideoGrid';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  if (!q) return { title: 'Search' };
  return {
    title: `Search: ${q}`,
    description: `Search results for ${q} on randimms`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const videos = query ? searchVideos(query, 48) : [];

  return (
    <div>
      <CategoryNav />

      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {query ? (
            <>
              <h1 className="text-[24px] font-bold tracking-tight">
                Search results for <span className="text-white/60">"{query}"</span>
              </h1>
              <p className="mt-2 text-[14px] text-white/50">{videos.length} videos found</p>
            </>
          ) : (
            <>
              <h1 className="text-[24px] font-bold tracking-tight">Search</h1>
              <p className="mt-2 text-[14px] text-white/50">Enter a query to search videos, descriptions, and tags</p>
            </>
          )}
        </div>

        {query ? (
          <VideoGrid videos={videos} emptyMessage={`No results for "${query}". Try different keywords or browse categories.`} />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] p-12 text-center">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto h-12 w-12 rounded-full bg-white/[0.06] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-[14px] text-white/60 mb-6">Start typing in the search bar above to find videos</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['javascript', 'music', 'gaming', 'travel', 'tutorial'].map((tag) => (
                  <Link key={tag} href={`/search?q=${tag}`} className="rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.06] px-4 h-8 flex items-center text-[13px] text-white/70 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
