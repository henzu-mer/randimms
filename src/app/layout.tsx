import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-white/[0.06] mt-16">
          <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between gap-4 text-[13px] text-white/40">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-white flex items-center justify-center">
                  <span className="text-black font-black text-[14px]">R</span>
                </div>
                <span className="font-medium text-white/60">randimms</span>
                <span className="hidden sm:inline">— Stream anything, anytime.</span>
              </div>
              <div className="flex gap-6">
                <span>© {new Date().getFullYear()} randimms</span>
                <span className="hidden sm:inline">Built for discovery</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
