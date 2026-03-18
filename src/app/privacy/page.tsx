import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import SectionHeading from "@/components/ui/SectionHeading";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = createMetadata(
  "Privacy Policy",
  `Privacy policy for ${BUSINESS.name}. Learn how we collect, use, and protect your information.`,
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading subtitle="Last updated: March 18, 2026">
          Privacy Policy
        </SectionHeading>

        <div className="mt-12 space-y-8 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Information We Collect</h2>
            <p>
              When you contact us for windshield repair services, we may collect your name,
              phone number, email address, vehicle information, and service location. This
              information is used solely to provide and improve our repair services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To schedule and perform windshield repair services</li>
              <li>To communicate with you about your service appointment</li>
              <li>To process payments and send invoices</li>
              <li>To send service reminders and follow-ups</li>
              <li>To improve our services and customer experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may
              share information with trusted service providers who assist us in operating our
              business (such as payment processors and scheduling tools), but only as necessary
              to provide our services to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. However, no
              method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Cookies &amp; Analytics</h2>
            <p>
              Our website may use cookies and similar technologies to improve your browsing
              experience and analyze site traffic. You can control cookie settings through
              your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Facebook &amp; Social Media</h2>
            <p>
              We use Facebook and other social media platforms to communicate with customers
              and share updates about our services. When you interact with us on these platforms,
              their respective privacy policies apply. Our Facebook app (&quot;Amelia&quot;) may access
              page messaging and posting features to respond to customer inquiries and share
              service updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information
              at any time by contacting us. We will respond to your request within a reasonable
              timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact Us</h2>
            <p>
              If you have questions about this privacy policy or how we handle your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Email: <a href={`mailto:${BUSINESS.email}`} className="text-red-500 hover:text-red-400">{BUSINESS.email}</a></li>
              <li>Phone: <a href={`tel:${BUSINESS.phone}`} className="text-red-500 hover:text-red-400">{BUSINESS.phone}</a></li>
              <li>Location: {BUSINESS.address.city}, {BUSINESS.address.state}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on
              this page with an updated revision date. Continued use of our services after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
