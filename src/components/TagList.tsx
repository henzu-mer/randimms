import Link from 'next/link';
import type { Tag } from '@/lib/types';

export default function TagList({ tags }: { tags: Tag[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className="rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.06] px-3 py-1 text-[12px] font-medium text-white/70 hover:text-white transition-colors"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
