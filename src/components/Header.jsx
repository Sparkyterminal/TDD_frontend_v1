// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const Header = ({ scrollToSection }) => {
//   const [isSticky, setIsSticky] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY > 0);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Determine if on homepage exact path
//   const isHome = location.pathname === "/";

//   // Background color: transparent only if on homepage and not scrolled
//   const bgColor = isHome && !isSticky ? "transparent" : "#ebe5db";

//   // Default text color is black when bgColor is #EBE5DB, white when transparent
//   const defaultTextColor = bgColor === "transparent" ? "#FFFFFF" : "#000000";

//   const logoSrc =
//     bgColor === "transparent"
//       ? "assets/tdd-logo-white.png"
//       : "assets/tdd-logo.png";

//   // Define menu items with their corresponding routes
//   const menuItems = [
//     { label: "Home", route: "/" },
//     { label: "Instructors", route: "/instructors" },
//     { label: "Rent our space", route: "/rent" },
//     { label: "Workshops", route: "/workshops" },
//     { label: "Contact us", route: "/contact" },
//   ];

//   return (
//     <header
//       style={{ backgroundColor: bgColor }}
//       className={`fixed inset-x-0 top-0 z-30 py-4 xl:py-6 transition-colors duration-300 ${
//         bgColor !== "transparent" ? "shadow-md" : ""
//       }`}
//     >
//       <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex flex-shrink-0 items-center h-12">
//             <img
//               src={logoSrc}
//               alt="The Dance District Logo"
//               style={{ height: 58 }}
//               className="transition-all duration-300"
//             />
//           </div>
//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               type="button"
//               className="p-2 -m-2 rounded-full focus:outline-none hover:bg-black/10 transition-colors duration-200"
//               onClick={() => setMenuOpen(!menuOpen)}
//               aria-label="Toggle menu"
//               style={{ color: defaultTextColor }}
//             >
//               {menuOpen ? (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>

//           {/* Desktop nav */}
//           <nav className="hidden md:flex md:items-center md:space-x-8 lg:ml-24">
//             {menuItems.map(({ label, route }) => {
//               // If current path matches route => active color #D2663A else default text color
//               const isActive = location.pathname === route;
//               const color = isActive ? "#D2663A" : defaultTextColor;

//               return (
//                 <button
//                   key={route}
//                   onClick={() => {
//                     setMenuOpen(false);
//                     navigate(route);
//                     if (scrollToSection) scrollToSection(route);
//                   }}
//                   className="font-[glancyr] text-base font-normal transition-all duration-200 rounded focus:outline-none hover:opacity-70 cursor-pointer"
//                   style={{ color }}
//                 >
//                   {label}
//                 </button>
//               );
//             })}
//             <button
//               onClick={() => navigate("/getmembership")}
//               className="ml-4 inline-flex items-center justify-center px-5 py-2 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10 cursor-pointer"
//               style={{
//                 color: defaultTextColor,
//                 borderColor: defaultTextColor,
//               }}
//             >
//               Get Membership
//             </button>
//             <button
//               onClick={() => navigate("/login")}
//               className="ml-2 inline-flex items-center justify-center px-5 py-2 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10 cursor-pointer"
//               style={{
//                 color: defaultTextColor,
//                 borderColor: defaultTextColor,
//                 backgroundColor:
//                   bgColor !== "transparent" ? "#F7F7F7" : "transparent",
//               }}
//             >
//               Login
//             </button>
//           </nav>
//         </div>

//         {/* Mobile nav menu */}
//         {menuOpen && (
//           <div className="md:hidden mt-4">
//             <div
//               className="rounded-lg p-6 shadow-lg border"
//               style={{
//                 backgroundColor: "#EBE5DB",
//                 borderColor: "#CCC9C4",
//               }}
//             >
//               <nav className="flex flex-col space-y-4">
//                 {menuItems.map(({ label, route }) => {
//                   const isActive = location.pathname === route;
//                   const color = isActive ? "#D2663A" : "#000";

//                   return (
//                     <button
//                       key={route}
//                       onClick={() => {
//                         setMenuOpen(false);
//                         navigate(route);
//                         if (scrollToSection) scrollToSection(route);
//                       }}
//                       className="font-[glancyr] text-base font-normal transition-all duration-200 rounded p-2 hover:bg-black/10 cursor-pointer"
//                       style={{ color }}
//                     >
//                       {label}
//                     </button>
//                   );
//                 })}
//                 <button
//                   onClick={() => {
//                     navigate("/getmembership");
//                     setMenuOpen(false);
//                   }}
//                   className="cursor-pointer inline-flex items-center justify-center px-5 py-3 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10 mt-4"
//                   style={{
//                     color: "#000",
//                     borderColor: "#000",
//                   }}
//                 >
//                   Get Membership
//                 </button>
//                 <button
//                   onClick={() => {
//                     navigate("/login");
//                     setMenuOpen(false);
//                   }}
//                   className="cursor-pointer inline-flex items-center justify-center px-5 py-3 font-[glancyr] text-base leading-6 transition-all duration-200 border rounded-full focus:outline-none hover:bg-black/10 mt-2"
//                   style={{
//                     color: "#000",
//                     borderColor: "#000",
//                   }}
//                 >
//                   Login
//                 </button>
//               </nav>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
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

  // Updated menu items as requested
  const menuItems = [
    { label: "Home", route: "/" },
    { label: "Dance Classes", route: "/dance-classes" },
    { label: "Group Classes", route: "/group-classes" },
    { label: "Kids Classes", route: "/kids-classes" },
    { label: "Workshops", route: "/workshops" },
    { label: "Rent our space", route: "/rent" },
    { label: "Contact us", route: "/contact" },
  ];

  // Instagram URL
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
          className="flex flex-shrink-0 items-center h-12">
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
              <img src="assets/instagram.png" alt="Instagram" className="w-8 h-8" />
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
            {menuItems.map(({ label, route }) => {
              const isActive = location.pathname === route;
              const color = isActive ? "#D2663A" : defaultTextColor;

              return (
                <button
                  key={route}
                  onClick={() => {
                    setMenuOpen(false);
                    // for the three items below, navigate to home and request Homepage to scroll to TabSection
                    if (
                      route === "/dance-classes" ||
                      route === "/group-classes" ||
                      route === "/kids-classes"
                    ) {
                      // if already on home, call scrollToSection directly (if provided)
                      if (location.pathname === "/" && typeof scrollToSection === "function") {
                        // pass optional tab key (route) for future use
                        scrollToSection({ target: "tab-section", tab: route });
                        return;
                      }
                      // otherwise navigate to home and provide state so Homepage can scroll after mount
                      navigate("/", { state: { scrollTo: "tab-section", tab: route } });
                      return;
                    }

                    navigate(route);
                    if (scrollToSection) scrollToSection(route);
                  }}
                  className="font-[glancyr] text-base font-normal transition-all duration-200 rounded focus:outline-none hover:opacity-70 cursor-pointer"
                  style={{ color }}
                >
                  {label}
                </button>
              );
            })}

            {/* Instagram image (clickable) */}
            <div
              onClick={() => window.open(instagramUrl, "_blank")}
              role="button"
              aria-label="Instagram"
              className="ml-4 inline-flex items-center justify-center cursor-pointer"
            >
              <div className="w-10 h-10">
                <img src="assets/instagram.png" alt="Instagram" className="w-full h-full object-contain" />
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
                      className="font-[glancyr] text-base font-normal transition-all duration-200 rounded p-2 hover:bg-black/10 cursor-pointer"
                      style={{ color }}
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
                  <img src="assets/instagram.png" alt="Instagram" className="w-6 h-6" />
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
