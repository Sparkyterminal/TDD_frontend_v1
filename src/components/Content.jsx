import React from "react";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const navigate = useNavigate();

  const navItems = [
    { number: "01", text: "Home", route: "/" },
    { number: "02", text: "Instructors", route: "/instructors" },
    { number: "03", text: "Rent our space", route: "/rent" },
    { number: "04", text: "Workshops", route: "/workshops" },
    { number: "05", text: "Contact us", route: "/contact" },
  ];

  return (
    <footer
      className="px-4 sm:px-6 md:px-8 py-8 md:py-12 text-white h-full flex flex-col justify-between font-[glancyr]"
      style={{ backgroundColor: "#26452D" }}
    >
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
        <nav className="mb-6 md:mb-8">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.route)}
              className="flex items-center mb-3 md:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight cursor-pointer transition-all duration-300 hover:translate-x-2 group"
            >
              <span className="text-xs sm:text-sm md:text-base font-normal mr-3 sm:mr-4 md:mr-6 min-w-6 sm:min-w-8 opacity-80">
                {item.number}
              </span>
              <span className="relative">
                {item.text}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 sm:gap-4 pt-4 md:pt-6 border-t border-white border-opacity-20 text-xs sm:text-sm text-white text-opacity-80 text-center sm:text-left mt-auto">
        <div className="flex gap-6">
          <a
            href="#"
            className="hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/termsandconditions");
            }}
          >
            Terms & Conditions
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/privacy");
            }}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/refund");
            }}
          >
            Refund Policy
          </a>
        </div>

        <span className="text-xs sm:text-sm">
          © 2025 The Dance District. All rights reserved.
        </span>
        <span className="text-xs sm:text-sm">
          Designed & Developed by
          <a
            href="https://www.naviinfo.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline ml-1"
          >
            Navi Infotech
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Content;
