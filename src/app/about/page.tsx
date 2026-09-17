import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About randimms',
  description: 'About randimms — modern video streaming platform focused on discovery, performance, and privacy.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/50 mb-4">
          OUR STORY
        </div>
        <h1 className="text-[36px] sm:text-[48px] font-bold tracking-tight leading-[0.95]">
          Stream anything,
          <br />
          <span className="text-white/40">anytime.</span>
        </h1>
        <p className="mt-6 text-[16px] leading-[1.6] text-white/60 max-w-2xl">
          randimms is a modern, fast, privacy-friendly video streaming platform built for discovery. No accounts, no clutter — just videos, categories, and a player that works.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6">
          <div className="h-10 w-10 rounded-xl bg-white/[0.08] flex items-center justify-center mb-4">⚡</div>
          <h3 className="text-[14px] font-semibold text-white mb-2">Fast & Modern</h3>
          <p className="text-[13px] leading-[1.6] text-white/50">Turbopack, HLS adaptive streaming, lazy thumbnails, efficient SQLite. Built like LuluStream and premium platforms.</p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6">
          <div className="h-10 w-10 rounded-xl bg-white/[0.08] flex items-center justify-center mb-4">🔒</div>
          <h3 className="text-[14px] font-semibold text-white mb-2">Privacy First</h3>
          <p className="text-[13px] leading-[1.6] text-white/50">No accounts, no tracking profiles, minimal cookies. Age gate only. Your viewing is yours.</p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6">
          <div className="h-10 w-10 rounded-xl bg-white/[0.08] flex items-center justify-center mb-4">🎬</div>
          <h3 className="text-[14px] font-semibold text-white mb-2">Creator Friendly</h3>
          <p className="text-[13px] leading-[1.6] text-white/50">Private studio upload via secret key, supports mp4/webm/HLS, thumbnails, tags, categories, featured.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 sm:p-8 space-y-6 text-[14px] leading-[1.7] text-white/70">
        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">Why randimms?</h2>
          <p>
            We got tired of bloated video sites with 10 popups, forced logins, and players that buffer forever. randimms is our answer: a clean, dark, premium-feeling streaming site that loads fast, plays instantly, and respects both viewers and creators.
          </p>
          <p className="mt-3">
            Inspired by the best of modern streaming — LuluStream, Vimeo, and premium OTT platforms — but open and self-hostable. You own your videos, your database, your secret key.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">Tech Stack</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li><strong className="text-white">Frontend:</strong> Next.js 16 App Router, React 19, Tailwind CSS 4, HLS.js for adaptive streaming</li>
            <li><strong className="text-white">Backend:</strong> Next.js API routes, SQLite (better-sqlite3, WAL mode), Node.js</li>
            <li><strong className="text-white">Player:</strong> Custom HTML5 player with HLS, quality selector, speed, PiP, fullscreen, keyboard shortcuts, mobile touch</li>
            <li><strong className="text-white">Storage:</strong> Local filesystem (public/uploads) or external URLs / CDN / S3 / Bunny / Cloudflare Stream ready</li>
            <li><strong className="text-white">Security:</strong> Secret-protected upload, age gate with 60-day cookie/localStorage, no public accounts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">Features at a Glance</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-[13px]">
            <div className="flex gap-2"><span className="text-white">✓</span> Featured hero, trending, recent, popular</div>
            <div className="flex gap-2"><span className="text-white">✓</span> Watch page with related videos</div>
            <div className="flex gap-2"><span className="text-white">✓</span> Categories & tags with dedicated pages</div>
            <div className="flex gap-2"><span className="text-white">✓</span> Real-time search with suggestions</div>
            <div className="flex gap-2"><span className="text-white">✓</span> HLS adaptive bitrate support</div>
            <div className="flex gap-2"><span className="text-white">✓</span> Age gate (18+) with expiry</div>
            <div className="flex gap-2"><span className="text-white">✓</span> DMCA, Terms, Privacy, Contact, About</div>
            <div className="flex gap-2"><span className="text-white">✓</span> Responsive, accessible, SEO-friendly</div>
          </div>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">Roadmap</h2>
          <p>We’re planning: playlists, watch later (local), subtitle support (VTT), multi-quality upload transcoding, analytics dashboard, and optional user accounts. Want to contribute? Contact us.</p>
        </section>

        <section className="pt-6 border-t border-white/[0.06]">
          <h3 className="text-[14px] font-semibold text-white mb-2">Contact & Legal</h3>
          <p className="text-[13px]">Questions? Reach us via <Link href="/contact" className="text-white underline">Contact page</Link>. For legal: <Link href="/terms" className="text-white underline">Terms</Link>, <Link href="/privacy" className="text-white underline">Privacy</Link>, <Link href="/dmca" className="text-white underline">DMCA</Link>.</p>
        </section>
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/[0.08] p-8 text-center">
        <h3 className="text-[20px] font-bold tracking-tight">Ready to dive in?</h3>
        <p className="mt-2 text-[14px] text-white/60 max-w-md mx-auto">Discover trending videos, explore categories, or upload your own via private studio.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="h-10 px-6 rounded-full bg-white text-black text-[14px] font-medium flex items-center hover:bg-white/90">Browse videos</Link>
          <Link href="/contact" className="h-10 px-6 rounded-full bg-white/[0.08] border border-white/[0.08] text-[14px] font-medium flex items-center hover:bg-white/[0.12]">Get in touch</Link>
        </div>
      </div>
    </div>
  );
}
