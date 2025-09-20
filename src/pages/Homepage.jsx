import React from "react";
import Header from "../components/Header";
import Hero from "../sections/Hero";
import AboutSection from "../sections/AboutSection";
import TabSection from "../sections/TabSection";
import TestimonialsSection from "../sections/TestimonialsSection";

const Homepage = () => {
  return (
    <>
      <Header />
      <Hero />
      <AboutSection />
      <TabSection />
      <TestimonialsSection />
    </>
  );
};

export default Homepage;
