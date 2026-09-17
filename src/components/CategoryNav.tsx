import Link from 'next/link';
import { getAllCategories } from '@/lib/db';

export default function CategoryNav({ activeSlug }: { activeSlug?: string }) {
  const categories = getAllCategories();

  return (
    <div className="sticky top-[64px] z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
          <Link
            href="/"
            className={`shrink-0 rounded-full px-4 h-8 flex items-center text-[13px] font-medium transition-colors ${
              !activeSlug
                ? 'bg-white text-black'
                : 'bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`shrink-0 rounded-full px-4 h-8 flex items-center text-[13px] font-medium transition-colors whitespace-nowrap ${
                activeSlug === cat.slug
                  ? 'bg-white text-black'
                  : 'bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
