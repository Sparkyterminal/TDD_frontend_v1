import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ scrollToSection }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if on homepage exact path
  const isHome = location.pathname === "/";

  // Background color: transparent only if on homepage and not scrolled
  const bgColor = isHome && !isSticky ? "transparent" : "#EBE5DB";

  // Default text color is black when bgColor is #EBE5DB, white when transparent
  const defaultTextColor = bgColor === "transparent" ? "#FFFFFF" : "#000000";

  const logoSrc =
    bgColor === "transparent"
      ? "assets/tdd-logo-white.png"
      : "assets/tdd-logo.png";

  // Define menu items with their corresponding routes
  const menuItems = [
    { label: "Home", route: "/" },
    { label: "Instructors", route: "/instructors" },
    { label: "Rent our space", route: "/rent" },
    { label: "Workshops", route: "/workshops" },
    { label: "Contact us", route: "/contact" },
  ];

  return (
    <header
      style={{ backgroundColor: bgColor }}
      className={`fixed inset-x-0 top-0 z-30 py-4 xl:py-6 transition-colors duration-300 ${
        bgColor !== "transparent" ? "shadow-md" : ""
      }`}
    >
      <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center h-12">
            <img
              src={logoSrc}
              alt="The Dance District Logo"
              style={{ height: 58 }}
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
              style={{ color: defaultTextColor }}
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

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:space-x-8 lg:ml-24">
            {menuItems.map(({ label, route }) => {
              // If current path matches route => active color #D2663A else default text color
              const isActive = location.pathname === route;
              const color = isActive ? "#D2663A" : defaultTextColor;

              return (
                <button
                  key={route}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(route);
                    if (scrollToSection) scrollToSection(route);
                  }}
                  className="font-[glancyr] text-base font-normal transition-all duration-200 rounded focus:outline-none hover:opacity-70"
                  style={{ color }}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => navigate("/getmembership")}
              className="ml-4 inline-flex items-center justify-center px-5 py-2 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10"
              style={{
                color: defaultTextColor,
                borderColor: defaultTextColor,
              }}
            >
              Get Membership
            </button>
            <button
              onClick={() => navigate("/login")}
              className="ml-2 inline-flex items-center justify-center px-5 py-2 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10"
              style={{
                color: defaultTextColor,
                borderColor: defaultTextColor,
                backgroundColor:
                  bgColor !== "transparent" ? "#F7F7F7" : "transparent",
              }}
            >
              Login
            </button>
          </nav>
        </div>

        {/* Mobile nav menu */}
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
                {menuItems.map(({ label, route }) => {
                  const isActive = location.pathname === route;
                  const color = isActive ? "#D2663A" : "#000";

                  return (
                    <button
                      key={route}
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(route);
                        if (scrollToSection) scrollToSection(route);
                      }}
                      className="font-[glancyr] text-base font-normal transition-all duration-200 rounded p-2 hover:bg-black/10"
                      style={{ color }}
                    >
                      {label}
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    navigate("/getmembership");
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
                    navigate("/login");
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
