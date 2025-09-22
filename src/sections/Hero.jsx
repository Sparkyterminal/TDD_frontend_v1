/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center">
      {/* Background video */}
      <video
        className="absolute w-full h-full object-cover"
        src="/assets/dance-video.webm" // replace with your video path
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
        <motion.h1
          className="text-yellow-500 font-serif text-6xl md:text-6xl lg:text-8xl font-extrabold mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          The Dance District
        </motion.h1>
        <motion.p
          className="text-white font-[summer] text-6xl md:text-7xl font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          by sahitya yogesh
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
