/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center">
  {/* Background video with faded effect */}
  <video
    className="absolute inset-0 w-full h-full object-cover z-0 opacity-80" 
    src="/assets/dance-video.webm"
    autoPlay
    loop
    muted
    playsInline
  />
  
  {/* Black overlay with opacity to darken video */}
  <div className="absolute inset-0 bg-black opacity-60 z-10" />
  
  {/* Content above overlay */}
  <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full">
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
