# randimms — Modern Video Streaming Platform

A fully functional, dynamic video streaming website built with Next.js 16, React 19, Tailwind CSS 4, and SQLite.

![randimms](https://img.shields.io/badge/randimms-streaming-black?style=for-the-badge)

## ✨ Features

- **Home Page** — Featured hero, trending, recent, popular sections with responsive grid
- **Watch Page** — HTML5 video player, view counts, related videos, tags, SEO metadata (`/watch/[id]`)
- **Categories** — Trending, New, Popular + topic categories (Tech, Music, Gaming, etc.) (`/category/[slug]`)
- **Tags** — Clickable tags showing related videos (`/tag/[slug]`)
- **Search** — Full-text search across titles, descriptions, tags (`/search?q=...`)
- **Studio / Upload** — Private, secure upload system (`/studio`) — no login, just secret key
- **Performance** — Lazy thumbnails, efficient SQLite, Turbopack, responsive dark UI
- **SEO** — Proper titles, meta tags, OpenGraph, semantic HTML

## 🚀 Quick Start

```bash
# Install
npm install

# Set secret (optional, default is randimms_secret_2024)
echo "UPLOAD_SECRET=your_strong_secret_here" > .env.local

# Dev
npm run dev
# → http://localhost:3000

# Build
npm run build
npm start
```

On first run, SQLite DB is auto-created at `data/randimms.db` and seeded with:
- 10 categories
- 15 tags
- 14 sample videos (using public domain samples from gtv-videos-bucket)

## 📁 Project Structure

```
src/
  app/
    page.tsx              # Home
    layout.tsx            # Root layout + Header + SEO
    globals.css           # Dark theme
    watch/[id]/page.tsx   # Video player + related
    category/[slug]/page.tsx
    tag/[slug]/page.tsx
    search/page.tsx
    studio/page.tsx       # Private uploader UI
    api/
      videos/             # List + filter
      videos/[id]/        # Detail
      videos/[id]/view    # Increment view
      categories/         # List categories
      tags/               # List tags
      search/             # Search
      admin/upload/       # Secure upload endpoint
  components/
    Header.tsx            # Logo + search + nav
    VideoCard.tsx         # Thumbnail + hover play
    VideoGrid.tsx
    VideoPlayer.tsx       # HTML5 player
    CategoryNav.tsx       # Horizontal scroll categories
    TagList.tsx
  lib/
    db.ts                 # SQLite + schema + seed + queries
    types.ts
    utils.ts              # formatViews, duration, date
public/
  uploads/
    videos/               # Your uploaded videos (gitignored)
    thumbs/               # Thumbnails (gitignored)
data/
  randimms.db             # SQLite file (gitignored, auto-created)
```

## 🔐 Upload System — How You Add Videos

### Option 1: Studio UI (Recommended)

1. Go to `/studio`
2. Enter your `UPLOAD_SECRET` (default: `randimms_secret_2024` — change in `.env.local` for production)
3. Choose:
   - **Upload File**: Select mp4/webm/mov from your computer (saved to `public/uploads/videos/`)
   - **From URL**: Paste direct video URL (e.g. `https://.../video.mp4` or external CDN)
4. Fill title, description, category, duration, tags, thumbnail
5. Click Upload — video appears instantly on site

### Option 2: Direct API

```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -F secret=randimms_secret_2024 \
  -F title="My Video" \
  -F description="Awesome video" \
  -F category_id="<category-uuid-from-/api/categories>" \
  -F video_url="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" \
  -F thumbnail_url="https://picsum.photos/640/360" \
  -F duration=596 \
  -F featured=1 \
  -F tagIds='["<tag-id>"]'
```

File upload variant:

```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -F secret=... \
  -F title="My Video" \
  -F category_id="..." \
  -F video=@/path/to/video.mp4 \
  -F thumbnail=@/path/to/thumb.jpg
```

### Option 3: Manual File System

1. Drop video files into `public/uploads/videos/`
2. Drop thumbnails into `public/uploads/thumbs/`
3. Insert record directly via SQLite or via the API with URL mode:
   - `file_path` = `/uploads/videos/yourfile.mp4`
   - `thumbnail_path` = `/uploads/thumbs/yourthumb.jpg`

You can inspect DB with:
```bash
sqlite3 data/randimms.db "SELECT id, title FROM videos LIMIT 5;"
```

## 🗄️ Database Schema

**categories**: id, name, slug (unique), description, created_at  
**tags**: id, name, slug (unique)  
**videos**: id, title, description, category_id FK, file_path, thumbnail_path, duration (sec), views, upload_date, featured (bool), created_at  
**video_tags**: video_id FK, tag_id FK (M2M)

All queries use prepared statements, WAL mode, indexed.

## 🎨 Design

- Dark neutral: `#0a0a0a` background, white/[0.06-0.12] surfaces
- Rounded-full pills for categories, tags
- 16:9 thumbnails with duration overlay, hover scale + play button
- Responsive: 1 col mobile, 2 tablet, 3-4 desktop
- Header: sticky blurred, logo "R" + search bar + upload link

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4
- **DB**: better-sqlite3 (SQLite WAL)
- **Video**: Native HTML5 `<video>` with poster, efficient streaming
- **Storage**: Local FS `public/uploads` or external URLs

No auth system, no admin panel — just secret-protected upload.

## 🌐 URL Structure

- `/` — Home
- `/watch/[id]` — Watch
- `/category/[slug]` — Category (trending, new, popular, technology, etc.)
- `/tag/[slug]` — Tag
- `/search?q=...` — Search
- `/studio` — Private uploader
- `/api/videos`, `/api/categories`, `/api/tags`, `/api/search`

## 📝 Production Checklist

- [ ] Change `UPLOAD_SECRET` in `.env.local` to strong random
- [ ] Set `NODE_ENV=production`
- [ ] Use reverse proxy (nginx) for video range requests if serving large files
- [ ] Consider moving videos to S3/R2 + CDN for scale
- [ ] Backup `data/randimms.db`

## License

MIT — Built for randimms.
