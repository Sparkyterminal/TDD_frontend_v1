import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen font-[glancyr] antialiased bg-[#EBE5DB] text-gray-900">
        <main className="max-w-4xl mt-24 mx-auto px-4 sm:px-6 md:px-8 py-8">
          <article className="prose max-w-none prose-indigo sm:prose-lg lg:prose-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Privacy Policy
            </h1>

            <p>
              <strong>The Dance District</strong> is committed to protecting your privacy and handling your data responsibly. This policy describes what information we collect, how we use it, and your rights.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect basic personal information (such as name, email, phone number, and payment details) when you register, enroll, or interact with our platform.
            </p>

            <h2>2. Use of Information</h2>
            <p>
              Your information is used to process memberships, workshop registrations, payments, send essential communications, and improve our services.
            </p>

            <h2>3. Data Sharing & Security</h2>
            <p>
              We do not sell your personal data. Information may be shared with trusted service providers for business operations under strict confidentiality agreements. Industry-standard measures are used to protect your data.
            </p>

            <h2>4. Legal and Governance</h2>
            <p>
              This policy is governed by Indian laws. We comply with applicable data protection regulations, and may disclose information if legally required.
            </p>

            <h2>5. Your Rights & Choices</h2>
            <p>
              You may request access, correction, or deletion of your data at any time by contacting us at{" "}
              <a
                href="mailto:thedancedistrictbysahitya@gmail.com"
                className="text-indigo-600 underline"
              >
                thedancedistrictbysahitya@gmail.com
              </a>
              . You may refuse cookies in your browser, but some site features may be affected.
            </p>

            <h2>6. Policy Updates</h2>
            <p>
              We reserve the right to modify this policy at any time. Changes will be posted on this page.
            </p>

            <h2>7. Contact</h2>
            <p>
              For questions or concerns, please email us at{" "}
              <a
                href="mailto:thedancedistrictbysahitya@gmail.com"
                className="text-indigo-600 underline"
              >
                thedancedistrictbysahitya@gmail.com
              </a>
              .
            </p>

            <p className="mt-8 text-sm text-gray-600">
              Last updated: October 15, 2025
            </p>
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
