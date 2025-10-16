/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For navigation


const tabData = {
  danceClasses: [
    { name: "Kathak", img: "/assets/dance/kathak.jpg" },
    { name: "Bharatanatyam", img: "/assets/dance/bharatanatyam.jpg" },
    { name: "Contemporary", img: "/assets/dance/folk.jpg" },
    { name: "Hip-Hop", img: "/assets/dance/hiphop.jpg" },
    { name: "Bollywood Dance", img: "/assets/dance/bollywood.webp" },
  ],
  groupClasses: {
    subheading: "Above 12 years old",
    items: [
      { name: "Zumba", img: "/assets/dance/zumba.jpg" },
      { name: "Pilates", img: "/assets/dance/pilates.jpg" },
      { name: "Aerobics", img: "/assets/dance/aerobic.jpg" },
      { name: "Yoga", img: "/assets/dance/yoga.jpg" },
      { name: "HIIT / Shuffle / Body Weight", img: "/assets/dance/hiit.jpg" },
      { name: "Bolly Beats / Mass Hits", img: "/assets/dance/bollybeats.webp" },
    ],
  },
  kids: {
    junior: {
      subheading: "Age group of 4 - 8 years",
      items: [
        { name: "Kids Dance", img: "/assets/dance/basic-kids.jpg" },
      ],
    },
    subJunior: {
      subheading: "Age group 9 - 14 years",
      items: [
        { name: "Advanced Dance", img: "/assets/dance/kids-advance.jpg" },
      ],
    },
  },
};


const fadeSlideVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.5, ease: "easeOut" },
};


const batchGroups = [
  {
    label: "Mon, Wed, Fri",
    timing: "5:00 PM - 6:00 PM",
  },
  {
    label: "Tue, Thu, Sat",
    timing: "5:00 PM - 6:00 PM",
  },
  {
    label: "Sat, Sun",
    timing: "10:00 AM - 12:00 PM",
  },
];


const requirements = [
  "Water bottle",
  "Comfortable clothes",
  "Class-only shoes (outside shoes not allowed)",
];

// Modal component is commented out as requested
const Modal = ({
  isOpen,
  onClose,
  selectedCard,
  fontClass,
  navigateToMembership,
}) => {
  if (!isOpen || !selectedCard) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="modal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center`}
        aria-modal="true"
      >
        <motion.div
          key="modal-box"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          className={`relative bg-white rounded-xl shadow-xl w-full max-w-lg px-6 py-8 ${fontClass}`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
          <div className="flex flex-col items-center mb-3">
            <img
              src={selectedCard.img}
              alt={selectedCard.name}
              className="w-36 h-36 object-cover rounded-lg shadow-md mb-2"
            />
            <span className="text-2xl font-semibold text-gray-900">{selectedCard.name}</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#D2663A" }}></span>
            <span className="text-md font-medium">For ages 9 and above</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">Batches</h3>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {batchGroups.map((batch, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-lg"
              >
                <span className="font-medium text-gray-700">{batch.label}</span>
                <span className="text-gray-600">{batch.timing}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start mb-4">
            <span className="text-lg font-semibold text-[#D2663A]">₹2500/- per month</span>
            <span className="text-md text-gray-700">Registration fee: ₹500 (one time)</span>
          </div>
          <h4 className="text-md font-semibold mt-2 mb-2 text-gray-800">Requirements</h4>
          <ul className="mb-8 list-disc list-inside text-gray-700 space-y-1">
            {requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
          <button
            className="fixed md:static right-6 bottom-6 bg-[#D2663A] text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-[#b15626] transition-all font-[glancyr]"
            style={{ zIndex: 55 }}
            onClick={navigateToMembership}
          >
            Get Membership
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};



const TabSection = () => {
  const [activeTab, setActiveTab] = useState("danceClasses");
  const [kidsSubTab, setKidsSubTab] = useState("junior");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();
  const fontClass = "font-[glancyr]";


  // Cards OnClick handler removed to prevent modal open
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };


  const renderItems = (items) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 font-[glancyr]">
      {items.map(({ name, img }) => (
        <div
          key={name}
          className="flex flex-col items-center cursor-default" // changed cursor to default to show no click
          onClick={() => handleCardClick({ name, img })}
        >
          <img
            src={img}
            alt={name}
            className="w-full h-60 object-cover rounded-md mb-2 shadow"
          />
          <span className="text-center text-lg font-medium text-gray-900">
            {name}
          </span>
        </div>
      ))}
    </div>
  );


  return (
    <section className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 ${fontClass}`}>
      <h2 className="text-4xl font-medium mb-8 text-center">
        Learn A Variety of Dance Styles
      </h2>


      {/* Main Tabs */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {[
          { id: "danceClasses", label: "Dance Classes" },
          { id: "groupClasses", label: "Group Classes" },
          { id: "kids", label: "Kids" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 font-medium rounded-full transition ${activeTab === id
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* moved Get Membership button between tabs row and cards */}
      <div className="flex justify-center mb-8">
        <button
          className="bg-[#D2663A] text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-[#b15626] transition-all font-[glancyr]"
          onClick={() => navigate("/getmembership")}
        >
          Get Membership
        </button>
      </div>

       {/* Tab Content */}
       <div style={{ minHeight: 350 }}>
        <AnimatePresence mode="wait">
          {activeTab === "danceClasses" && (
            <motion.div
              key="danceClasses"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {renderItems(tabData.danceClasses)}
            </motion.div>
          )}


          {activeTab === "groupClasses" && (
            <motion.div
              key="groupClasses"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              <div className="flex items-center justify-center mb-4">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#D2663A" }}
                  aria-hidden="true"
                ></span>
                <h3 className="text-xl font-medium text-center m-0">
                  {tabData.groupClasses.subheading}
                </h3>
              </div>
              {renderItems(tabData.groupClasses.items)}
            </motion.div>
          )}


          {activeTab === "kids" && (
            <motion.div
              key="kids"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideVariants.transition}
            >
              {/* Kids Sub Tabs */}
              <div className="flex justify-center gap-4 mb-6 flex-wrap">
                {[
                  { id: "junior", label: "Junior" },
                  { id: "subJunior", label: "Sub-Junior" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setKidsSubTab(id)}
                    className={`px-4 py-2 font-medium rounded-full transition ${kidsSubTab === id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {/* Subheading with circle */}
              <div className="flex items-center justify-center mb-4">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: "#D2663A" }}
                  aria-hidden="true"
                ></span>
                <h4 className="text-lg font-medium text-center m-0">
                  {tabData.kids[kidsSubTab].subheading}
                </h4>
              </div>
              {/* Render kids items */}
              {renderItems(tabData.kids[kidsSubTab].items)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedCard={selectedCard}
        fontClass={fontClass}
        navigateToMembership={() => {
          setModalOpen(false);
          navigate("/getmembership");
        }}
      />
     
    </section>
  );
};


export default TabSection;
