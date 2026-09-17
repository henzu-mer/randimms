import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for randimms - rules of use, content ownership, prohibited activities, disclaimer of liability.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/50 mb-4">
          LEGAL • EFFECTIVE DEC 2024
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-[1.05]">Terms of Service</h1>
        <p className="mt-4 text-[14px] leading-[1.6] text-white/50 max-w-2xl">
          Welcome to randimms. By accessing or using our website, you agree to these Terms. If you do not agree, do not use the service. You must be 18+ to use randimms.
        </p>
      </div>

      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 sm:p-8 space-y-8 text-[14px] leading-[1.7] text-white/70">

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">1. Acceptance & Eligibility</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li>You must be at least 18 years old and have legal capacity to enter a contract in your jurisdiction.</li>
            <li>By using randimms, you represent you are 18+ and that you have read and agree to these Terms, our <Link href="/privacy" className="text-white underline">Privacy Policy</Link>, and <Link href="/dmca" className="text-white underline">DMCA Policy</Link>.</li>
            <li>We may modify these Terms at any time. Continued use after changes constitutes acceptance. Check this page periodically.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">2. Service Description</h2>
          <p>randimms is a video streaming platform that allows users to discover, search, and watch videos across categories. We do not require user accounts. Uploads are performed by authorized personnel via a private studio interface protected by a secret key. Videos may be hosted locally or via external URLs/HLS streams.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">3. Content Ownership & License</h2>
          <div className="space-y-3">
            <p><strong className="text-white">Your content:</strong> If you are an authorized uploader (owner), you retain ownership of videos you upload. By uploading, you grant randimms a worldwide, non-exclusive, royalty-free, sublicensable license to host, transcode (including to HLS/adaptive bitrate), store, display, stream, and distribute your content for the purpose of operating the service.</p>
            <p><strong className="text-white">Our content:</strong> Site design, logo, text, graphics, and software are owned by randimms and protected by copyright, trademark, and other laws. You may not copy, modify, or create derivative works without permission.</p>
            <p><strong className="text-white">Third-party content:</strong> Some videos may be licensed from third parties or be public domain samples. All rights remain with respective owners.</p>
          </div>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">4. Acceptable Use & Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-white/30">
            <li>Use the service if you are under 18</li>
            <li>Copy, download, record, or distribute videos except via normal browser caching for personal, non-commercial viewing. Use of downloaders, rippers, or bots is prohibited</li>
            <li>Attempt to bypass age gate, access controls, or upload protection</li>
            <li>Upload or transmit viruses, malware, or spam</li>
            <li>Scrape, crawl, or use automated means to collect content without permission (search engines may crawl with reasonable rate)</li>
            <li>Impersonate others or misrepresent affiliation</li>
            <li>Use the service for illegal purposes, including infringing copyright (see DMCA policy)</li>
            <li>Interfere with or disrupt service, servers, or networks</li>
            <li>Attempt to reverse engineer, decompile, or extract source code</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">5. Age Gate</h2>
          <p>randimms displays an age verification gate requiring confirmation you are 18+. You must not bypass or misrepresent your age. We use localStorage and cookies to remember verification for 60 days. Clearing storage will require re-verification.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">6. Copyright & DMCA</h2>
          <p>We respect copyright. If you believe content infringes your rights, follow our <Link href="/dmca" className="text-white underline">DMCA Policy</Link>. Repeat infringers will have upload privileges terminated.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">7. No User Accounts</h2>
          <p>randimms currently does not offer user registration, login, or profiles. Viewing is anonymous. Upload access is restricted to authorized persons via secret key. If we introduce accounts in the future, additional terms will apply.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">8. Disclaimers</h2>
          <div className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] p-4 space-y-3 text-[13px]">
            <p>THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR AVAILABILITY.</p>
            <p>We do not warrant that service will be uninterrupted, error-free, secure, or that content is accurate. Videos may be removed at any time without notice.</p>
            <p>You are responsible for your internet connection and data charges. Streaming video consumes significant bandwidth.</p>
          </div>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">9. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, RANDIMMS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS, REVENUE, DATA, OR USE, EVEN IF ADVISED OF POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED $100 OR AMOUNT YOU PAID US (WHICH IS $0 FOR FREE VIEWING), WHICHEVER IS GREATER.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">10. Indemnification</h2>
          <p>You agree to indemnify and hold harmless randimms from any claims, damages, losses, liabilities, costs, and expenses (including attorney’s fees) arising from your use of service, violation of these Terms, or infringement of any rights.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">11. Termination</h2>
          <p>We may suspend or terminate access to service at any time, without notice, for any reason, including violation of Terms. You may stop using service at any time. Sections that by nature should survive termination (ownership, disclaimers, liability, indemnification) shall survive.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">12. Governing Law & Disputes</h2>
          <p>These Terms are governed by laws of State of California, USA, without regard to conflict of law principles. Any dispute arising from these Terms or service shall be resolved in state or federal courts located in San Francisco County, California, and you consent to personal jurisdiction there. You agree to first attempt informal resolution by contacting us at legal@randimms.example.com for at least 30 days before filing any action.</p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-white mb-3">13. Miscellaneous</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
            <li><strong className="text-white">Entire Agreement:</strong> These Terms + Privacy + DMCA constitute entire agreement.</li>
            <li><strong className="text-white">Severability:</strong> If any provision is invalid, remaining provisions continue in effect.</li>
            <li><strong className="text-white">No Waiver:</strong> Failure to enforce does not waive right to enforce later.</li>
            <li><strong className="text-white">Assignment:</strong> You may not assign Terms; we may assign without restriction.</li>
            <li><strong className="text-white">Contact:</strong> <Link href="/contact" className="text-white underline">Contact page</Link> or legal@randimms.example.com</li>
          </ul>
        </section>

        <div className="pt-6 border-t border-white/[0.06] text-[12px] text-white/30">
          Last updated: December 17, 2024 • Version 1.1 • If you have questions, contact us.
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/privacy" className="rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.06] px-4 h-9 flex items-center text-[13px] text-white/70">Privacy Policy</Link>
        <Link href="/dmca" className="rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.06] px-4 h-9 flex items-center text-[13px] text-white/70">DMCA</Link>
        <Link href="/contact" className="rounded-full bg-white text-black px-4 h-9 flex items-center text-[13px] font-medium">Contact Us</Link>
      </div>
    </div>
  );
}
