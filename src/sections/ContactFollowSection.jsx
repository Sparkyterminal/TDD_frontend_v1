import React from "react";
import { Instagram } from "lucide-react";

const ContactFollowSection = () => {
  const instagramUrl = "https://www.instagram.com/thedancedistrictbysahitya/";

  const handleInstagramClick = () => {
    window.open(instagramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-black text-white px-4 sm:px-6 py-6 font-[glancyr]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <a
          href="mailto:sangeetha.yogesh@thedancedistrict.in"
          className="underline hover:text-[#D16539] transition-colors duration-200 break-all"
        >
          sahithyayogesh@thedancedistrict.in
        </a>
        <button
          onClick={handleInstagramClick}
          className="flex text-center justify-center items-center gap-2 text-white hover:text-[#D16539] transition-colors duration-200 cursor-pointer"
          aria-label="Follow us on Instagram"
        >
          <Instagram className="w-5 h-5" />
          <span>Follow us on Instagram</span>
        </button>
      </div>
    </section>
  );
};

export default ContactFollowSection;
