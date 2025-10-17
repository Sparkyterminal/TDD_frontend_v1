import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NoRefundPolicy = () => {
  return (
    <div className="min-h-screen font-[glancyr] antialiased bg-[#EBE5DB] text-gray-900">
      <Header />
      <main className="max-w-4xl mt-24 mx-auto px-4 sm:px-6 md:px-8 py-8">
        <article className="prose max-w-none prose-indigo sm:prose-lg lg:prose-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            No Refund Policy
          </h1>

          <p>
            At <strong>The Dance District</strong>, all fees paid for memberships,
            workshops, and other services are <strong>strictly non-refundable</strong>.
            By enrolling or registering, you acknowledge and agree to this policy.
          </p>

          <h2>1. No Refunds on Memberships</h2>
          <p>
            Membership fees are non-refundable under all circumstances. Commitment resources
            are allocated upon enrollment, making refunds impossible.
          </p>

          

          <h2>2. Contact Us</h2>
          <p>
            For any policy questions, please contact us at{" "}
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
      <Footer />
    </div>
  );
};

export default NoRefundPolicy;
