/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../config";
// import { API_BASE_URL } from "../config";

const { Option } = Select;

const studioMedia = [
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
];

const rentalOptions = [
  {
    text: "Wellness Workshops",
    img: "/assets/rentals/wellness-program.jpg",
  },
  {
    text: "Interviews and Podcasts",
    img: "/assets/rentals/podcast.jpg",
  },
  {
    text: "Wedding Choreography / Sangeet",
    img: "/assets/rentals/sangeet.jpg",
  },
  {
    text: "Dance Rehearsals",
    img: "/assets/rentals/dance-r.jpg",
  },
];

const Rentals = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();
  const user = useSelector((state) => state.user?.value);
  const config = user?.access_token ? { headers: { Authorization: user.access_token } } : {};

  const openModal = (media) => {
    setModalMedia(media);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMedia(null);
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.fullName,
        phone_number: values.phone,
        email_id: values.email,
        purpose: values.purpose,
      };

      await axios.post(`${API_BASE_URL}rental-contact`, payload, {
        ...config,
        headers: { "Content-Type": "application/json", ...(config.headers || {}) },
      });

      message.success("Request sent. We'll contact you soon.");
      form.resetFields();
    } catch (err) {
      console.error("Rental contact error:", err);
      message.error("Failed to send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 px-4 sm:pt-28 w-full font-[glancyr] max-w-6xl mx-auto mb-16">
        <motion.h2
          className="text-4xl font-medium mb-8 text-center mt-10 font-[glancyr]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          Take a look at our studio
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
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

        <motion.div
          className="text-center space-y-6 mb-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
        >
          <h1 className="text-4xl font-medium mb-8 text-center font-[glancyr]">
            Rent Our Space For
          </h1>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
          >
            {rentalOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  openModal({ type: "image", src: option.img, alt: option.text })
                }
                className="relative rounded-xl shadow-lg h-48 cursor-pointer overflow-hidden group bsolute inset-0 object-cover z-0 opacity-90 focus:outline-none transform transition-transform hover:scale-105"
                aria-label={`View ${option.text}`}
                style={{
                  backgroundImage: `url(${option.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black opacity-70 z-10" />

                <div className="relative z-20 inset-0 flex items-center justify-center h-full px-3">
                  <h3 className="text-white text-xl font-semibold text-center">
                    {option.text}
                  </h3>
                </div>
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.section
        className="relative max-w-7xl mx-auto mt-20 mb-20 rounded-2xl overflow-hidden px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/assets/rentals/contact-bg.jpeg')",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto py-16 text-center text-[#D8CFC4]">
          <motion.h2
            className="text-4xl font-bold mb-10 font-[glancyr] text-[#D8CFC4]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contact Us
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  name="fullName"
                  label={<span className="text-[#D8CFC4] font-medium">Full Name</span>}
                  rules={[{ required: true, message: "Please enter your full name" }]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your full name"
                    className="rounded-md bg-[#F5EFE6] text-[#3B3B2E] placeholder-[#777] border-none focus:ring-2 focus:ring-[#A6A178]"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={<span className="text-[#D8CFC4] font-medium">Phone Number</span>}
                  rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                  <Input
                    size="large"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="rounded-md bg-[#F5EFE6] text-[#3B3B2E] placeholder-[#777] border-none focus:ring-2 focus:ring-[#A6A178]"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label={<span className="text-[#D8CFC4] font-medium">Email</span>}
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  className="rounded-md bg-[#F5EFE6] text-[#3B3B2E] placeholder-[#777] border-none focus:ring-2 focus:ring-[#A6A178]"
                />
              </Form.Item>

              <Form.Item
                name="purpose"
                label={<span className="text-[#D8CFC4] font-medium">Purpose</span>}
                rules={[{ required: true, message: "Please select a purpose" }]}
              >
                <Select
                  size="large"
                  placeholder="Select Purpose"
                  className="rounded-md bg-[#F5EFE6] text-[#3B3B2E]"
                  dropdownStyle={{
                    background: "#F5EFE6",
                    color: "#3B3B2E",
                    borderRadius: "8px",
                  }}
                >
                  <Option value="Wellness">Wellness Workshops</Option>
                  <Option value="Dance">Dance Rehearsals</Option>
                  <Option value="Wedding">Wedding Choreography / Sangeet</Option>
                  <Option value="Interviews">Interviews and Podcasts</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    className="w-full bg-[#A6A178] hover:bg-[#8F8A66] text-white font-semibold rounded-md border-none shadow-md transition-all duration-300"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </Form.Item>
            </Form>
          </motion.div>
        </div>
      </motion.section>

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
            <div className="mt-2 text-lg font-medium text-center">{modalMedia?.alt}</div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Rentals;
