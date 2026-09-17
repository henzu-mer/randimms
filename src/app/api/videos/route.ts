import { NextRequest, NextResponse } from 'next/server';
import { getVideos, getVideoCount } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || undefined;
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const limit = parseInt(searchParams.get('limit') || '24', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const orderBy = (searchParams.get('orderBy') as any) || 'upload_date';
  const orderDir = (searchParams.get('orderDir') as any) || 'DESC';
  const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;

  try {
    // Resolve category/tag slugs to ids if needed - for simplicity, expect ids, but also support direct slug lookup in lib? We'll handle slug via separate logic in page.
    // Here we assume categoryId and tagId are passed as ids; but also allow slug resolution via extra query param.
    // For simplicity, if category looks like uuid, use as id, otherwise try to find category by slug in db layer? We'll just pass as categoryId and let lib handle? Actually lib expects id.
    // To support both, we try to import getCategoryBySlug etc.

    const { getCategoryBySlug, getTagBySlug } = await import('@/lib/db');

    let categoryId = category;
    if (category && !category.includes('-')) {
      // might be slug without dash? still try slug lookup
      const cat = getCategoryBySlug(category);
      if (cat) categoryId = cat.id;
    } else if (category) {
      const cat = getCategoryBySlug(category);
      if (cat) categoryId = cat.id;
    }

    let tagId = tag;
    if (tag) {
      const t = getTagBySlug(tag);
      if (t) tagId = t.id;
    }

    const videos = getVideos({
      search: q,
      categoryId,
      tagId,
      limit: Math.min(limit, 100),
      offset,
      orderBy,
      orderDir,
      featured,
    });

    const total = getVideoCount({ search: q, categoryId, tagId });

    return NextResponse.json({ videos, total, limit, offset });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
