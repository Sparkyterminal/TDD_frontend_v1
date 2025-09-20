import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const instructorsData = [
  { id: 1, name: "Alice Johnson", image: "/assets/dancers/alice.webp" },
  { id: 2, name: "Bobby Brown", image: "/assets/dancers/bob.jpg" },
  { id: 3, name: "Catherine Lee", image: "/assets/dancers/cath.jpg" },
  { id: 4, name: "David Kim", image: "/assets/dancers/david.jpg" },
  { id: 5, name: "Eva Wilson", image: "/assets/dancers/eva.webp" },
  { id: 6, name: "Frank Garcia", image: "/assets/dancers/frank.jpg" },
];

const Instructors = () => {
  return (
    <>
      <Header />
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center font-[glancyr]"
        style={{ marginTop: "130px" }} // Adjust this value to match your header height
      >
        <h1 className="text-6xl mt-10 md:text-6xl font-medium text-center mb-12">
          Instructors
        </h1>
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {instructorsData.map(({ id, name, image }) => (
              <div key={id} className="flex flex-col items-center">
                <div className="overflow-hidden rounded-full">
                  <img
                    src={image}
                    alt={name}
                    className="w-64 h-64 md:w-66 md:h-66 rounded-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                </div>
                <p className="mt-4 text-center text-lg font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Instructors;
