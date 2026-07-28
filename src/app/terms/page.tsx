import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export const metadata = { title: `Terms of Service — ${siteConfig.name}` };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-yegna-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Link href={ROUTES.HOME} className="text-sm font-medium text-yegna-primary hover:underline">
          ← Back to {siteConfig.name}
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-yegna-navy">YegnaFinder Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Effective Date: July 9, 2026</p>

        <div className="prose prose-sm mt-8 max-w-none space-y-6 text-foreground">
          <p>
            Welcome to YegnaFinder. These Terms of Service (&quot;Terms&quot;) govern your access to and use
            of the YegnaFinder website, mobile applications, and related services (collectively, the
            &quot;Services&quot;). By creating an account or using our Services, you agree to be bound by
            these Terms.
          </p>

          <section>
            <h2 className="text-lg font-semibold">1. About YegnaFinder</h2>
            <p>
              YegnaFinder is a digital platform developed by Phoenixopia Solution PLC that connects users
              with businesses, vendors, services, restaurants, hotels, events, parking, and other local
              experiences throughout Ethiopia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Eligibility</h2>
            <p>
              You must be at least 18 years old or have permission from a parent or legal guardian to use
              our Services.
            </p>
            <p>By registering an account, you confirm that:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>The information you provide is accurate and complete.</li>
              <li>You will keep your account information up to date.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. User Accounts</h2>
            <p>You are responsible for all activities that occur under your account.</p>
            <p>You agree not to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Share your password with others.</li>
              <li>Create fake or misleading accounts.</li>
              <li>Use another person&apos;s account without permission.</li>
              <li>Attempt unauthorized access to other accounts or systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Business Listings</h2>
            <p>
              Business owners are responsible for ensuring that all information submitted is accurate,
              lawful, and current.
            </p>
            <p>Phoenixopia Solution PLC reserves the right to review, edit, suspend, or remove listings that:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Contain false or misleading information.</li>
              <li>Violate Ethiopian law.</li>
              <li>Promote illegal products or services.</li>
              <li>Infringe intellectual property rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Upload harmful software or malicious code.</li>
              <li>Harass, threaten, or abuse other users.</li>
              <li>Publish fraudulent or deceptive content.</li>
              <li>Interfere with the operation or security of the platform.</li>
              <li>Attempt to reverse engineer or exploit the Services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. User Content</h2>
            <p>
              You retain ownership of the content you upload. By submitting content, you grant Phoenixopia
              Solution PLC a non-exclusive, worldwide, royalty-free license to display, reproduce, and
              distribute that content solely for operating and promoting the Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Reviews and Ratings</h2>
            <p>
              Reviews must be honest, respectful, and based on genuine experiences. Fake reviews, spam, or
              abusive language may result in account suspension or removal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Payments</h2>
            <p>
              Certain Services may require payment. All applicable fees will be displayed before purchase.
              Unless required by law, payments are non-refundable after the Service has been delivered.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Intellectual Property</h2>
            <p>
              All trademarks, logos, software, designs, and content provided by YegnaFinder remain the
              property of Phoenixopia Solution PLC or its licensors.
            </p>
            <p>
              You may not copy, distribute, modify, or commercially exploit any part of the Services
              without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. Suspension and Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these Terms, engage in fraudulent
              activities, or misuse the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">11. Disclaimer</h2>
            <p>
              The Services are provided &quot;as is&quot; and &quot;as available.&quot; While we strive for
              accuracy, we do not guarantee that listings, reviews, pricing, or availability are always
              complete or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">12. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Phoenixopia Solution PLC shall not be liable for
              indirect, incidental, consequential, or special damages arising from your use of the
              Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">13. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Services after changes
              become effective constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">14. Governing Law</h2>
            <p>These Terms are governed by the laws of the Federal Democratic Republic of Ethiopia.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">15. Contact Us</h2>
            <p>Phoenixopia Solution PLC</p>
          </section>
        </div>
      </div>
    </div>
  );
}