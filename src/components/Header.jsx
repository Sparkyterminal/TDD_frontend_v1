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

  const isHome = location.pathname === "/";

  const bgColor = isHome && !isSticky ? "transparent" : "#ebe5db";

  const defaultTextColor = bgColor === "transparent" ? "#FFFFFF" : "#000000";

  const logoSrc =
    bgColor === "transparent"
      ? "assets/tdd-logo-white.png"
      : "assets/tdd-logo.png";

  // Tabs all route to "/" but have tabKey to identify which tab to activate
  const menuItems = [
    { label: "Home", route: "/", tabKey: null },
    { label: "Dance Classes", route: "/", tabKey: "dance_classes" },
    { label: "Group Fitness Classes", route: "/", tabKey: "group_classes" },
    { label: "Kids Classes", route: "/", tabKey: "kids_classes" },
    { label: "Workshops", route: "/workshops" },
    { label: "Rent our space", route: "/rent" },
    { label: "Contact us", route: "/contact" },
  ];

  const instagramUrl = "https://www.instagram.com/thedancedistrictbysahitya/";

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
          <div
            className="flex flex-shrink-0 items-center h-12 cursor-pointer"
            onClick={() => {
              if (location.pathname === "/") {
                // Scroll to top when home clicked
                if (typeof scrollToSection === "function") {
                  scrollToSection({ target: "top" });
                }
              } else {
                navigate("/");
              }
            }}
          >
            <img
              src={logoSrc}
              alt="The Dance District Logo"
              style={{ height: 58 }}
              className="transition-all duration-300"
            />
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Instagram image for mobile */}
            <div
              onClick={() => window.open(instagramUrl, "_blank")}
              role="button"
              aria-label="Instagram"
              className="text-current cursor-pointer"
              style={{ color: defaultTextColor }}
            >
              <img
                src="assets/instagram.png"
                alt="Instagram"
                className="w-8 h-8"
              />
            </div>

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
          <nav className="hidden md:flex md:items-center md:space-x-6 lg:ml-24">
            {menuItems.map(({ label, route, tabKey }) => {
              const isActive =
                (!tabKey && location.pathname === route) ||
                (tabKey && location.pathname === "/" && scrollToSection && false);

              const color = isActive ? "#D2663A" : defaultTextColor;

              return (
                <button
                  key={label}
                  onClick={() => {
                    setMenuOpen(false);

                    if (route === "/") {
                      // Only call scrollToSection on explicit user clicks
                      if (typeof scrollToSection === "function") {
                        if (tabKey) {
                          scrollToSection({ target: "tab-section", tab: tabKey });
                        } else {
                          scrollToSection({ target: "top" });
                        }
                      }
                      if (location.pathname !== "/") {
                        navigate("/", { replace: false });
                      }
                      return;
                    }
                    // Navigate normally to other pages
                    navigate(route);
                  }}
                  className="font-[glancyr] text-base font-normal transition-all duration-200 rounded focus:outline-none hover:opacity-70 cursor-pointer"
                  style={{ color }}
                >
                  {label}
                </button>
              );
            })}

            {/* Instagram icon */}
            <div
              onClick={() => window.open(instagramUrl, "_blank")}
              role="button"
              aria-label="Instagram"
              className="ml-4 inline-flex items-center justify-center cursor-pointer"
            >
              <div className="w-10 h-10">
                <img
                  src="assets/instagram.png"
                  alt="Instagram"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
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
                {menuItems.map(({ label, route, tabKey }) => {
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setMenuOpen(false);
                        if (route === "/") {
                          if (typeof scrollToSection === "function") {
                            if (tabKey) {
                              scrollToSection({ target: "tab-section", tab: tabKey });
                            } else {
                              scrollToSection({ target: "top" });
                            }
                          }
                          if (location.pathname !== "/") {
                            navigate("/", { replace: false });
                          }
                          return;
                        }
                        navigate(route);
                      }}
                      className="font-[glancyr] text-base font-normal transition-all duration-200 rounded p-2 hover:bg-black/10 cursor-pointer"
                    >
                      {label}
                    </button>
                  );
                })}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center p-2 hover:bg-black/10 rounded cursor-pointer"
                  style={{ color: "#000" }}
                  onClick={() => setMenuOpen(false)}
                >
                  <img
                    src="assets/instagram.png"
                    alt="Instagram"
                    className="w-6 h-6"
                  />
                  <span className="ml-2 font-[glancyr] text-base">Instagram</span>
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
