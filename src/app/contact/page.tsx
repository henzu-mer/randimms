import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact randimms - get in touch via email, DMCA, legal, or support.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/50 mb-4">
            GET IN TOUCH
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-bold tracking-tight leading-[0.95]">
            We’d love to
            <br />
            <span className="text-white/40">hear from you</span>
          </h1>
          <p className="mt-4 text-[14px] leading-[1.6] text-white/50 max-w-md">
            Questions, DMCA notices, partnership, or just saying hi? Use the form or email us directly. We typically respond within 24–48 hours.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
              <div className="h-8 w-8 rounded-lg bg-white/[0.08] flex items-center justify-center mb-3 text-[14px]">✉️</div>
              <h3 className="text-[13px] font-semibold text-white">General</h3>
              <p className="mt-1 text-[13px] text-white/50">hello@randimms.example.com</p>
              <p className="mt-1 text-[11px] text-white/30">For general inquiries</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
              <div className="h-8 w-8 rounded-lg bg-white/[0.08] flex items-center justify-center mb-3 text-[14px]">⚖️</div>
              <h3 className="text-[13px] font-semibold text-white">DMCA / Legal</h3>
              <p className="mt-1 text-[13px] text-white/50">dmca@randimms.example.com</p>
              <p className="mt-1 text-[11px] text-white/30">Copyright notices only</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
              <div className="h-8 w-8 rounded-lg bg-white/[0.08] flex items-center justify-center mb-3 text-[14px]">🔒</div>
              <h3 className="text-[13px] font-semibold text-white">Privacy</h3>
              <p className="mt-1 text-[13px] text-white/50">privacy@randimms.example.com</p>
              <p className="mt-1 text-[11px] text-white/30">Privacy questions & requests</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5">
              <div className="h-8 w-8 rounded-lg bg-white/[0.08] flex items-center justify-center mb-3 text-[14px]">🛠️</div>
              <h3 className="text-[13px] font-semibold text-white">Support</h3>
              <p className="mt-1 text-[13px] text-white/50">support@randimms.example.com</p>
              <p className="mt-1 text-[11px] text-white/30">Technical help</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3">
            <div className="shrink-0 h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center">⚠️</div>
            <div className="text-[12px] leading-[1.5] text-amber-200/70">
              <strong className="text-amber-200">For DMCA:</strong> Please include all 6 required elements from our <a href="/dmca" className="underline">DMCA page</a>. Incomplete notices will be rejected.
            </div>
          </div>

          <div className="mt-8 text-[12px] text-white/30 leading-[1.6]">
            <p>📍 123 Streaming Ave, Suite 100, San Francisco, CA 94105, USA</p>
            <p className="mt-1">🕒 Mon–Fri 9am–6pm PST • We aim to reply in 24–48h</p>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
