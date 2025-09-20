import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Color palette for cards
const CARD_COLORS = ["bg-[#adc290]", "bg-[#f7e9c4]", "bg-[#e6b8b7]"];

// Card texts
const CARD_TEXTS = [
  "For Wellness Workshops",
  "For Interviews, Podcasts & Press Meets",
  "For Sangeet and Wedding Choreography",
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
        <h1 className="text-5xl mt-10 font-medium text-black mb-20 text-center font-[glancyr]">
          Rent Our Space
        </h1>
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {CARD_TEXTS.map((text, idx) => (
            <div
              key={text}
              className={`rounded-xl shadow-lg p-8 text-center items-center justify-center text-2xl font-semibold text-black ${
                CARD_COLORS[idx % CARD_COLORS.length]
              }`}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Studio Media Section */}
        <h2 className="text-4xl font-medium mb-8 text-center font-[glancyr]">
          Take a look at our studio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
        </div>

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
