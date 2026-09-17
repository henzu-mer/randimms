import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DMCA / Copyright Policy',
  description: 'DMCA Copyright Policy for randimms - Notice and takedown process, how to submit valid notice, counter-notice information.',
};

export default function DMCAPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-[11px] font-medium text-white/50 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          LEGAL • UPDATED DEC 2024
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-[1.05]">DMCA / Copyright Policy</h1>
        <p className="mt-4 text-[14px] leading-[1.6] text-white/50 max-w-2xl">
          randimms respects the intellectual property rights of others and expects its users to do the same. This policy outlines our notice-and-takedown procedure under the Digital Millennium Copyright Act (DMCA).
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 sm:p-8 space-y-8 text-[14px] leading-[1.7] text-white/70">

          <section>
            <h2 className="text-[18px] font-semibold text-white mb-3">1. Designated Copyright Agent</h2>
            <p>
              If you believe that content on randimms infringes your copyright, please contact our designated agent:
            </p>
            <div className="mt-4 rounded-xl bg-[#0a0a0a] border border-white/[0.06] p-4 font-mono text-[13px]">
              <div><span className="text-white/40">Agent:</span> DMCA Compliance Officer — randimms</div>
              <div><span className="text-white/40">Email:</span> dmca@randimms.example.com</div>
              <div><span className="text-white/40">Address:</span> 123 Streaming Ave, Suite 100, San Francisco, CA 94105, USA</div>
              <div><span className="text-white/40">Phone:</span> +1 (555) 010-2948</div>
            </div>
            <p className="mt-3 text-[12px] text-white/40">
              Please use subject line: “DMCA Takedown Notice – [Your Work Title]”. Only DMCA notices should go to this contact. Other inquiries should use <Link href="/contact" className="text-white underline underline-offset-4">Contact page</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-white mb-3">2. What is a valid DMCA notice?</h2>
            <p>Under 17 U.S.C. §512(c)(3), a valid notification must include:</p>
            <ol className="list-decimal pl-5 mt-3 space-y-2 marker:text-white/30">
              <li><strong className="text-white">Identification of copyrighted work:</strong> Describe the work you claim is infringed (e.g., URL to original, registration number if any).</li>
              <li><strong className="text-white">Identification of infringing material:</strong> Exact URL(s) on randimms where the infringing material appears. Example: https://randimms.example.com/watch/xxxx</li>
              <li><strong className="text-white">Your contact info:</strong> Full legal name, address, phone, email.</li>
              <li><strong className="text-white">Good faith statement:</strong> “I have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.”</li>
              <li><strong className="text-white">Accuracy statement:</strong> “The information in this notification is accurate, and under penalty of perjury, I am the owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.”</li>
              <li><strong className="text-white">Signature:</strong> Physical or electronic signature of owner or authorized agent.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-white mb-3">3. How to submit</h2>
            <p>Send your notice via email to <span className="text-white font-mono">dmca@randimms.example.com</span> with all 6 elements above. Incomplete notices cannot be processed and will be rejected. We aim to acknowledge within 24–48 hours and take action within 3–5 business days.</p>
            <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="text-[12px] text-amber-200/80"><strong>Tip:</strong> Include screenshots and timestamps if applicable. For video, include timecode where infringement occurs.</p>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-white mb-3">4. What happens after you submit?</h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-white/30">
              <li>We review for completeness and validity.</li>
              <li>If valid, we promptly disable access to the allegedly infringing material and notify the uploader (if applicable).</li>
              <li>We may terminate repeat infringers’ ability to upload (even though randimms has no public user accounts, upload privileges via studio can be revoked).</li>
              <li>We preserve records as required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-white mb-3">5. Counter-Notice (If your content was removed)</h2>
            <p>If you believe your content was removed by mistake or misidentification, you may file a counter-notice. It must include:</p>
            <ol className="list-decimal pl-5 mt-3 space-y-2 marker:text-white/30">
              <li>Your full name, address, phone, email</li>
              <li>Identification of material removed and its prior location (URL)</li>
              <li>Statement under penalty of perjury: “I have a good faith belief the removal was due to mistake or misidentification.”</li>
              <li>Statement that you consent to jurisdiction of Federal District Court for your district (or Northern District of California if outside US) and will accept service from complainant.</li>
              <li>Physical or electronic signature</li>
            </ol>
            <p className="mt-3">Send counter-notice to same agent. If valid, we will forward to original complainant and restore material in 10–14 business days unless complainant notifies us of court action.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-white mb-3">6. Repeat Infringer Policy</h2>
            <p>randimms will, in appropriate circumstances, disable and/or terminate accounts or upload access of users who are repeat infringers. We track DMCA history internally.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-white mb-3">7. Misrepresentations</h2>
            <p className="text-white/50 text-[13px]">Under 17 U.S.C. §512(f), any person who knowingly materially misrepresents that material is infringing, or that material was removed by mistake, may be liable for damages including costs and attorney’s fees. Please ensure your notice is accurate.</p>
          </section>

          <section className="pt-6 border-t border-white/[0.06]">
            <h3 className="text-[14px] font-semibold text-white mb-2">Questions?</h3>
            <p className="text-[13px]">For non-DMCA inquiries, please use our <Link href="/contact" className="text-white underline">Contact page</Link>. For legal requests other than DMCA, email legal@randimms.example.com.</p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/terms" className="rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.06] px-4 h-9 flex items-center text-[13px] text-white/70">Terms of Service</Link>
          <Link href="/privacy" className="rounded-full bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.06] px-4 h-9 flex items-center text-[13px] text-white/70">Privacy Policy</Link>
          <Link href="/contact" className="rounded-full bg-white text-black px-4 h-9 flex items-center text-[13px] font-medium">Contact Agent</Link>
        </div>
      </div>
    </div>
  );
}
