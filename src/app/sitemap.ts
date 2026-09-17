import { MetadataRoute } from 'next';
import { getAllCategories, getVideos, getAllTags } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const categories = getAllCategories();
  const tags = getAllTags();
  const videos = getVideos({ limit: 100 });

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${base}/tag/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const videoPages: MetadataRoute.Sitemap = videos.map((v) => ({
    url: `${base}/watch/${v.id}`,
    lastModified: new Date(v.upload_date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...tagPages, ...videoPages];
}
