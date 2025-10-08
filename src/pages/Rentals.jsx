/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

// Color palette for cards
const CARD_COLORS = ["bg-[#adc290]", "bg-[#f7e9c4]", "bg-[#e6b8b7]"];

// Card texts
const HERO_IMAGES = [
  {
    src: "/assets/rentals/wellness.png", // Change to your path
    alt: "Wellness Studio Rental",
  },
  {
    src: "/assets/rentals/interview.png", // Change to your path
    alt: "Interviews & Podcasts Rental Space",
  },
  {
    src: "/assets/rentals/wedding.png", // Change to your path
    alt: "Wedding choreography Rental Space",
  },
];

// Studio media array (images and videos)
const studioMedia = [
  {
    type: "image",
    src: "/assets/rentals/studio.png",
    alt: "Studio View",
  },
  {
    type: "image",
    src: "/assets/rentals/1.jpeg",
    alt: "Studio View ",
  },
  {
    type: "image",
    src: "/assets/rentals/2.jpeg",
    alt: "Studio View ",
  },
  {
    type: "image",
    src: "/assets/rentals/3.jpeg",
    alt: "Studio View",
  },
  {
    type: "video",
    src: "/assets/rentals/video-studio.webm",
    alt: "Studio Tour Video",
  },
  // Add more images/videos as needed
];

const Rentals = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);

  const openModal = (media) => {
    setModalMedia(media);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMedia(null);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 px-4 sm:pt-28 w-full font-[glancyr] max-w-6xl mx-auto mb-16">
        <motion.h1
          className="text-5xl mt-10 font-medium text-black mb-20 text-center font-[glancyr]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Rent Our Space
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {HERO_IMAGES.map((img, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={img.src}
                alt={img.alt}
                className="rounded-2xl shadow-lg w-[256px] h-[382px] md:w-[320px] md:h-[477px] lg:w-[320px] lg:h-[477px] xl:w-[350px] xl:h-[520px] object-cover transition-transform duration-200 hover:scale-105"
                style={{
                  maxwidth: "1024px",
                  maxheight: "1526px",
                  // maxWidth: "100%",
                  // maxHeight: "400px",
                }} // for perfect size on large screens, capped at 400px on small
              />
            </div>
          ))}
        </motion.div>

        <motion.h2
          className="text-4xl font-medium mb-8 text-center font-[glancyr]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
        >
          Take a look at our studio
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.9 }}
        >
          {studioMedia.map((media, idx) => (
            <div key={idx} className="flex justify-center">
              {media.type === "image" ? (
                <img
                  src={media.src}
                  alt={media.alt}
                  className="rounded-xl shadow cursor-pointer w-full h-64 object-cover transition-transform duration-200 hover:scale-105"
                  onClick={() => openModal(media)}
                />
              ) : (
                <video
                  src={media.src}
                  controls
                  className="rounded-xl shadow w-full h-64 object-cover bg-black"
                  onClick={() => openModal(media)}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-xl p-4 max-w-2xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="self-end mb-2 text-2xl font-bold text-gray-700 hover:text-black"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              {modalMedia?.type === "image" ? (
                <img
                  src={modalMedia.src}
                  alt={modalMedia.alt}
                  className="rounded-xl w-full h-auto max-h-[70vh] object-contain"
                />
              ) : (
                <video
                  src={modalMedia.src}
                  controls
                  autoPlay
                  className="rounded-xl w-full h-auto max-h-[70vh] bg-black"
                />
              )}
              <div className="mt-2 text-lg font-medium text-center">
                {modalMedia?.alt}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Rentals;
