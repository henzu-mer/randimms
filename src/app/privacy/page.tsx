import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for randimms - what data is collected, cookies, analytics, how data is used, user rights.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/50 mb-4">
          LEGAL • UPDATED DEC 2024
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-[1.05]">Privacy Policy</h1>
        <p className="mt-4 text-[14px] leading-[1.6] text-white/50 max-w-2xl">
          At randimms, privacy matters. This policy explains what data we collect (very little), how we use cookies, and your rights. We aim for minimal data collection — no accounts, no tracking profiles.
        </p>
      </div>

      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 sm:p-8 space-y-8 text-[14px] leading-[1.7] text-white/70">

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">1. Overview — Minimal Data Philosophy</h2>
          <p>randimms is designed to be privacy-friendly:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-white/30">
            <li>No user accounts, no login, no passwords to leak</li>
            <li>No requirement to provide name, email, or personal info to watch videos</li>
            <li>No selling of personal data</li>
            <li>No third-party ad trackers (by default)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">2. What Data Do We Collect?</h2>

          <h3 className="text-[14px] font-semibold text-white mt-4 mb-2">a) Data you provide voluntarily</h3>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li><strong className="text-white">Contact form / emails:</strong> If you contact us via <Link href="/contact" className="text-white underline">Contact page</Link> or email, we collect your message, email, and any info you provide. Used only to respond.</li>
            <li><strong className="text-white">Upload metadata (owner only):</strong> Title, description, tags, thumbnails you upload via private studio. Not public personal data.</li>
          </ul>

          <h3 className="text-[14px] font-semibold text-white mt-4 mb-2">b) Automatically collected (technical)</h3>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li><strong className="text-white">View counts:</strong> We increment an anonymous counter when a video page is visited. No IP stored in counter, just +1.</li>
            <li><strong className="text-white">Server logs:</strong> Like most websites, our hosting provider may log IP address, user agent, timestamp, requested URL for security and debugging. Logs are rotated and not used for profiling. Retained max 30 days.</li>
            <li><strong className="text-white">No precise location:</strong> We do not collect GPS. IP may give approximate city-level location via hosting logs only.</li>
          </ul>

          <h3 className="text-[14px] font-semibold text-white mt-4 mb-2">c) What we do NOT collect</h3>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li>No account database (because no accounts)</li>
            <li>No credit cards (service is free)</li>
            <li>No biometric data</li>
            <li>No cross-site tracking profile</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">3. Cookies & Local Storage</h2>
          <p>We use minimal storage:</p>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full text-[13px]">
              <thead className="bg-white/[0.04] text-white/50 text-[11px] uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Purpose</th>
                  <th className="text-left p-3 font-medium">Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                <tr>
                  <td className="p-3 font-mono text-white">randimms_age</td>
                  <td className="p-3">Cookie</td>
                  <td className="p-3">Remembers age verification to avoid showing gate repeatedly</td>
                  <td className="p-3">60 days</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-white">randimms_age_verified</td>
                  <td className="p-3">localStorage</td>
                  <td className="p-3">Same as above, client-side flag with timestamp</td>
                  <td className="p-3">60 days (checked in JS)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-white">randimms_upload_secret</td>
                  <td className="p-3">localStorage</td>
                  <td className="p-3">Remembers studio secret on your device only if you tick “remember” (optional). Never sent to server except when uploading.</td>
                  <td className="p-3">Until cleared</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-white">randimms_player_*</td>
                  <td className="p-3">localStorage</td>
                  <td className="p-3">Player preferences: volume, playback speed, quality choice</td>
                  <td className="p-3">Until cleared</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[13px] text-white/50">
            No third-party analytics cookies by default. If we add analytics (e.g., privacy-friendly Plausible or Umami) in future, we will update this policy and keep it cookie-free.
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">4. How We Use Data</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li>To operate and secure the service (logs for abuse prevention)</li>
            <li>To count views and show popular videos</li>
            <li>To respond to contact inquiries and DMCA notices</li>
            <li>To remember age gate and player preferences (local to your device)</li>
            <li>To improve performance (e.g., which videos are popular, to pre-cache)</li>
          </ul>
          <p className="mt-3">We do <strong className="text-white">not</strong> use data for targeted advertising or sell it.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">5. Video Delivery & CDN</h2>
          <p>Videos may be served directly from our server (<code className="bg-white/[0.08] px-1.5 py-0.5 rounded font-mono text-[12px]">/uploads/</code>) or from external URLs / HLS streams. If you use an external URL (e.g., CDN, S3, Bunny.net, Cloudflare Stream), that provider’s privacy policy applies to video delivery. We recommend using privacy-friendly CDN with no tracking. HLS (.m3u8) playback uses hls.js in browser — no data sent to hls.js vendor.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">6. Third Parties</h2>
          <p>Currently, randimms loads:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-white/30">
            <li><strong className="text-white">Self-hosted assets:</strong> All JS/CSS from our domain</li>
            <li><strong className="text-white">Video thumbnails:</strong> May be from external sources (Unsplash, etc.) for sample data — those requests go to those hosts and their privacy policies apply. In production with your own uploads, thumbnails are self-hosted.</li>
            <li><strong className="text-white">Video files:</strong> Sample videos from gtv-videos-bucket (Google). Production should use self-hosted or your own CDN.</li>
          </ul>
          <p className="mt-3">We do not embed third-party ad networks.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">7. Data Retention</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li>Server logs: up to 30 days</li>
            <li>Contact emails: until resolved + up to 1 year for legal record</li>
            <li>DMCA notices: up to 3 years as required by law</li>
            <li>View counts: indefinite (anonymous aggregate)</li>
            <li>LocalStorage / cookies: on your device until you clear or expiry (60 days for age gate)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">8. Your Rights</h2>
          <p>Depending on jurisdiction (GDPR, CCPA, etc.), you may have rights to:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-white/30">
            <li>Access, correct, or delete personal data we hold (mostly contact emails you sent)</li>
            <li>Object to processing or request restriction</li>
            <li>Withdraw consent (by clearing cookies/localStorage and not using service)</li>
            <li>Lodge complaint with supervisory authority</li>
          </ul>
          <p className="mt-3">To exercise, contact us at privacy@randimms.example.com or via <Link href="/contact" className="text-white underline">Contact page</Link>. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">9. Children’s Privacy</h2>
          <p>randimms is intended for adults 18+. We do not knowingly collect data from children under 18. If you are under 18, do not use service. If you believe a child has provided data, contact us to delete.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">10. Security</h2>
          <p>We use reasonable measures: HTTPS, secure headers, secret-protected upload, SQLite with prepared statements. No system is 100% secure — use at your own risk. Upload secret should be strong and kept private.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">11. International Transfers</h2>
          <p>Service may be hosted in US or other regions. If you access from outside, your data (e.g., contact email) may be transferred to US where laws may differ. By using service, you consent to such transfer.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">12. Changes to Policy</h2>
          <p>We may update this policy. We will post new version with updated date and, if material, show notice on site. Continued use after changes means acceptance.</p>
        </section>

        <section className="pt-6 border-t border-white/[0.06]">
          <h3 className="text-[14px] font-semibold text-white mb-2">Contact</h3>
          <p className="text-[13px]">Privacy questions: privacy@randimms.example.com • Legal: legal@randimms.example.com • DMCA: dmca@randimms.example.com • Or via <Link href="/contact" className="text-white underline">Contact page</Link></p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/terms" className="rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.06] px-4 h-9 flex items-center text-[13px] text-white/70">Terms</Link>
        <Link href="/dmca" className="rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.06] px-4 h-9 flex items-center text-[13px] text-white/70">DMCA</Link>
        <Link href="/contact" className="rounded-full bg-white text-black px-4 h-9 flex items-center text-[13px] font-medium">Contact</Link>
      </div>
    </div>
  );
}
