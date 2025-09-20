import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import verifyToken from "./verifytoken";
import { ROLES } from "../config";
import Instructors from "./pages/Instructors";
import Rentals from "./pages/Rentals";
import Workshops from "./pages/Workshops";
import Contact from "./pages/Contact";
import GetMembership from "./pages/GetMembership";
import Login from "./pages/Login";

const App = () => {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user.value);

  const isAdmin = ROLES.ADMIN === user?.role;

  useEffect(() => {
    function checkAuth() {
      try {
        setIsLoading(true);

        if (user?.is_logged_in && user?.access_token) {
          const checkToken = verifyToken(user.access_token);
          if (checkToken?.status === true) {
            setAuth(true);
          } else {
            setAuth(false);
          }
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setAuth(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [user?.is_logged_in, user?.access_token]);

  if (isLoading || auth === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* If NOT logged in → show public pages */}
        {!auth ? (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/rent" element={<Rentals />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/getmembership" element={<GetMembership />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : isAdmin ? (
          /* If logged in & admin → allow dashboard */
          <>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<Navigate to="getuserinfo" replace />} />
              <Route path="getuserinfo" element={<Getuserinfo />} />
            </Route>
          </>
        ) : (
          /* If logged in but NOT admin → redirect to home or logout */
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
