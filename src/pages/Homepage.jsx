// /* eslint-disable no-unused-vars */
// import React, { useEffect } from "react";
// import { motion, useAnimation, useInView } from "motion/react";
// import { useRef } from "react";

// import Header from "../components/Header";
// import Hero from "../sections/Hero";
// import AboutSection from "../sections/AboutSection";
// import TabSection from "../sections/TabSection";
// import TestimonialsSection from "../sections/TestimonialsSection";
// import Footer from "../components/Footer";
// import WorkshopSection from "../sections/WorkshopSection";
// import ContactFollowSection from "../sections/ContactFollowSection";

// const Homepage = () => {
//   const workshopRef = useRef(null);
//   const isInView = useInView(workshopRef, { margin: "-90% 0px -10% 0px" });
//   const controls = useAnimation();

//   useEffect(() => {
//     if (isInView) {
//       controls.start({ backgroundColor: "#adc290" });
//     } else {
//       controls.start({ backgroundColor: "#ebe5db" });
//     }
//   }, [isInView, controls]);

//   return (
//     <motion.div
//       animate={controls}
//       initial={{ backgroundColor: "#ebe5db" }}
//       transition={{ duration: 1 }}
//       style={{ minHeight: "100vh" }}
//     >
//       <Header />
//       <Hero />
//       <AboutSection />
//       <TabSection />
//       <div ref={workshopRef}>
//         <WorkshopSection />
//       </div>
//       <TestimonialsSection />
//       <ContactFollowSection />
//       <Footer />
//     </motion.div>
//   );
// };

// export default Homepage;
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import Header from "../components/Header";
import Hero from "../sections/Hero";
import AboutSection from "../sections/AboutSection";
import TabSection from "../sections/TabSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import Footer from "../components/Footer";
import WorkshopSection from "../sections/WorkshopSection";
import ContactFollowSection from "../sections/ContactFollowSection";

const Homepage = () => {
  const containerRef = useRef(null);
  const workshopRef = useRef(null);
  const isInView = useInView(workshopRef, { margin: "-90% 0px -10% 0px" });
  const controls = useAnimation();

  // Smooth scroll configuration
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // CSS smooth scrolling fallback
  useEffect(() => {
    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = "smooth";

    // Optional: Add custom CSS for webkit browsers
    const style = document.createElement("style");
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      /* For Webkit browsers */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #adc290;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #9bb57a;
      }
      
      /* Enhanced smooth scrolling for better performance */
      * {
        scroll-behavior: smooth;
      }
      
      body {
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start({ backgroundColor: "#adc290" });
    } else {
      controls.start({ backgroundColor: "#ebe5db" });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      initial={{ backgroundColor: "#ebe5db" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{ minHeight: "100vh" }}
    >
      {/* Smooth scroll progress indicator (optional) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#adc290] to-[#9bb57a] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Header />

      {/* Wrap sections in motion containers for better scroll performance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AboutSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <TabSection />
      </motion.div>

      <div ref={workshopRef}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <WorkshopSection />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <TestimonialsSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <ContactFollowSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Homepage;
