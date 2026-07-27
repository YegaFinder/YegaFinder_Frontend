import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export const metadata = { title: `Privacy Policy — ${siteConfig.name}` };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-yegna-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Link href={ROUTES.HOME} className="text-sm font-medium text-yegna-primary hover:underline">
          ← Back to {siteConfig.name}
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-yegna-navy">YegnaFinder Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Effective Date: July 9, 2026</p>

        <div className="prose prose-sm mt-8 max-w-none space-y-6 text-foreground">
          <p>
            Phoenixopia Solution PLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) values your
            privacy. This Privacy Policy explains how YegnaFinder collects, uses, stores, and protects your
            personal information.
          </p>

          <section>
            <h2 className="text-lg font-semibold">1. Information We Collect</h2>
            <p>We may collect:</p>

            <p className="font-medium">Personal Information</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Profile photo</li>
              <li>Password (stored in encrypted form)</li>
            </ul>

            <p className="font-medium">Business Information</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Business name</li>
              <li>Business address</li>
              <li>Contact information</li>
              <li>Business license (where required)</li>
            </ul>

            <p className="font-medium">Device Information</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>App version</li>
            </ul>

            <p className="font-medium">Location Information</p>
            <p>
              With your permission, we may collect your location to help you discover nearby businesses,
              parking, fuel stations, hotels, restaurants, and events.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Create and manage your account.</li>
              <li>Authenticate your identity.</li>
              <li>Improve our Services.</li>
              <li>Provide personalized recommendations.</li>
              <li>Send verification codes and service notifications.</li>
              <li>Prevent fraud and abuse.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Cookies and Similar Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Keep you signed in.</li>
              <li>Remember your preferences.</li>
              <li>Improve performance.</li>
              <li>Analyze platform usage.</li>
            </ul>
            <p>You may disable cookies in your browser, although some features may not function properly.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Sharing Information</h2>
            <p>We do not sell your personal information.</p>
            <p>We may share information with:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Trusted service providers supporting our platform.</li>
              <li>Payment processors.</li>
              <li>Government authorities when legally required.</li>
              <li>Business partners only when necessary to provide requested services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Encrypted HTTPS connections.</li>
              <li>Secure password hashing.</li>
              <li>Role-based access control.</li>
              <li>Secure cloud infrastructure.</li>
              <li>Regular security monitoring.</li>
            </ul>
            <p>No system is completely secure, but we work continuously to protect your information.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Data Retention</h2>
            <p>We retain your information only as long as necessary to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide our Services.</li>
              <li>Meet legal obligations.</li>
              <li>Resolve disputes.</li>
              <li>Enforce our agreements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Your Rights</h2>
            <p>You may:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Access your personal data.</li>
              <li>Update inaccurate information.</li>
              <li>Delete your account (subject to legal obligations).</li>
              <li>Request a copy of your personal information.</li>
              <li>Withdraw consent for optional data processing where applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Children&apos;s Privacy</h2>
            <p>
              Our Services are not intended for children under 13 years of age. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Third-Party Services</h2>
            <p>
              Our Services may include links to third-party websites or services. We are not responsible
              for their privacy practices or content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. International Data Processing</h2>
            <p>
              Your information may be processed on secure cloud servers located outside Ethiopia. By using
              the Services, you consent to such processing where permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">11. Updates to This Privacy Policy</h2>
            <p>
              We may revise this Privacy Policy from time to time. The updated version will be published
              with a revised effective date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">12. Contact Us</h2>
            <p>Phoenixopia Solution PLC</p>
          </section>
        </div>
      </div>
    </div>
  );
}