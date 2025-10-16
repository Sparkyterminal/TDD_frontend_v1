// import React, { useState, Fragment, useEffect } from "react";
// import { Menu, Transition } from "@headlessui/react";
// import {
//   ChevronDownIcon,
//   UserCircleIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from "@heroicons/react/24/solid";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { logout } from "../reducers/users";
// import { useDispatch, useSelector } from "react-redux";

// const menuItems = [
//   {
//     name: "Home",
//     link: "/userdashboard/home",
//   },
//   {
//     name: "Classes",
//     submenu: [
//       { name: "Book a class", link: "/userdashboard/bookclass" },
//       { name: "Enrolled classes", link: "/userdashboard/enrolled" },
//     ],
//   },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function UserDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const name = useSelector((state) => state.user.value.name || "USER");

//   const [currentPage, setCurrentPage] = useState("Home");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const path = location.pathname.toLowerCase();
//     if (path.includes("/userdashboard/home")) {
//       setCurrentPage("Home");
//     } else if (path.includes("/userdashboard/bookclass")) {
//       setCurrentPage("Book a class");
//     } else if (path.includes("/userdashboard/enrolled")) {
//       setCurrentPage("Enrolled classes");
//     } else {
//       setCurrentPage("");
//     }
//   }, [location]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login", { replace: true });
//   };

//   const handleNavigate = (name, link) => {
//     setCurrentPage(name);
//     navigate(link);
//     setMobileMenuOpen(false);
//   };

//   const handleChangePassword = () => {
//     navigate("/userdashboard/changepassword");
//   };

//   return (
//     <>
//       <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-black font-[glancyr]">
//         {/* Fixed Header */}
//         <header className="fixed top-0 left-0 right-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 z-40">
//           <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
//             {/* Left: Logo and Greeting */}
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
//                 <img
//                   src="/assets/tdd-logo.png"
//                   alt="Logo"
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//               <span className="hidden lg:inline-block text-xl sm:text-2xl font-medium text-[#785EE2]">
//                 Welcome back, {name}!
//               </span>
//               <span className="lg:hidden text-lg sm:text-xl font-medium text-[#785EE2]">
//                 {name}
//               </span>
//             </div>

//             {/* Middle: Desktop Navigation Menu */}
//             <nav className="hidden md:flex space-x-4 items-center font-medium text-black flex-1 justify-center">
//               {menuItems.map((item) =>
//                 item.submenu ? (
//                   <Menu
//                     as="div"
//                     className="relative inline-block text-left"
//                     key={item.name}
//                   >
//                     <Menu.Button className="inline-flex items-center gap-1 hover:text-[#FEF5E6] hover:bg-black px-3 py-2 rounded-md transition-colors duration-200">
//                       {item.name}
//                       <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
//                     </Menu.Button>

//                     <Transition
//                       as={Fragment}
//                       enter="transition ease-out duration-100"
//                       enterFrom="transform opacity-0 scale-95"
//                       enterTo="transform opacity-100 scale-100"
//                       leave="transition ease-in duration-75"
//                       leaveFrom="transform opacity-100 scale-100"
//                       leaveTo="transform opacity-0 scale-95"
//                     >
//                       <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
//                         <div className="py-1">
//                           {item.submenu.map((sub) => (
//                             <Menu.Item key={sub.name}>
//                               {({ active }) => (
//                                 <button
//                                   onClick={() =>
//                                     handleNavigate(sub.name, sub.link)
//                                   }
//                                   className={classNames(
//                                     currentPage === sub.name
//                                       ? "bg-black text-[#FEF5E6]"
//                                       : active
//                                       ? "bg-gray-100 text-black"
//                                       : "text-black",
//                                     "block w-full text-left px-4 py-2 text-sm"
//                                   )}
//                                 >
//                                   {sub.name}
//                                 </button>
//                               )}
//                             </Menu.Item>
//                           ))}
//                         </div>
//                       </Menu.Items>
//                     </Transition>
//                   </Menu>
//                 ) : (
//                   <button
//                     key={item.name}
//                     onClick={() => handleNavigate(item.name, item.link)}
//                     className={classNames(
//                       currentPage === item.name
//                         ? "bg-black text-[#FEF5E6]"
//                         : "hover:bg-black hover:text-[#FEF5E6]",
//                       "px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none font-medium"
//                     )}
//                   >
//                     {item.name}
//                   </button>
//                 )
//               )}
//             </nav>

//             {/* Right: Hamburger (Mobile) and Profile (Desktop) */}
//             <div className="flex items-center gap-2">
//               {/* Hamburger Menu Button - Mobile Only */}
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
//               >
//                 {mobileMenuOpen ? (
//                   <XMarkIcon className="w-6 h-6 text-black" />
//                 ) : (
//                   <Bars3Icon className="w-6 h-6 text-black" />
//                 )}
//               </button>

//               {/* Profile Dropdown - Desktop Only */}
//               <Menu
//                 as="div"
//                 className="hidden md:block relative inline-block text-left"
//               >
//                 <Menu.Button className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black rounded-full hover:bg-gray-100 p-1">
//                   <UserCircleIcon className="w-8 h-8 text-black" />
//                 </Menu.Button>

//                 <Transition
//                   as={Fragment}
//                   enter="transition ease-out duration-100"
//                   enterFrom="transform opacity-0 scale-95"
//                   enterTo="transform opacity-100 scale-100"
//                   leave="transition ease-in duration-75"
//                   leaveFrom="transform opacity-100 scale-100"
//                   leaveTo="transform opacity-0 scale-95"
//                 >
//                   <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
//                     <div className="py-1">
//                       <Menu.Item>
//                         {({ active }) => (
//                           <button
//                             onClick={handleChangePassword}
//                             className={classNames(
//                               active ? "bg-black text-[#FEF5E6]" : "text-black",
//                               "block w-full text-left px-4 py-2 text-sm"
//                             )}
//                           >
//                             Change Password
//                           </button>
//                         )}
//                       </Menu.Item>
//                       <Menu.Item>
//                         {({ active }) => (
//                           <button
//                             onClick={handleLogout}
//                             className={classNames(
//                               active ? "bg-black text-[#FEF5E6]" : "text-black",
//                               "block w-full text-left px-4 py-2 text-sm"
//                             )}
//                           >
//                             Logout
//                           </button>
//                         )}
//                       </Menu.Item>
//                     </div>
//                   </Menu.Items>
//                 </Transition>
//               </Menu>
//             </div>
//           </div>

//           {/* Mobile Menu Dropdown */}
//           <Transition
//             show={mobileMenuOpen}
//             as={Fragment}
//             enter="transition ease-out duration-200"
//             enterFrom="transform opacity-0 -translate-y-2"
//             enterTo="transform opacity-100 translate-y-0"
//             leave="transition ease-in duration-150"
//             leaveFrom="transform opacity-100 translate-y-0"
//             leaveTo="transform opacity-0 -translate-y-2"
//           >
//             <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
//               <nav className="px-4 py-3 space-y-1">
//                 {menuItems.map((item) => {
//                   if (!item.submenu) {
//                     return (
//                       <button
//                         key={item.name}
//                         onClick={() => handleNavigate(item.name, item.link)}
//                         className={classNames(
//                           currentPage === item.name
//                             ? "bg-black text-[#FEF5E6]"
//                             : "hover:bg-gray-100 text-black",
//                           "block w-full text-left px-4 py-3 rounded-md transition-colors duration-200 font-medium"
//                         )}
//                       >
//                         {item.name}
//                       </button>
//                     );
//                   } else {
//                     return (
//                       <div key={item.name} className="space-y-1">
//                         <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
//                           {item.name}
//                         </div>
//                         {item.submenu.map((sub) => (
//                           <button
//                             key={sub.name}
//                             onClick={() => handleNavigate(sub.name, sub.link)}
//                             className={classNames(
//                               currentPage === sub.name
//                                 ? "bg-black text-[#FEF5E6]"
//                                 : "hover:bg-gray-100 text-black",
//                               "block w-full text-left px-6 py-3 rounded-md transition-colors duration-200 font-medium"
//                             )}
//                           >
//                             {sub.name}
//                           </button>
//                         ))}
//                       </div>
//                     );
//                   }
//                 })}

//                 {/* Mobile Profile Options */}
//                 <div className="pt-3 border-t border-gray-200 space-y-1">
//                   <button
//                     onClick={handleChangePassword}
//                     className="block w-full text-left px-4 py-3 rounded-md hover:bg-gray-100 text-black font-medium transition-colors duration-200"
//                   >
//                     Change Password
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-3 rounded-md hover:bg-gray-100 text-black font-medium transition-colors duration-200"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </nav>
//             </div>
//           </Transition>
//         </header>

//         {/* Content Area */}
//         <main className="flex-grow pt-20 sm:pt-24 pb-6 w-full flex justify-center px-4 mt-8">
//           <div
//             className="bg-white rounded-lg w-full max-w-7xl"
//             style={{
//               minHeight: "400px",
//             }}
//           >
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }
import React, { useState, Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, BookOpen, Lock, LogOut, Sparkles } from "lucide-react";
import { logout } from "../reducers/users";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";

const menuItems = [
  {
    name: "Home",
    link: "/userdashboard/home",
    icon: Home,
  },
  {
    name: "Classes",
    icon: Calendar,
    submenu: [
      {
        name: "Book a class",
        link: "/userdashboard/bookclass",
        icon: BookOpen,
      },
      {
        name: "Enrolled classes",
        link: "/userdashboard/enrolled",
        icon: Calendar,
      },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  //   const name = useSelector((state) => state.user.value.name || "USER");

  const [currentPage, setCurrentPage] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/userdashboard/home")) {
      setCurrentPage("Home");
    } else if (path.includes("/userdashboard/bookclass")) {
      setCurrentPage("Book a class");
    } else if (path.includes("/userdashboard/enrolled")) {
      setCurrentPage("Enrolled classes");
    } else {
      setCurrentPage("");
    }
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleNavigate = (name, link) => {
    setCurrentPage(name);
    navigate(link);
    setMobileMenuOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/userdashboard/changepassword");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-[glancyr]">
      {/* Enhanced Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg"
            : "bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-blue-50/50"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-28 sm:h-30">
          {/* Left: Logo and Greeting */}
          <div
            className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/userdashboard/home")}
            role="button"
            aria-label="Go to home"
          >
            <img
              src="/assets/tdd-logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div
            className="cursor-pointer ml-4"
            onClick={() => navigate("/userdashboard/home")}
            role="button"
          >
            <span className="hidden md:block text-3xl sm:text-2xl lg:text-3xl font-bold text-amber-400">
              The Dance District
            </span>
            {/* <span className="text-xl font-bold text-amber-400">
              The Dance District
            </span> */}
            <p className="hidden md:block text-sm text-gray-500">
              Let's make today amazing
            </p>
          </div>

          {/* Middle: Desktop Navigation Menu */}
          <nav className="hidden md:flex space-x-2 items-center font-medium flex-1 justify-center">
            {menuItems.map((item) =>
              item.submenu ? (
                <Menu
                  as="div"
                  className="relative inline-block text-left"
                  key={item.name}
                >
                  <Menu.Button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white text-gray-700 font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                      <div className="py-2">
                        {item.submenu.map((sub) => (
                          <Menu.Item key={sub.name}>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  handleNavigate(sub.name, sub.link)
                                }
                                className={classNames(
                                  currentPage === sub.name
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                    : active
                                    ? "bg-purple-50 text-gray-900"
                                    : "text-gray-700",
                                  "flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer"
                                )}
                              >
                                <sub.icon className="w-4 h-4" />
                                {sub.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.name, item.link)}
                  className={classNames(
                    currentPage === item.name
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : "bg-white/50 text-gray-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white",
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              )
            )}
          </nav>

          {/* Right: Hamburger (Mobile) and Profile (Desktop) */}
          <div className="flex items-center gap-2">
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white text-gray-700 transition-all duration-200 shadow-sm cursor-pointer"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>

            {/* Profile Dropdown - Desktop Only */}
            <Menu
              as="div"
              className="hidden md:block relative inline-block text-left"
            >
              <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 cursor-pointer">
                <UserCircleIcon className="w-6 h-6" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleChangePassword}
                          className={classNames(
                            active
                              ? "bg-purple-50 text-gray-900"
                              : "text-gray-700",
                            "flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer"
                          )}
                        >
                          <Lock className="w-4 h-4" />
                          Change Password
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? "bg-red-50 text-red-600" : "text-gray-700",
                            "flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer"
                          )}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <Transition
          show={mobileMenuOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 -translate-y-2"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-2"
        >
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg shadow-xl">
            <nav className="px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                if (!item.submenu) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.name, item.link)}
                      className={classNames(
                        currentPage === item.name
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                          : "bg-purple-50 text-gray-700 hover:bg-purple-100",
                        "flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold cursor-pointer"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                } else {
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </div>
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => handleNavigate(sub.name, sub.link)}
                          className={classNames(
                            currentPage === sub.name
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                              : "bg-purple-50 text-gray-700 hover:bg-purple-100",
                            "flex items-center gap-3 w-full text-left px-6 py-3 rounded-xl transition-all duration-200 font-medium ml-2 cursor-pointer"
                          )}
                        >
                          <sub.icon className="w-4 h-4" />
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  );
                }
              })}

              {/* Mobile Profile Options */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleChangePassword}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl bg-purple-50 text-gray-700 hover:bg-purple-100 font-medium transition-all duration-200 cursor-pointer"
                >
                  <Lock className="w-5 h-5" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </Transition>
      </header>

      {/* Content Area */}
      <main className="flex-grow pt-20 sm:pt-24 pb-6 w-full flex justify-center px-4 mt-10">
        <div className=" w-full max-w-7xl overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
