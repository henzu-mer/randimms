import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import AgeGate from "@/components/AgeGate";

export const metadata: Metadata = {
  title: {
    default: "randimms — Stream anything, anytime",
    template: "%s — randimms",
  },
  description: "Modern video streaming platform. Discover trending, new, and popular videos across technology, music, gaming, and more.",
  keywords: ["video", "streaming", "randimms", "watch", "trending", "technology", "music", "gaming"],
  authors: [{ name: "randimms" }],
  openGraph: {
    title: "randimms — Stream anything, anytime",
    description: "Modern video streaming platform",
    type: "website",
    siteName: "randimms",
  },
  twitter: {
    card: "summary_large_image",
    title: "randimms",
    description: "Modern video streaming platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased bg-[#0a0a0a] text-white min-h-screen flex flex-col font-sans`}>
        <AgeGate />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-white/[0.06] mt-16">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-black font-black text-[14px]">R</span>
                  </div>
                  <span className="text-[16px] font-bold tracking-tight">randimms</span>
                </div>
                <p className="text-[13px] leading-[1.6] text-white/40 max-w-[280px]">
                  Modern video streaming platform. Discover trending, new, and popular videos across technology, music, gaming, and more. Stream anything, anytime.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/30">18+ ONLY</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/30">HLS READY</span>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold tracking-widest text-white/20 uppercase mb-3">Browse</h4>
                <ul className="space-y-2.5 text-[13px] text-white/50">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="/category/trending" className="hover:text-white transition-colors">Trending</a></li>
                  <li><a href="/category/new" className="hover:text-white transition-colors">New</a></li>
                  <li><a href="/category/popular" className="hover:text-white transition-colors">Popular</a></li>
                  <li><a href="/search" className="hover:text-white transition-colors">Search</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold tracking-widest text-white/20 uppercase mb-3">Categories</h4>
                <ul className="space-y-2.5 text-[13px] text-white/50">
                  <li><a href="/category/technology" className="hover:text-white transition-colors">Technology</a></li>
                  <li><a href="/category/music" className="hover:text-white transition-colors">Music</a></li>
                  <li><a href="/category/gaming" className="hover:text-white transition-colors">Gaming</a></li>
                  <li><a href="/category/education" className="hover:text-white transition-colors">Education</a></li>
                  <li><a href="/category/entertainment" className="hover:text-white transition-colors">Entertainment</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[12px] font-semibold tracking-widest text-white/20 uppercase mb-3">Legal</h4>
                <ul className="space-y-2.5 text-[13px] text-white/50">
                  <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="/dmca" className="hover:text-white transition-colors">DMCA</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between gap-4 text-[12px] text-white/30">
              <div className="flex flex-wrap gap-4">
                <span>© {new Date().getFullYear()} randimms. All rights reserved.</span>
                <span className="hidden sm:inline">•</span>
                <span>Built for discovery • HLS • 18+ • Secure streaming</span>
              </div>
              <div className="flex gap-4">
                <span className="hidden sm:inline">Made with care for video lovers</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
