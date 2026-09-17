# randimms — Modern Video Streaming Platform

A fully functional, dynamic video streaming website built with Next.js 16, React 19, Tailwind CSS 4, SQLite, and HLS.js — optimized like LuluStream and premium OTT platforms.

![randimms](https://img.shields.io/badge/randimms-streaming-black?style=for-the-badge)
![HLS](https://img.shields.io/badge/HLS-adaptive-red?style=for-the-badge)
![18+](https://img.shields.io/badge/18%2B-age%20gate-amber?style=for-the-badge)

## ✨ Features

### Core Streaming
- **Home Page** — Featured hero, trending, recent, popular sections with responsive grid, lazy thumbnails
- **Watch Page** — Premium HLS-enabled player with quality selector, speed, PiP, fullscreen, keyboard shortcuts (`/watch/[id]`)
- **Categories** — Trending, New, Popular + topic categories (Tech, Music, Gaming, etc.) (`/category/[slug]`)
- **Tags** — Clickable tags showing related videos (`/tag/[slug]`)
- **Search** — Full-text search across titles, descriptions, tags with live suggestions (`/search?q=...`)
- **Studio / Upload** — Private, secure upload system (`/studio`) — no login, just secret key, supports mp4 + HLS .m3u8

### Compliance & Legal (New)
- **Age Gate (18+)** — Full-screen modal on first visit, checkbox confirmation, 60-day cookie + localStorage expiry, blocks all content behind it
- **DMCA / Copyright** (`/dmca`) — Notice-and-takedown, counter-notice, designated agent
- **Terms of Service** (`/terms`) — Rules, ownership, prohibited activities, disclaimers
- **Privacy Policy** (`/privacy`) — Minimal data, cookies table, rights, retention
- **Contact** (`/contact`) — Form + email addresses, saves to `data/contact_messages.jsonl`
- **About** (`/about`) — Story, tech stack, roadmap
- **Footer** — Links to all legal pages, browse, categories

### Performance & Player (LuluStream-style)
- **HLS Adaptive Streaming** — `hls.js` with auto quality, manual selector, fast start, low latency mode, native Safari fallback
- **Premium Player** — Custom controls: play/pause, progress with buffered, volume, speed (0.5x–2x), quality (Auto + levels), PiP, fullscreen, center play button, keyboard shortcuts (Space/K, M, F, I, ←→ seek 5s, ↑↓ volume, 0-9 % seek, ,/. speed)
- **Optimizations** — Lazy thumbnails (`loading="lazy"`, `decoding="async"`), AVIF/WebP via next/image, content-visibility, Turbopack, SQLite WAL + indexes, efficient queries, CDN-ready headers (.m3u8 short cache, .ts/mp4 long cache), Accept-Ranges
- **UX Polish** — Dark premium theme, large thumbnails, duration overlays, HLS badges, hover scale + play, smooth related videos, mobile-first touch-friendly, accessibility (focus-visible, alt texts, reduced-motion)
- **SEO** — Proper titles, meta, OpenGraph, sitemap, robots (disallows /studio, /api/admin)

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

On first run, SQLite DB auto-creates at `data/randimms.db` and seeds with:
- 10 categories
- 15 tags
- 14 sample videos (public domain from gtv-videos-bucket)

## 🔞 Age Gate

- Full-screen modal appears **before any content** on first visit
- Requires ticking: “I confirm that I am 18 years of age or older” + Enter button (disabled until checked)
- Sets `randimms_age_verified` in localStorage (JSON with timestamp) + `randimms_age=verified` cookie, 60-day expiry
- Blocks scroll, backdrop blur, no thumbnails/player visible behind
- Clears after 60 days or when user clears storage

Implementation: `src/components/AgeGate.tsx` — added to `layout.tsx` as first child.

## 📁 Project Structure

```
src/
  app/
    page.tsx              # Home
    layout.tsx            # Root + Header + AgeGate + Footer + SEO
    globals.css           # Dark theme + perf + a11y
    watch/[id]/page.tsx   # Premium player + related
    category/[slug]/page.tsx
    tag/[slug]/page.tsx
    search/page.tsx
    studio/page.tsx       # Private uploader (file + HLS URL)
    dmca/page.tsx         # Legal
    terms/page.tsx
    privacy/page.tsx
    contact/page.tsx + ContactForm.tsx
    about/page.tsx
    loading.tsx           # Skeleton
    watch/[id]/loading.tsx
    sitemap.ts, robots.ts
    api/
      videos/, videos/[id]/, videos/[id]/view
      categories/, tags/, search/
      admin/upload/       # Secure upload (mp4, HLS)
      contact/            # Saves messages
  components/
    AgeGate.tsx           # 18+ gate
    Header.tsx            # Logo + live search suggestions
    VideoCard.tsx         # Lazy, HLS badge, hover play
    VideoGrid.tsx         # content-visibility
    VideoPlayer.tsx       # HLS.js + custom controls + shortcuts
    CategoryNav.tsx
    TagList.tsx
  lib/
    db.ts, types.ts, utils.ts
public/uploads/videos/, thumbs/ (gitignored)
data/randimms.db, contact_messages.jsonl (gitignored)
```

## 🔐 Upload System

### Studio UI (Recommended)
1. Go to `/studio`, enter `UPLOAD_SECRET` (default `randimms_secret_2024`)
2. Choose:
   - **Upload File**: mp4/webm/mov (saves to `public/uploads/videos/`)
   - **From URL**: Paste mp4, **HLS .m3u8**, Bunny CDN, Cloudflare Stream, S3, etc. — player auto-detects HLS and shows quality selector
3. Fill title, description, category, duration, tags, thumbnail
4. Upload — appears instantly

### HLS Example
If you have HLS: upload .ts segments to CDN (e.g., Bunny, R2), get playlist URL `https://cdn.example.com/video/playlist.m3u8`, paste in URL mode. Player uses `hls.js` with lowLatencyMode, auto quality, manual override, and caches.

### Direct API
```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -F secret=randimms_secret_2024 \
  -F title="My HLS Video" \
  -F video_url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" \
  -F category_id="<uuid>" -F duration=600
```

## 🗄️ Database

**categories**: id, name, slug, description, created_at  
**tags**: id, name, slug  
**videos**: id, title, description, category_id FK, file_path (mp4 or .m3u8), thumbnail_path, duration, views, upload_date, featured, created_at  
**video_tags**: M2M

WAL mode, indexes on category, views, upload_date, title. Queries use prepared statements.

## 🎨 Design & Performance

- Dark `#0a0a0a`, white/[0.04-0.12] surfaces, rounded-full pills
- 16:9 thumbnails, duration overlay, HLS badge, hover scale
- Responsive: 1 col mobile, 2 tablet, 3-4 desktop
- Header: sticky blurred, live search dropdown
- Player: custom controls, fast start (preload=metadata), volume/speed/quality remembered in localStorage
- Caching headers: .m3u8 (10s), .ts/mp4 (1y immutable), images (1d + stale-while-revalidate)
- CDN-ready: external URLs allowed, CORS headers for HLS
- Accessibility: keyboard nav, focus-visible, alt texts, reduced-motion, aria-labels

## 🔧 Tech Stack

- **Framework**: Next.js 16 App Router, Turbopack
- **UI**: React 19, Tailwind 4
- **DB**: better-sqlite3 SQLite WAL
- **Video**: HLS.js + native HTML5, adaptive bitrate
- **Storage**: Local FS or external CDN/S3/R2

No auth, no admin panel — secret-protected upload + age gate.

## 🌐 URLs

- `/` Home
- `/watch/[id]` Watch (HLS)
- `/category/[slug]` Category
- `/tag/[slug]` Tag
- `/search?q=...` Search
- `/studio` Uploader
- `/dmca`, `/terms`, `/privacy`, `/contact`, `/about`
- `/api/videos`, `/api/categories`, `/api/tags`, `/api/search`, `/api/contact`

## 📝 Production Checklist

- [ ] Change `UPLOAD_SECRET` to strong random
- [ ] Set `NEXT_PUBLIC_BASE_URL` for sitemap
- [ ] Use nginx for range requests if serving large files locally
- [ ] Move videos to S3/R2 + CDN (Bunny, Cloudflare) for scale, use HLS transcoding (ffmpeg)
- [ ] Backup `data/randimms.db` and `data/contact_messages.jsonl`
- [ ] Ensure HTTPS, secure headers (already set)
- [ ] Test age gate expiry, legal pages

## License

MIT — Built for randimms.
