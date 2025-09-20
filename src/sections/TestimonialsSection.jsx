import React from "react";
import Marquee from "react-fast-marquee";

const testimonials = [
  {
    id: 1,
    text: "Amazing service and quality products! Highly recommend.",
    author: "John Doe",
  },
  {
    id: 2,
    text: "Customer support was very helpful and prompt.",
    author: "Jane Smith",
  },
  {
    id: 3,
    text: "The best experience I've had with any company so far.",
    author: "Michael Lee",
  },
  {
    id: 4,
    text: "Fast shipping and the products exceeded my expectations.",
    author: "Sarah Johnson",
  },
  {
    id: 5,
    text: "Professional and reliable from start to finish.",
    author: "David Brown",
  },
  {
    id: 6,
    text: "I will definitely be ordering again soon!",
    author: "Emily Davis",
  },
];

const TestimonialCard = ({ text, author }) => {
  return (
    <div className="bg-[#adc290] text-black p-4 rounded-md shadow-md flex flex-col justify-between h-full w-80 mx-4">
      <p className="mb-4 font-bold text-2xl font-[cormoreg]">
        &quot;{text}&quot;
      </p>
      <p className="text-right font-semibold">&mdash; {author}</p>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-medium mb-8 text-center font-[glancyr]">
        What Our Clients Say
      </h2>

      {/* Marquee showing cards sliding left to right */}
      <Marquee speed={50} direction="left" gradient={false} className="mb-8">
        {testimonials.map(({ id, text, author }) => (
          <TestimonialCard key={"m1-" + id} text={text} author={author} />
        ))}
      </Marquee>

      {/* Marquee showing cards sliding right to left */}
      <Marquee speed={50} direction="right" gradient={false}>
        {testimonials.map(({ id, text, author }) => (
          <TestimonialCard key={"m2-" + id} text={text} author={author} />
        ))}
      </Marquee>
    </section>
  );
};

export default TestimonialsSection;
