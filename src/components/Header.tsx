'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SuggestVideo {
  id: string;
  title: string;
  thumbnail_path: string;
}

export default function Header() {
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestVideo[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      setShowSuggest(false);
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim() || q.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSuggestions((data.videos || []).slice(0, 5));
        setShowSuggest(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/[0.08]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[64px] items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-black text-[18px] tracking-tighter">R</span>
            </div>
            <span className="text-[20px] font-bold tracking-tight text-white hidden sm:block">
              randimms
            </span>
          </Link>

          {/* Search */}
          <div ref={wrapperRef} className="flex-1 max-w-[640px] mx-auto relative">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => q.length >= 2 && setShowSuggest(true)}
                  placeholder="Search videos, tags, topics..."
                  className="w-full h-10 pl-11 pr-20 rounded-full bg-white/[0.08] border border-white/[0.08] text-white placeholder:text-white/40 text-[14px] focus:outline-none focus:bg-white/[0.12] focus:border-white/20 transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button type="submit" className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-white text-black text-[13px] font-medium hover:bg-white/90 transition-colors">
                  Search
                </button>
              </div>
            </form>

            {/* Suggestions */}
            {showSuggest && suggestions.length > 0 && (
              <div className="absolute top-[48px] left-0 right-0 rounded-2xl bg-[#151515] border border-white/[0.08] shadow-2xl overflow-hidden z-50">
                <div className="p-2">
                  {suggestions.map((v) => (
                    <Link
                      key={v.id}
                      href={`/watch/${v.id}`}
                      onClick={() => setShowSuggest(false)}
                      className="flex gap-3 p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
                    >
                      <img src={v.thumbnail_path} alt="" className="w-20 aspect-video object-cover rounded-lg bg-zinc-800" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium leading-tight line-clamp-2 text-white">{v.title}</div>
                        <div className="text-[11px] text-white/40 mt-1">Watch now →</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-white/[0.06] p-2">
                  <button
                    onClick={() => {
                      setShowSuggest(false);
                      router.push(`/search?q=${encodeURIComponent(q)}`);
                    }}
                    className="w-full h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-[13px] font-medium text-white/70 hover:text-white transition-colors"
                  >
                    See all results for "{q}"
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/studio" className="hidden sm:flex h-9 px-4 items-center rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-[13px] font-medium transition-colors border border-white/[0.08]">
              <span className="mr-1.5">＋</span> Upload
            </Link>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
