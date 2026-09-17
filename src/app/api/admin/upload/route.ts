import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createVideo, getAllCategories, getAllTags } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Max 500MB
export const maxDuration = 60;

function getUploadSecret(): string {
  return process.env.UPLOAD_SECRET || 'randimms_secret_2024';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const secret = formData.get('secret') as string;
    if (!secret || secret !== getUploadSecret()) {
      return NextResponse.json({ error: 'Unauthorized - invalid secret' }, { status: 401 });
    }

    const title = (formData.get('title') as string)?.trim();
    const description = (formData.get('description') as string) || '';
    const category_id = (formData.get('category_id') as string) || '';
    const durationStr = (formData.get('duration') as string) || '0';
    const featuredStr = (formData.get('featured') as string) || '0';
    const tagIdsRaw = (formData.get('tagIds') as string) || '[]';
    const videoUrl = (formData.get('video_url') as string) || '';
    const thumbnailUrl = (formData.get('thumbnail_url') as string) || '';

    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }
    if (!category_id) {
      return NextResponse.json({ error: 'Category required' }, { status: 400 });
    }

    let tagIds: string[] = [];
    try {
      tagIds = JSON.parse(tagIdsRaw);
    } catch {
      tagIds = [];
    }

    const duration = parseInt(durationStr, 10) || 0;
    const featured = featuredStr === '1';

    // Handle video file or URL
    let file_path = '';
    const videoFile = formData.get('video') as File | null;

    if (videoFile && videoFile.size > 0) {
      // Save file
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(videoFile.name) || '.mp4';
      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      const buffer = Buffer.from(await videoFile.arrayBuffer());
      fs.writeFileSync(filepath, buffer);

      file_path = `/uploads/videos/${filename}`;
    } else if (videoUrl) {
      file_path = videoUrl;
    } else {
      return NextResponse.json({ error: 'Video file or URL required' }, { status: 400 });
    }

    // Handle thumbnail
    let thumbnail_path = '';
    const thumbFile = formData.get('thumbnail') as File | null;

    if (thumbFile && thumbFile.size > 0) {
      const thumbsDir = path.join(process.cwd(), 'public', 'uploads', 'thumbs');
      if (!fs.existsSync(thumbsDir)) {
        fs.mkdirSync(thumbsDir, { recursive: true });
      }

      const ext = path.extname(thumbFile.name) || '.jpg';
      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join(thumbsDir, filename);

      const buffer = Buffer.from(await thumbFile.arrayBuffer());
      fs.writeFileSync(filepath, buffer);

      thumbnail_path = `/uploads/thumbs/${filename}`;
    } else if (thumbnailUrl) {
      thumbnail_path = thumbnailUrl;
    } else {
      // Default placeholder
      thumbnail_path = `https://picsum.photos/640/360?random=${Math.floor(Math.random() * 1000)}`;
    }

    const id = createVideo({
      title,
      description,
      category_id,
      file_path,
      thumbnail_path,
      duration,
      tagIds,
      featured,
    });

    return NextResponse.json({ success: true, id, file_path, thumbnail_path });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}

// GET to check secret validity and list categories/tags
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (!secret || secret !== getUploadSecret()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categories = getAllCategories();
  const tags = getAllTags();

  return NextResponse.json({ categories, tags });
}
