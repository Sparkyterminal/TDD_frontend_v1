import React, { useEffect, useState } from "react";

const Header = ({ scrollToSection }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgColor = isSticky ? "#EBE5DB" : "transparent";
  const textColor = isSticky ? "#000000" : "#FFFFFF";

  // Update these logo paths for your project
  const logoSrc = isSticky
    ? "assets/tdd-logo.png"
    : "assets/tdd-logo-white.png";

  const menuItems = [
    { label: "Home", id: "home" },
    { label: "Instructors", id: "instructors" },
    { label: "Rent our space", id: "rent" },
    { label: "Workshops", id: "workshops" },
    { label: "Contact us", id: "contact" },
  ];

  return (
    <header
      style={{ backgroundColor: bgColor }}
      className={`fixed inset-x-0 top-0 z-30 py-4 xl:py-6 transition-colors duration-300 ${
        isSticky ? "shadow-md" : ""
      }`}
    >
      <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo with conditional image */}
          <div className="flex flex-shrink-0 items-center h-12">
            <img
              src={logoSrc}
              alt="The Dance District Logo"
              style={{ height: 48 }}
              className="transition-all duration-300"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 -m-2 rounded-full focus:outline-none hover:bg-black/10 transition-colors duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{ color: textColor }}
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8 lg:ml-24">
            {menuItems.map(({ label, id }) => (
              <a
                key={id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (scrollToSection) scrollToSection(id);
                }}
                className="font-[glancyr] text-base font-normal transition-all duration-200 rounded focus:outline-none hover:opacity-70"
                style={{ color: textColor }}
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => (window.location.href = "/get-membership")}
              className="ml-4 inline-flex items-center justify-center px-5 py-2 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10"
              style={{
                color: textColor,
                borderColor: textColor,
              }}
            >
              Get Membership
            </button>
            <button
              onClick={() => (window.location.href = "/login")}
              className="ml-2 inline-flex items-center justify-center px-5 py-2 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10"
              style={{
                color: textColor,
                borderColor: textColor,
                backgroundColor: isSticky ? "#F7F7F7" : "transparent",
              }}
            >
              Login
            </button>
          </nav>
        </div>

        {/* Mobile navigation menu */}
        {menuOpen && (
          <div className="md:hidden mt-4">
            <div
              className="rounded-lg p-6 shadow-lg border"
              style={{
                backgroundColor: "#EBE5DB",
                borderColor: "#CCC9C4",
              }}
            >
              <nav className="flex flex-col space-y-4">
                {menuItems.map(({ label, id }) => (
                  <a
                    key={id}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (scrollToSection) scrollToSection(id);
                      setMenuOpen(false);
                    }}
                    className="font-[glancyr] text-base font-normal transition-all duration-200 rounded p-2 hover:bg-black/10"
                    style={{ color: "#000" }}
                  >
                    {label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    window.location.href = "/get-membership";
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer inline-flex items-center justify-center px-5 py-3 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10 mt-4"
                  style={{
                    color: "#000",
                    borderColor: "#000",
                  }}
                >
                  Get Membership
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/login";
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer inline-flex items-center justify-center px-5 py-3 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10 mt-2"
                  style={{
                    color: "#000",
                    borderColor: "#000",
                  }}
                >
                  Login
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
