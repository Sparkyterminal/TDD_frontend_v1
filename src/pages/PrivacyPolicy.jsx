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
              This Privacy Policy explains how <strong>The Dance District</strong>{" "}
              collects, uses, and protects your personal information when you use
              our website and related services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect personal information that you provide to us directly,
              including your name, email address, phone number, payment details,
              and membership or workshop information.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              Your information is used to manage memberships, process workshop
              registrations and payments, communicate updates, and enhance our
              services to improve your overall experience with{" "}
              <strong>The Dance District</strong>.
            </p>

            <h2>3. Payment Information</h2>
            <p>
              All payment transactions are processed securely through a trusted
              payment gateway. <strong>The Dance District</strong> does not store
              your complete payment card details on our servers.
            </p>

            <h2>4. Information Sharing</h2>
            <p>
              We do not sell or rent your personal information. We may share
              necessary information with trusted third-party service providers who
              assist in operating our website and business functions, under strict
              confidentiality and data protection agreements.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We use appropriate technical and organizational measures to safeguard
              your personal information from unauthorized access, alteration,
              disclosure, or destruction.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your
              personal information. To exercise these rights, please contact us at{" "}
              <a
                href="mailto:thedancedistrictbysahitya@gmail.com"
                className="text-indigo-600 underline"
              >
               thedancedistrictbysahitya@gmail.com
              </a>
              .
            </p>

            <h2>7. Cookies</h2>
            <p>
              Our website may use cookies to enhance your user experience. You can
              disable cookies through your browser settings, but some features of
              the site may not function properly as a result.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Updates will be
              reflected on this page with a revised effective date. We encourage
              you to review this policy regularly to stay informed.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              For any questions or concerns regarding this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:thedancedistrictbysahitya@gmail.com"
                className="text-indigo-600 underline"
              >
               thedancedistrictbysahitya@gmail.com
              </a>
              .
            </p>

            <p className="mt-8 text-sm text-gray-600">
              Last updated: October 8, 2025
            </p>
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
