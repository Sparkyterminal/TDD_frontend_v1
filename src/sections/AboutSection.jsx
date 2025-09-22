/* eslint-disable no-unused-vars */
import React from "react";

const AboutSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-18 items-center">
        {/* Left Image */}
        <img
          src="/assets/about1.png"
          alt="Dance Studio"
          className="w-full h-auto rounded-lg object-cover"
          style={{
            filter: "drop-shadow(0 0 10px white) drop-shadow(0 0 6px white)",
          }}
        />

        {/* Right Text */}
        <div className="text-gray-900">
          <h2 className="text-3xl font-bold mb-2 font-[kannada]">
            ಎಲ್ಲರಿಗು ನಮಸ್ಕಾರ
          </h2>
          <p className="mb-2 text-2xl font-bold leading-relaxed font-[cormoreg]">
            At our studio, dance is more than movement — it's expression,
            passion, and joy. Founded by Sahitya, our space is dedicated to
            nurturing creativity, confidence, and rhythm in every dancer.
          </p>
          <p className="mb-2 text-2xl font-bold leading-relaxed font-[cormoreg]">
            Whether you're a beginner discovering your first steps or an
            experienced performer perfecting your craft, we offer a supportive
            environment where every student can shine. From
            classical/ballet/contemporary/hip-hop to high-energy workshops, we
            celebrate the art of dance in all its forms.
          </p>
          <p className="mb-2 text-2xl font-bold leading-relaxed font-[cormoreg]">
            Join us to learn, grow, and be part of a community that moves
            together with heart.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
