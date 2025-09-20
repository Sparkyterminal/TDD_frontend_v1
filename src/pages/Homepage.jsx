/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion, useAnimation, useInView } from "motion/react";
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
  const workshopRef = useRef(null);
  const isInView = useInView(workshopRef, { margin: "-40% 0px -10% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ backgroundColor: "#adc290" });
    } else {
      controls.start({ backgroundColor: "#ebe5db" });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      animate={controls}
      initial={{ backgroundColor: "#ebe5db" }}
      transition={{ duration: 1 }}
      style={{ minHeight: "100vh" }}
    >
      <Header />
      <Hero />
      <AboutSection />
      <TabSection />
      <div ref={workshopRef}>
        <WorkshopSection />
      </div>
      <TestimonialsSection />
      <ContactFollowSection />
      <Footer />
    </motion.div>
  );
};

export default Homepage;
