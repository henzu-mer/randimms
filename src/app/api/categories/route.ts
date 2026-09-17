import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json(categories);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
