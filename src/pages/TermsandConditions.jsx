import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsandConditions = () => {
  return (
    <div className="min-h-screen font-[glancyr] antialiased bg-[#EBE5DB] text-gray-900">
      <Header />
      <main className="max-w-4xl mt-24 mx-auto px-4 sm:px-6 md:px-8 py-8">
        <article className="prose max-w-none prose-indigo sm:prose-lg lg:prose-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Terms and Conditions
          </h1>

          <p>
            By using <strong>The Dance District</strong> website and services, you agree to these Terms. Please read them carefully.
          </p>

          <h2>1. Memberships & Workshops</h2>
          <p>
            Access and participation are subject to payment and plan type. Fees are non-refundable unless stated by law. We may adjust, reschedule, or cancel offerings with notice.
          </p>

          <h2>2. Payments</h2>
          <p>
            Payments are processed securely via our payment partner. We do not store your payment details. See our{" "}
            <a href="/privacy" className="text-indigo-600 underline">
              Privacy Policy
            </a>
            .
          </p>

          <h2>3. Conduct</h2>
          <p>
            Respectful behavior is required. We reserve the right to deny or discontinue service in cases of disruptive or unsafe conduct.
          </p>

          <h2>4. Liability</h2>
          <p>
            Participation is at your own risk. <strong>The Dance District</strong> is not responsible for personal injuries or losses, except as required by law.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content is owned by <strong>The Dance District</strong>. Do not reproduce or use materials without permission.
          </p>

          <h2>6. Updates & Contact</h2>
          <p>
            These Terms may change at any time—updates are effective upon posting. Contact{" "}
            <a
              href="mailto:thedancedistrictbysahitya@gmail.com"
              className="text-indigo-600 underline"
            >
              thedancedistrictbysahitya@gmail.com
            </a>{" "}
            with questions.
          </p>

          <p className="mt-8 text-sm text-gray-600">
            Last updated: October 15, 2025
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default TermsandConditions;
