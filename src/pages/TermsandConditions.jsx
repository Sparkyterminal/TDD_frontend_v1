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
            Welcome to <strong>The Dance District</strong> website. By using our
            services, including membership subscriptions, workshop registrations,
            and payment transactions, you agree to comply with and be bound by
            the following Terms and Conditions. Please read them carefully before
            using our site.
          </p>

          <h2>1. Memberships</h2>
          <p>
            Memberships grant access to our dance classes and studio facilities as
            described in the membership plan you select. Membership fees are billed
            as per the agreed schedule and are non-refundable except as required by
            law.
          </p>

          <h2>2. Workshops</h2>
          <p>
            Workshop registrations are subject to availability and payment
            confirmation. Workshop fees must be paid in full before attending. We
            reserve the right to cancel or reschedule workshops and will notify
            enrolled participants accordingly.
          </p>

          <h2>3. Payment Terms</h2>
          <p>
            All payments are securely processed through our trusted payment
            gateway. Payment details are handled in accordance with our{" "}
            <a href="/privacy" className="text-indigo-600 underline">
              Privacy Policy
            </a>
            . We do not store your payment information on our servers.
          </p>

          <h2>4. Refunds and Cancellations</h2>
          <p>
            Refunds for memberships or workshops are only issued in accordance
            with our cancellation policy. Please contact support for specific
            refund requests. We may cancel classes or workshops, in which case
            fees paid will be refunded or credited.
          </p>

          <h2>5. Conduct and Safety</h2>
          <p>
            We expect all participants to behave respectfully and follow studio
            rules and instructor guidance. We reserve the right to refuse service
            or remove individuals whose conduct affects the safety or experience
            of others.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on this website, including images, text, logos, and
            videos, is owned by or licensed to <strong>The Dance District</strong>
            , and is protected by intellectual property laws. You may not use,
            reproduce, or distribute any content without prior written permission.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            <strong>The Dance District</strong> is not liable for any injuries,
            losses, or damages incurred while attending classes or workshops,
            except where required by law. Participation is at your own risk, and
            appropriate precautions should be taken.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms and Conditions at
            any time. Changes will be effective immediately upon posting on the
            website. Please review this page periodically for updates.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For any questions or concerns regarding these Terms and Conditions,
            please contact us at{" "}
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
      <Footer />
    </div>
  );
};

export default TermsandConditions;
