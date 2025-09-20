import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center">
      {/* Background video */}
      <video
        className="absolute w-full h-full object-cover"
        src="/assets/dance-video.webm" // replace with your video path
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Black overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-100"></div> */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
        <h1 className="text-yellow-500 font-serif text-6xl md:text-6xl lg:text-8xl font-extrabold mb-4">
          The Dance District
        </h1>
        <p className="text-white font-[summer] text-6xl md:text-7xl font-light">
          by sahitya yogesh
        </p>
      </div>
    </section>
  );
};

export default Hero;
