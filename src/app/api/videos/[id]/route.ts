import { NextResponse } from 'next/server';
import { getVideoById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const video = getVideoById(id);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json(video);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}
