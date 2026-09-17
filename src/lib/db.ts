import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Category, Tag, Video, VideoWithRelations } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'randimms.db');
let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  dbInstance = db;

  initSchema(db);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category_id TEXT REFERENCES categories(id),
      file_path TEXT NOT NULL,
      thumbnail_path TEXT,
      duration INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      upload_date TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS video_tags (
      video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,
      tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (video_id, tag_id)
    );

    CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
    CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);
    CREATE INDEX IF NOT EXISTS idx_videos_upload_date ON videos(upload_date DESC);
    CREATE INDEX IF NOT EXISTS idx_videos_title ON videos(title);
  `);

  // Seed if empty
  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number };
  if (catCount.c === 0) {
    seedDatabase(db);
  }
}

function seedDatabase(db: Database.Database) {
  console.log('Seeding database...');

  const categories = [
    { id: uuidv4(), name: 'Trending', slug: 'trending', description: 'Hot right now' },
    { id: uuidv4(), name: 'New', slug: 'new', description: 'Fresh uploads' },
    { id: uuidv4(), name: 'Popular', slug: 'popular', description: 'Most watched' },
    { id: uuidv4(), name: 'Technology', slug: 'technology', description: 'Tech reviews, tutorials, coding' },
    { id: uuidv4(), name: 'Music', slug: 'music', description: 'Music videos, performances' },
    { id: uuidv4(), name: 'Gaming', slug: 'gaming', description: 'Gameplay, streams, reviews' },
    { id: uuidv4(), name: 'Education', slug: 'education', description: 'Learn something new' },
    { id: uuidv4(), name: 'Entertainment', slug: 'entertainment', description: 'Fun and entertainment' },
    { id: uuidv4(), name: 'Travel', slug: 'travel', description: 'Explore the world' },
    { id: uuidv4(), name: 'Cooking', slug: 'cooking', description: 'Recipes and cooking shows' },
  ] as const;

  const insertCat = db.prepare('INSERT INTO categories (id, name, slug, description, created_at) VALUES (?, ?, ?, ?, ?)');
  const now = new Date().toISOString();
  const catTx = db.transaction(() => {
    for (const c of categories) {
      insertCat.run(c.id, c.name, c.slug, c.description || '', now);
    }
  });
  catTx();

  const tagList = [
    { name: 'tutorial', slug: 'tutorial' },
    { name: 'javascript', slug: 'javascript' },
    { name: 'music', slug: 'music' },
    { name: 'gaming', slug: 'gaming' },
    { name: 'funny', slug: 'funny' },
    { name: 'travel', slug: 'travel' },
    { name: 'coding', slug: 'coding' },
    { name: 'review', slug: 'review' },
    { name: '4k', slug: '4k' },
    { name: 'live', slug: 'live' },
    { name: 'vlog', slug: 'vlog' },
    { name: 'nature', slug: 'nature' },
    { name: 'food', slug: 'food' },
    { name: 'tech', slug: 'tech' },
    { name: 'education', slug: 'education' },
  ];

  const insertTag = db.prepare('INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)');
  const tagMap: Record<string, string> = {};
  const tagTx = db.transaction(() => {
    for (const t of tagList) {
      const id = uuidv4();
      tagMap[t.slug] = id;
      insertTag.run(id, t.name, t.slug);
    }
  });
  tagTx();

  // Sample videos - using public domain sample videos
  const sampleVideos = [
    {
      title: 'Big Buck Bunny - Open Movie',
      description: 'The classic open source animated short film by Blender Foundation. Follow Big Buck Bunny on his hilarious forest adventure. This 4K remaster showcases stunning animation and storytelling.',
      category_slug: 'entertainment',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
      duration: 596,
      tags: ['funny', '4k', 'nature'],
      featured: 1,
    },
    {
      title: 'Elephant Dream - The First Open Movie',
      description: 'Elephants Dream is the world\'s first open movie, made entirely with open source graphics software. A surreal journey through an industrial dreamscape.',
      category_slug: 'technology',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop',
      duration: 653,
      tags: ['tech', 'tutorial', 'education'],
      featured: 1,
    },
    {
      title: 'For Bigger Blazes - Fireplace 4K',
      description: 'Relaxing 4K fireplace video perfect for background ambiance. Crackling fire sounds with beautiful flame visuals in ultra high definition.',
      category_slug: 'trending',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=640&h=360&fit=crop',
      duration: 15,
      tags: ['4k', 'nature', 'live'],
      featured: 0,
    },
    {
      title: 'For Bigger Escapes - Nature Journey',
      description: 'Escape into nature with this breathtaking journey through mountains, forests, and rivers. Shot in stunning 4K to bring the outdoors to your screen.',
      category_slug: 'travel',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=360&fit=crop',
      duration: 15,
      tags: ['travel', 'nature', '4k', 'vlog'],
      featured: 1,
    },
    {
      title: 'Sintel - Third Open Movie by Blender',
      description: 'Sintel is an independently produced short film, initiated by the Blender Foundation. A young woman journeys to save a dragon in this epic fantasy tale.',
      category_slug: 'entertainment',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&h=360&fit=crop',
      duration: 888,
      tags: ['funny', 'education', 'review'],
      featured: 0,
    },
    {
      title: 'Subaru Outback On Street And Dirt',
      description: 'Full review of the Subaru Outback tackling both street and dirt terrains. Performance test, interior tour, and off-road capabilities demonstrated.',
      category_slug: 'technology',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640&h=360&fit=crop',
      duration: 596,
      tags: ['review', 'tech', 'vlog'],
      featured: 0,
    },
    {
      title: 'Tears of Steel - Sci-Fi Short',
      description: 'In a dystopian future, a group of warriors fight to save humanity. Tears of Steel is Blender\'s fourth open movie, blending live action with incredible VFX.',
      category_slug: 'gaming',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop',
      duration: 734,
      tags: ['gaming', 'tech', '4k'],
      featured: 1,
    },
    {
      title: 'Volkswagen GTI Review - Hot Hatch',
      description: 'In-depth review of the Volkswagen GTI. We test acceleration, handling, interior quality, and daily usability of this iconic hot hatchback.',
      category_slug: 'technology',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=640&h=360&fit=crop',
      duration: 600,
      tags: ['review', 'tech', 'vlog'],
      featured: 0,
    },
    {
      title: 'We Are Going On Bullrun - Supercar Rally',
      description: 'Join the ultimate supercar rally - Bullrun! Exotic cars, amazing roads, and non-stop action from one of the most exclusive automotive events.',
      category_slug: 'entertainment',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=360&fit=crop',
      duration: 430,
      tags: ['funny', 'travel', 'live'],
      featured: 0,
    },
    {
      title: 'What Car Can You Get For A Grand?',
      description: 'Can you find a decent car for just $1000? We scour listings, inspect candidates, and test drive the best budget finds to answer this question.',
      category_slug: 'popular',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=640&h=360&fit=crop',
      duration: 540,
      tags: ['review', 'funny', 'vlog'],
      featured: 0,
    },
    {
      title: 'Learn JavaScript in 2024 - Full Course',
      description: 'Complete JavaScript tutorial for beginners. From variables to async/await, closures to prototypes - master modern JS in this comprehensive guide with real projects.',
      category_slug: 'education',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=640&h=360&fit=crop',
      duration: 1240,
      tags: ['javascript', 'tutorial', 'coding', 'education'],
      featured: 1,
    },
    {
      title: 'Lo-Fi Beats - Chill Music Mix',
      description: '2 hours of lo-fi hip hop beats to study, code, and relax to. Curated mix of chillhop, jazzhop, and lofi vibes perfect for focus and creativity.',
      category_slug: 'music',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop',
      duration: 7200,
      tags: ['music', 'live', 'tutorial'],
      featured: 0,
    },
    {
      title: 'Italian Pasta From Scratch - Nonna Recipe',
      description: 'Authentic Italian pasta made from scratch with my grandmother\'s secret recipe. Learn to make perfect dough, shape, and sauce in this step-by-step tutorial.',
      category_slug: 'cooking',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=640&h=360&fit=crop',
      duration: 890,
      tags: ['food', 'tutorial', 'vlog'],
      featured: 1,
    },
    {
      title: 'Cyberpunk 2077 Phantom Liberty - Gameplay',
      description: 'First look at Cyberpunk 2077 Phantom Liberty expansion. New story, weapons, and Night City areas explored with RTX ON in 4K ultra settings.',
      category_slug: 'gaming',
      file_path: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop',
      duration: 1120,
      tags: ['gaming', 'review', '4k', 'live'],
      featured: 0,
    },
  ];

  const insertVideo = db.prepare(`
    INSERT INTO videos (id, title, description, category_id, file_path, thumbnail_path, duration, views, upload_date, featured, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVideoTag = db.prepare('INSERT INTO video_tags (video_id, tag_id) VALUES (?, ?)');

  const getCatId = db.prepare('SELECT id FROM categories WHERE slug = ?');

  const videoTx = db.transaction(() => {
    for (let i = 0; i < sampleVideos.length; i++) {
      const v = sampleVideos[i];
      const catRow = getCatId.get(v.category_slug) as { id: string } | undefined;
      if (!catRow) continue;

      const id = uuidv4();
      const uploadDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
      const views = Math.floor(Math.random() * 50000) + 500;
      const createdAt = new Date().toISOString();

      insertVideo.run(
        id,
        v.title,
        v.description,
        catRow.id,
        v.file_path,
        v.thumbnail,
        v.duration,
        views,
        uploadDate,
        v.featured,
        createdAt
      );

      for (const tagSlug of v.tags) {
        const tagId = tagMap[tagSlug];
        if (tagId) {
          insertVideoTag.run(id, tagId);
        }
      }
    }
  });

  videoTx();
  console.log('Database seeded');
}

// Public API
export function getAllCategories(): Category[] {
  const db = getDb();
  return db.prepare('SELECT * FROM categories ORDER BY name').all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category | undefined;
}

export function getAllTags(): Tag[] {
  const db = getDb();
  return db.prepare('SELECT * FROM tags ORDER BY name').all() as Tag[];
}

export function getTagBySlug(slug: string): Tag | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM tags WHERE slug = ?').get(slug) as Tag | undefined;
}

export function getVideoById(id: string): VideoWithRelations | undefined {
  const db = getDb();
  const video = db.prepare(`
    SELECT v.*, c.name as category_name, c.slug as category_slug
    FROM videos v
    LEFT JOIN categories c ON v.category_id = c.id
    WHERE v.id = ?
  `).get(id) as Video | undefined;

  if (!video) return undefined;

  const tags = db.prepare(`
    SELECT t.* FROM tags t
    JOIN video_tags vt ON vt.tag_id = t.id
    WHERE vt.video_id = ?
  `).all(id) as Tag[];

  return { ...video, tags };
}

export function incrementView(id: string) {
  const db = getDb();
  db.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').run(id);
}

export function getVideos(opts: {
  limit?: number;
  offset?: number;
  categoryId?: string;
  tagId?: string;
  search?: string;
  featured?: boolean;
  orderBy?: 'views' | 'upload_date' | 'created_at';
  orderDir?: 'ASC' | 'DESC';
} = {}): VideoWithRelations[] {
  const db = getDb();
  const {
    limit = 24,
    offset = 0,
    categoryId,
    tagId,
    search,
    featured,
    orderBy = 'upload_date',
    orderDir = 'DESC',
  } = opts;

  let query = `
    SELECT v.*, c.name as category_name, c.slug as category_slug
    FROM videos v
    LEFT JOIN categories c ON v.category_id = c.id
  `;
  const conditions: string[] = [];
  const params: any[] = [];

  if (tagId) {
    query += ` JOIN video_tags vt ON vt.video_id = v.id `;
    conditions.push('vt.tag_id = ?');
    params.push(tagId);
  }

  if (categoryId) {
    conditions.push('v.category_id = ?');
    params.push(categoryId);
  }

  if (featured !== undefined) {
    conditions.push('v.featured = ?');
    params.push(featured ? 1 : 0);
  }

  if (search) {
    conditions.push(`(v.title LIKE ? OR v.description LIKE ? OR EXISTS (
      SELECT 1 FROM tags t JOIN video_tags vt2 ON vt2.tag_id = t.id WHERE vt2.video_id = v.id AND t.name LIKE ?
    ))`);
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Validate orderBy to prevent injection
  const allowedOrder = ['views', 'upload_date', 'created_at', 'title'];
  const safeOrder = allowedOrder.includes(orderBy) ? orderBy : 'upload_date';
  const safeDir = orderDir === 'ASC' ? 'ASC' : 'DESC';

  query += ` ORDER BY v.${safeOrder} ${safeDir} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const videos = db.prepare(query).all(...params) as Video[];

  // Get tags for each video
  const tagStmt = db.prepare(`
    SELECT t.* FROM tags t
    JOIN video_tags vt ON vt.tag_id = t.id
    WHERE vt.video_id = ?
  `);

  return videos.map(v => ({
    ...v,
    tags: tagStmt.all(v.id) as Tag[],
  }));
}

export function searchVideos(q: string, limit = 24): VideoWithRelations[] {
  return getVideos({ search: q, limit, orderBy: 'views', orderDir: 'DESC' });
}

export function getRelatedVideos(videoId: string, categoryId: string, limit = 8): VideoWithRelations[] {
  const db = getDb();
  const videos = db.prepare(`
    SELECT v.*, c.name as category_name, c.slug as category_slug
    FROM videos v
    LEFT JOIN categories c ON v.category_id = c.id
    WHERE v.id != ? AND v.category_id = ?
    ORDER BY v.views DESC
    LIMIT ?
  `).all(videoId, categoryId, limit) as Video[];

  const tagStmt = db.prepare(`
    SELECT t.* FROM tags t
    JOIN video_tags vt ON vt.tag_id = t.id
    WHERE vt.video_id = ?
  `);

  return videos.map(v => ({
    ...v,
    tags: tagStmt.all(v.id) as Tag[],
  }));
}

export function createVideo(data: {
  title: string;
  description: string;
  category_id: string;
  file_path: string;
  thumbnail_path: string;
  duration: number;
  tagIds: string[];
  featured?: boolean;
}) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO videos (id, title, description, category_id, file_path, thumbnail_path, duration, views, upload_date, featured, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.description,
      data.category_id,
      data.file_path,
      data.thumbnail_path,
      data.duration,
      now,
      data.featured ? 1 : 0,
      now
    );

    const insertVT = db.prepare('INSERT INTO video_tags (video_id, tag_id) VALUES (?, ?)');
    for (const tagId of data.tagIds) {
      insertVT.run(id, tagId);
    }
  });

  tx();
  return id;
}

export function getVideoCount(opts: { categoryId?: string; tagId?: string; search?: string } = {}): number {
  const db = getDb();
  let query = 'SELECT COUNT(*) as c FROM videos v';
  const conditions: string[] = [];
  const params: any[] = [];

  if (opts.tagId) {
    query += ' JOIN video_tags vt ON vt.video_id = v.id';
    conditions.push('vt.tag_id = ?');
    params.push(opts.tagId);
  }

  if (opts.categoryId) {
    conditions.push('v.category_id = ?');
    params.push(opts.categoryId);
  }

  if (opts.search) {
    conditions.push(`(v.title LIKE ? OR v.description LIKE ? OR EXISTS (
      SELECT 1 FROM tags t JOIN video_tags vt2 ON vt2.tag_id = t.id WHERE vt2.video_id = v.id AND t.name LIKE ?
    ))`);
    const like = `%${opts.search}%`;
    params.push(like, like, like);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const row = db.prepare(query).get(...params) as { c: number };
  return row.c;
}

export function getPopularTags(limit = 20): (Tag & { count: number })[] {
  const db = getDb();
  return db.prepare(`
    SELECT t.*, COUNT(vt.video_id) as count
    FROM tags t
    JOIN video_tags vt ON vt.tag_id = t.id
    GROUP BY t.id
    ORDER BY count DESC
    LIMIT ?
  `).all(limit) as (Tag & { count: number })[];
}

export { getDb };
