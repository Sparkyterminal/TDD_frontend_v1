// /* eslint-disable no-unused-vars */
// import React, { useEffect } from "react";
// import {
//   motion,
//   useAnimation,
//   useInView,
//   useScroll,
//   useTransform,
// } from "motion/react";
// import { useRef } from "react";
// import { useLocation } from "react-router-dom";

// import Header from "../components/Header";
// import Hero from "../sections/Hero";
// import AboutSection from "../sections/AboutSection";
// import TabSection from "../sections/TabSection";
// import TestimonialsSection from "../sections/TestimonialsSection";
// import Footer from "../components/Footer";
// import WorkshopSection from "../sections/WorkshopSection";
// import ContactFollowSection from "../sections/ContactFollowSection";
// import InstagramFeed from "../sections/InstagramFeed";

// const Homepage = () => {
//   const containerRef = useRef(null);
//   const workshopRef = useRef(null);
//   const tabRef = useRef(null); // <- ref for TabSection
//   const location = useLocation(); // read navigation state
//   const isInView = useInView(workshopRef, { margin: "-90% 0px -10% 0px" });
//   const controls = useAnimation();

//   // Smooth scroll configuration
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//   });

//   // CSS smooth scrolling fallback
//   useEffect(() => {
//     // Add smooth scrolling behavior to the document
//     document.documentElement.style.scrollBehavior = "smooth";

//     // Optional: Add custom CSS for webkit browsers
//     const style = document.createElement("style");
//     style.textContent = `
//       html {
//         scroll-behavior: smooth;
//       }
      
//       /* For Webkit browsers */
//       ::-webkit-scrollbar {
//         width: 8px;
//       }
      
//       ::-webkit-scrollbar-track {
//         background: #f1f1f1;
//       }
      
//       ::-webkit-scrollbar-thumb {
//         background: #adc290;
//         border-radius: 4px;
//       }
      
//       ::-webkit-scrollbar-thumb:hover {
//         background: #9bb57a;
//       }
      
//       /* Enhanced smooth scrolling for better performance */
//       * {
//         scroll-behavior: smooth;
//       }
      
//       body {
//         overflow-x: hidden;
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//       document.documentElement.style.scrollBehavior = "auto";
//     };
//   }, []);

//   // scrollToSection function passed to Header for same-page clicks
//   const scrollToSection = (payload) => {
//     // payload may be string route or object { target, tab }
//     const target = typeof payload === "string" ? payload : payload?.target;
//     if (target === "tab-section" && tabRef.current) {
//       tabRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   // if navigated to homepage with location.state.scrollTo -> perform scroll once
//   useEffect(() => {
//     if (location?.state?.scrollTo === "tab-section") {
//       // small timeout to allow content to layout
//       setTimeout(() => {
//         if (tabRef.current) {
//           tabRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//           // clear the navigation state so it doesn't re-trigger on back/forward
//           try {
//             const url = window.location.pathname + window.location.search;
//             window.history.replaceState({}, document.title, url);
//           } catch (e) {
//             // ignore
//           }
//         }
//       }, 120);
//     }
//   }, [location]);

//   useEffect(() => {
//     if (isInView) {
//       controls.start({ backgroundColor: "#adc290" });
//     } else {
//       controls.start({ backgroundColor: "#ebe5db" });
//     }
//   }, [isInView, controls]);

//   return (
//     <motion.div
//       ref={containerRef}
//       animate={controls}
//       initial={{ backgroundColor: "#ebe5db" }}  //#ebe5db original
//       transition={{ duration: 1, ease: "easeInOut" }}
//       style={{ minHeight: "100vh" }}
//     >
//       {/* Smooth scroll progress indicator (optional) */}
//       <motion.div
//         className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#adc290] to-[#9bb57a] z-50 origin-left"
//         style={{ scaleX: scrollYProgress }}
//       />

//       <Header scrollToSection={scrollToSection} />

//       {/* Wrap sections in motion containers for better scroll performance */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <Hero />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: "-100px" }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <AboutSection />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: "-100px" }}
//         transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//       >
//         {/* TabSection wrapped with ref for scrolling */}
//         <div ref={tabRef}>
//           <TabSection />
//         </div>
//       </motion.div>

//       <div ref={workshopRef}>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         >
//           <WorkshopSection />
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: "-100px" }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <TestimonialsSection />
//       </motion.div>
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: "-100px" }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <InstagramFeed />
//       </motion.div>
//       <ContactFollowSection />

//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true, margin: "-50px" }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <Footer />
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Homepage;
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView, useScroll } from "motion/react";
import { useLocation } from "react-router-dom";

import Header from "../components/Header";
import Hero from "../sections/Hero";
import AboutSection from "../sections/AboutSection";
import TabSection from "../sections/TabSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import Footer from "../components/Footer";
import WorkshopSection from "../sections/WorkshopSection";
import ContactFollowSection from "../sections/ContactFollowSection";
import InstagramFeed from "../sections/InstagramFeed";

const Homepage = () => {
  const containerRef = useRef(null);
  const workshopRef = useRef(null);
  const tabRef = useRef(null);
  const location = useLocation();

  const isInView = useInView(workshopRef, { margin: "-90% 0px -10% 0px" });
  const controls = useAnimation();
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [selectedTab, setSelectedTab] = useState(null);
  const [shouldScrollToTab, setShouldScrollToTab] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const style = document.createElement("style");
    style.textContent = `
      html { scroll-behavior: smooth; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #f1f1f1; }
      ::-webkit-scrollbar-thumb { background:#adc290; border-radius:4px; }
      ::-webkit-scrollbar-thumb:hover { background:#9bb57a; }
      * { scroll-behavior: smooth; }
      body { overflow-x: hidden; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // Handle initial page load and navigation
  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    
    if (!visited) {
      // First visit or reload - scroll to top
      setSelectedTab(null);
      setShouldScrollToTab(false);
      window.scrollTo(0, 0);
      sessionStorage.setItem("visited", "true");
    } else {
      // Coming from navigation
      if (location.state?.tab) {
        setSelectedTab(location.state.tab);
        setShouldScrollToTab(true);
        
        // Scroll to tab after a short delay
        setTimeout(() => {
          const tabButton = document.getElementById(`tab-${location.state.tab}`);
          if (tabButton) {
            tabButton.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (tabRef.current) {
            tabRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      } else {
        // Navigating to home without specific tab
        setSelectedTab("dance_classes");
        setShouldScrollToTab(false);
        window.scrollTo(0, 0);
      }
    }
  }, [location.state?.tab]);

  // scrollToSection: update the tab and scroll smoothly
  const scrollToSection = React.useCallback(({ target, tab }) => {
    if (target === "tab-section") {
      if (!tab) {
        return;
      }
      setSelectedTab(tab);
      setShouldScrollToTab(true);
    
      setTimeout(() => {
        const tabButton = document.getElementById(`tab-${tab}`);
        if (tabButton) {
          tabButton.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (tabRef.current) {
          tabRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#adc290] to-[#9bb57a] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Header scrollToSection={scrollToSection} />

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
        <div ref={tabRef}>
          <TabSection 
            activeTabKey={selectedTab} 
            shouldScrollToTab={shouldScrollToTab}
          />
        </div>
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
        <InstagramFeed />
      </motion.div>

      <ContactFollowSection />

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

