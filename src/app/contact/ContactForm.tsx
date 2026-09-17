'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', text: 'Please fill name, email, and message.' });
      return;
    }

    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send');

      setStatus({ type: 'success', text: 'Message sent! We’ll reply within 24–48h. For urgent DMCA, email dmca@randimms.example.com directly.' });
      setForm({ name: '', email: '', subject: '', message: '', type: 'general' });
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Failed to send message. Please email us directly at hello@randimms.example.com' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-white/[0.04] border border-white/[0.08] p-6 sm:p-8">
      <h2 className="text-[18px] font-semibold tracking-tight mb-1">Send a message</h2>
      <p className="text-[13px] text-white/40 mb-6">We’ll get back to you quickly. No spam.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-white/60 uppercase tracking-widest mb-1.5 block">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full h-11 px-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-white/60 uppercase tracking-widest mb-1.5 block">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full h-11 px-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-white/60 uppercase tracking-widest mb-1.5 block">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full h-11 px-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:border-white/20"
          >
            <option value="general" className="bg-[#0a0a0a]">General inquiry</option>
            <option value="dmca" className="bg-[#0a0a0a]">DMCA / Copyright</option>
            <option value="privacy" className="bg-[#0a0a0a]">Privacy request</option>
            <option value="support" className="bg-[#0a0a0a]">Technical support</option>
            <option value="partnership" className="bg-[#0a0a0a]">Partnership</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-white/60 uppercase tracking-widest mb-1.5 block">Subject</label>
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="How can we help?"
            className="w-full h-11 px-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-white/60 uppercase tracking-widest mb-1.5 block">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us more..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20 resize-none"
            required
          />
          <p className="mt-1.5 text-[11px] text-white/30">{form.message.length}/2000</p>
        </div>

        {status && (
          <div className={`rounded-xl px-4 py-3 text-[13px] leading-[1.5] ${status.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
            {status.text}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full h-12 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending...' : 'Send message'}
        </button>

        <p className="text-[11px] leading-[1.5] text-white/30 text-center">
          By sending, you agree to our <a href="/terms" className="underline text-white/50 hover:text-white/70">Terms</a> and <a href="/privacy" className="underline text-white/50 hover:text-white/70">Privacy</a>. We never share your email.
        </p>
      </form>
    </div>
  );
}
