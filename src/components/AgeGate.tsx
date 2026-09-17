'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'randimms_age_verified';
const COOKIE_NAME = 'randimms_age';
const EXPIRY_DAYS = 60; // 60 days

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function getStorageData(): { verified: boolean; timestamp: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data;
  } catch {
    return null;
  }
}

export default function AgeGate() {
  const [isVisible, setIsVisible] = useState<boolean | null>(null); // null = checking, true = show gate, false = hide
  const [checked, setChecked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if already verified
    const data = getStorageData();
    if (data && data.verified) {
      const now = Date.now();
      const ageMs = now - data.timestamp;
      const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (ageMs < expiryMs) {
        // Still valid
        setIsVisible(false);
        return;
      } else {
        // Expired, remove
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Also check cookie as fallback
    const cookies = document.cookie.split(';').map(c => c.trim());
    const ageCookie = cookies.find(c => c.startsWith(`${COOKIE_NAME}=`));
    if (ageCookie) {
      // If cookie exists but localStorage not, we still consider verified (cookie might be older)
      // But we will re-check expiry via cookie? Cookie expiry handled by browser.
      // For simplicity, if cookie exists, hide gate
      setIsVisible(false);
      return;
    }

    // Show gate
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isVisible]);

  const handleEnter = () => {
    if (!checked) return;

    const payload = {
      verified: true,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}

    setCookie(COOKIE_NAME, 'verified', EXPIRY_DAYS);

    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  // While checking, render nothing but block content with black screen to prevent flash
  if (isVisible === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]/95 backdrop-blur-2xl transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 40px)`
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[440px] mx-4">
        <div className="rounded-[24px] bg-[#111111] border border-white/[0.08] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <span className="text-black font-black text-[20px] tracking-tighter">R</span>
              </div>
              <span className="text-[18px] font-bold tracking-tight">randimms</span>
              <span className="ml-auto text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.08] text-white/50">18+ ONLY</span>
            </div>

            <h1 id="age-gate-title" className="text-[28px] font-bold leading-[1.1] tracking-tight">
              Age verification
              <br />
              <span className="text-white/50">required</span>
            </h1>

            <p className="mt-4 text-[14px] leading-[1.6] text-white/60">
              You must be <span className="text-white font-medium">18 years of age or older</span> to enter this site. This platform may contain content suitable only for adults.
            </p>

            <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3">
              <div className="shrink-0 h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              </div>
              <p className="text-[12px] leading-[1.5] text-amber-200/80">
                By entering, you confirm that you are of legal age in your jurisdiction and agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>

          {/* Checkbox */}
          <div className="px-8 pb-2">
            <label className="group flex gap-3 p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.10] cursor-pointer transition-all">
              <div className="relative shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="peer sr-only"
                  id="age-confirm"
                />
                <div className="h-5 w-5 rounded-md border border-white/20 bg-white/[0.06] peer-checked:bg-white peer-checked:border-white flex items-center justify-center transition-all group-hover:border-white/30">
                  <svg className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-medium leading-[1.4] text-white group-hover:text-white transition-colors">
                  I confirm that I am 18 years of age or older
                </span>
                <p className="mt-1 text-[11px] leading-[1.4] text-white/40">
                  I have read and agree to the Terms of Service and Privacy Policy
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="p-8 pt-6">
            <button
              onClick={handleEnter}
              disabled={!checked}
              className="w-full h-[48px] rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
            >
              <span>Enter randimms</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-white/30">
              <a href="/terms" className="hover:text-white/60 transition-colors underline underline-offset-4">Terms</a>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <a href="/privacy" className="hover:text-white/60 transition-colors underline underline-offset-4">Privacy</a>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Secure & private</span>
            </div>

            <p className="mt-6 text-center text-[11px] leading-[1.5] text-white/20">
              This gate will not appear again for {EXPIRY_DAYS} days on this device.
              <br />
              You can clear it anytime via browser storage settings.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-[11px] text-white/20">
          © {new Date().getFullYear()} randimms • Adult content • 18+ only
        </p>
      </div>
    </div>
  );
}
