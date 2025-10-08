import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen font-[glancyr] antialiased bg-[#EBE5DB] text-gray-900">
      <Header />
      <main className="max-w-4xl mt-24 mx-auto px-4 sm:px-6 md:px-8 py-8">
        <article className="prose max-w-none prose-indigo sm:prose-lg lg:prose-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Refund Policy
          </h1>

          <p>
            This Refund Policy outlines the terms and conditions under which refunds
            may be issued for memberships, workshops, and other services offered by{" "}
            <strong>The Dance District</strong>.
          </p>

          <h2>1. Membership Refunds</h2>
          <p>
            Membership fees are generally non-refundable due to the nature of our
            services and the commitment of resources at the time of enrollment.
            However, refunds may be considered under exceptional circumstances and
            are subject to the sole discretion of{" "}
            <strong>The Dance District</strong> management.
          </p>

          <h2>2. Workshop Refunds</h2>
          <p>
            Workshop fees must be paid in full at the time of registration. Refunds
            for workshops are available only if the cancellation is made at least{" "}
            <strong>7 days prior</strong> to the workshop start date. In such cases,
            a full refund, minus applicable processing fees, will be issued.
          </p>

          <h2>3. Cancellations by The Dance District</h2>
          <p>
            In the event that <strong>The Dance District</strong> cancels a class or
            workshop, registered participants will be eligible for a full refund or
            may opt to receive a credit toward a future session.
          </p>

          <h2>4. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support team at{" "}
            <a
              href="mailto:thedancedistrictbysahitya@gmail.com"
              className="text-indigo-600 underline"
            >
              thedancedistrictbysahitya@gmail.com
            </a>{" "}
            with your transaction details and the reason for your request. Approved
            refunds will be processed within <strong>7–14 business days</strong>.
          </p>

          <h2>5. Non-refundable Charges</h2>
          <p>
            Transaction or processing fees charged by payment gateways or financial
            institutions are non-refundable, even in the event of an approved refund.
          </p>

          <h2>6. Changes to This Policy</h2>
          <p>
            <strong>The Dance District</strong> reserves the right to update or
            modify this Refund Policy at any time. Updates will be reflected on this
            page with an updated effective date.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            For any questions or concerns regarding this Refund Policy or refund
            requests, please contact us at{" "}
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

export default RefundPolicy;
