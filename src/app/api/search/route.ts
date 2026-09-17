import { NextRequest, NextResponse } from 'next/server';
import { searchVideos } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ videos: [], total: 0 });
  }

  try {
    const videos = searchVideos(q, 50);
    return NextResponse.json({ videos, total: videos.length, query: q });
  } catch (e) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
