/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabData = {
  danceClasses: [
    { name: "Dance Workshop", img: "/assets/dance/dance-workshop.jpg" },
    { name: "Bharatanatyam", img: "/assets/dance/bharatanatyam.jpg" },
    { name: "Folk / Contemporary", img: "/assets/dance/folk.jpg" },
    { name: "Yoga", img: "/assets/dance/yoga.jpg" },
    { name: "Hip-Hop / Freestyle", img: "/assets/dance/hiphop.jpg" },
    { name: "Bollywood Dance", img: "/assets/dance/bollywood.webp" },
  ],
  groupClasses: {
    subheading: "Above 12 years old",
    items: [
      { name: "Zumba / Pilates", img: "/assets/dance/zumba.jpg" },
      {
        name: "Yoga / Aerobic Steppers",
        img: "/assets/dance/aerobic.jpg",
      },
      { name: "HIIT / Dance Fitness", img: "/assets/dance/hiit.jpg" },
      { name: "Bolly Beats / Mass Hits", img: "/assets/dance/bollybeats.webp" },
      { name: "Power House Dance", img: "/assets/dance/power-house.webp" },
    ],
  },
  kids: {
    junior: {
      subheading: "Age group of 4 - 8 years",
      items: [
        { name: "Basic Dance", img: "/assets/dance/basic-kids.jpg" },
        {
          name: "Creative Movement",
          img: "/assets/dance/creative-movement.jpg",
        },
        { name: "Fun Rhythms", img: "/assets/dance/fun-movement.jpg" },
      ],
    },
    subJunior: {
      subheading: "Age group 9 - 14 years",
      items: [
        { name: "Advanced Dance", img: "/assets/dance/kids-advance.jpg" },
        {
          name: "Contemporary Kids",
          img: "/assets/dance/contemporary-kids.jpg",
        },
        {
          name: "Group Performances",
          img: "/assets/dance/kids-group.webp",
        },
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

const TabSection = () => {
  const [activeTab, setActiveTab] = useState("danceClasses");
  const [kidsSubTab, setKidsSubTab] = useState("junior");

  const renderItems = (items) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 font-[glancyr]">
      {items.map(({ name, img }) => (
        <div key={name} className="flex flex-col items-center">
          <img
            src={img}
            alt={name}
            className="w-full h-60 object-cover rounded-md mb-2"
          />
          <span className="text-center text-lg font-medium text-gray-900">
            {name}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 font-[glancyr]">
      <h2 className="text-4xl font-medium mb-8 text-center">
        Learn A Variety of Dance Styles
      </h2>

      {/* Main Tabs */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {[
          {
            id: "danceClasses",
            label: "Dance Classes",
          },
          {
            id: "groupClasses",
            label: "Group Classes",
          },
          {
            id: "kids",
            label: "Kids",
          },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 font-medium rounded-full transition ${
              activeTab === id
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content with AnimatePresence */}
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
                  {
                    id: "junior",
                    label: "Junior",
                  },
                  {
                    id: "subJunior",
                    label: "Sub-Junior",
                  },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setKidsSubTab(id)}
                    className={`px-4 py-2 font-medium rounded-full transition ${
                      kidsSubTab === id
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
    </section>
  );
};

export default TabSection;
