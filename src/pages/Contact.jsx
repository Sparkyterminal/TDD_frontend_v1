/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const CONTACT_INFO = {
  phone: "+91 80731 39244",
  email: "sahithyayogesh@thedancedistrict.in",
  instagram: "@thedancedistrictbysahitya",
  address: `THE DANCE DISTRICT "SHIPRA SAPPHIRE " 4th Floor, Site No. 101 & 102, JHCS Layout, Gubbalala Main Road, Bengaluru-560061 Land Mark: Opposite to Chowdeshwari Temple., Bangalore, India 560061`,
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.236869529689!2d77.54039407483997!3d12.892484787415661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f18f7ce3811%3A0x27eff0650e8840e3!2sThe%20Dance%20District%20by%20Sahitya!5e0!3m2!1sen!2sin!4v1758382173897!5m2!1sen!2sin",
};

const Contact = () => {
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
          Contact Us
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          {/* Map Section */}
          <div className="w-full h-100 rounded-lg overflow-hidden shadow">
            <iframe
              src={CONTACT_INFO.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio Location"
            ></iframe>
          </div>
          {/* Contact Info Section */}
          <div className="flex flex-col justify-center gap-12">
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-2xl text-[#adc290]" />
              <span className="text-lg font-medium break-all">
                {CONTACT_INFO.phone}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-2xl text-[#adc290]" />
              <span className="text-lg font-medium break-all">
                {CONTACT_INFO.email}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaInstagram className="text-2xl text-[#adc290]" />
              <span className="text-lg font-medium break-all">
                {CONTACT_INFO.instagram}
              </span>
            </div>
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-2xl text-[#adc290] mt-1 flex-shrink-0" />
              <span className="text-base font-medium break-words">
                {CONTACT_INFO.address}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
