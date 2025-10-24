import { useLocation } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";

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
// import GetMembership from "./pages/GetMembership";
import Login from "./pages/Login";
import LoadingPage from "./pages/LoadingPage";
import LayoutFixed from "./LayoutFixed/LayoutFixed";
import ViewUsersInWorkshop from "./Dashboard/Admin/Workshops/ViewUsersInWorkshop";
import AddWorkshop from "./Dashboard/Admin/Workshops/AddWorkshop";
import EditWorkshop from "./Dashboard/Admin/Workshops/EditWorkshop";
import ViewWorkshop from "./Dashboard/Admin/Workshops/ViewWorkshop";
import AddClassType from "./Dashboard/Admin/ClassTypes/AddClassType";
import EditClassTypes from "./Dashboard/Admin/ClassTypes/EditClassTypes";
import ViewClassTypes from "./Dashboard/Admin/ClassTypes/ViewClassTypes";
import AddCoach from "./Dashboard/Admin/UserManagement/Coach/AddCoach";
import EditCoach from "./Dashboard/Admin/UserManagement/Coach/EditCoach";
import ViewCoach from "./Dashboard/Admin/UserManagement/Coach/ViewCoach";
// import UserInfoWorkshop from "./pages/UserInfoWorkshop";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import AddMembership from "./Dashboard/Admin/Membership/AddMembership";
import EditMembership from "./Dashboard/Admin/Membership/EditMembership";
import ViewMembership from "./Dashboard/Admin/Membership/ViewMembership";
import MembershipUsers from "./Dashboard/Admin/Membership/MembershipUsers";
import MembershipForm from "./pages/MembershipForm";
import AddClasses from "./Dashboard/Admin/BookingClasses/AddClasses";
import EditClasses from "./Dashboard/Admin/BookingClasses/EditClasses";
import ViewClasses from "./Dashboard/Admin/BookingClasses/ViewClasses";
// import UserDashboard from "./LayoutFixed/UserLayout";
// import UserHomePage from "./Dashboard/User/UserHomePage";
// import Bookclasses from "./Dashboard/User/classes/Bookclasses";
// import ChangePassword from "./Dashboard/User/ChangePassword";
// import EnrolledClasses from "./Dashboard/User/classes/EnrolledClasses";
import UsersClasses from "./Dashboard/Admin/BookingClasses/UsersClasses";
import TermsandConditions from "./pages/TermsandConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import WorkshopDetails from "./pages/WorkshopDetails";
import MembershipPage from "./pages/MembershipPage";
import PublicLayout from "./components/PublicLayout";
import ViewEnquiry from "./Dashboard/Admin/Forms/ViewEnquiry";
import ViewContactus from "./Dashboard/Admin/Forms/ViewContactus";
import BookaDemo from "./pages/BookaDemo";
import DemoUserDetails from "./Dashboard/Admin/DemoClasses/DemoUserDetails";
import AllUserDetails from "./Dashboard/Admin/AllUsers/AllUserDetails";
import RenewalForm from "./Dashboard/Admin/RenewalForm/RenewalForm";
// import LoadingPage from "./components/LoadingPage"; // Import your custom LoadingPage

const App = () => {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const user = useSelector((state) => state.user.value);

  const isAdmin = ROLES.ADMIN === user?.role;
  // const isUser = ROLES.USER === user?.role;

  // Handle initial loading (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle authentication check
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

    // Only run auth check after initial loading is done
    if (!showInitialLoading) {
      checkAuth();
    }
  }, [user?.is_logged_in, user?.access_token, showInitialLoading]);

  // Show loading page during initial load or auth verification
  if (showInitialLoading || isLoading || auth === null) {
    return <LoadingPage />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* If NOT logged in → show public pages */}
        {!auth ? (
          // <>
          //   <Route path="/" element={<Homepage />} />
          //   <Route path="/instructors" element={<Instructors />} />
          //   <Route path="/rent" element={<Rentals />} />
          //   <Route path="/workshops" element={<Workshops />} />
          //   <Route path="/book-workshop/:id" element={<UserInfoWorkshop />} />
          //   <Route path="/contact" element={<Contact />} />
          //   <Route path="/getmembership" element={<MembershipPage />} />
          //   <Route path="membershipform/:id" element={<MembershipForm />} />
          //   <Route path="/login" element={<Login />} />
          //   <Route path="/payment-success" element={<Success />} />
          //   <Route path="/payment-failure" element={<Failure />} />
          //   <Route path="/termsandconditions" element={<TermsandConditions />} />
          //   <Route path="/privacy" element={<PrivacyPolicy />} />
          //   <Route path="/refund" element={<RefundPolicy />} />
          //   <Route path="/workshopdetails/:id" element={<WorkshopDetails />} />
          //   <Route path="*" element={<Navigate to="/" replace />} />
          // </>
          <>
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Homepage />
                </PublicLayout>
              }
            />
            <Route
              path="/instructors"
              element={
                <PublicLayout>
                  <Instructors />
                </PublicLayout>
              }
            />
            <Route
              path="/rent"
              element={
                <PublicLayout>
                  <Rentals />
                </PublicLayout>
              }
            />
            <Route
              path="/workshops"
              element={
                <PublicLayout>
                  <Workshops />
                </PublicLayout>
              }
            />
            {/* <Route path="/book-workshop/:id" element={<PublicLayout><UserInfoWorkshop /></PublicLayout>} /> */}
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <Contact />
                </PublicLayout>
              }
            />
            <Route
              path="/getmembership"
              element={
                <PublicLayout>
                  <MembershipPage />
                </PublicLayout>
              }
            />
            <Route path="membershipform/:id" element={<MembershipForm />} />
            <Route path="demoform/:id" element={<BookaDemo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment-success" element={<Success />} />
            <Route path="/payment-failure" element={<Failure />} />

            <Route
              path="/termsandconditions"
              element={
                <PublicLayout>
                  <TermsandConditions />
                </PublicLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <PublicLayout>
                  <PrivacyPolicy />
                </PublicLayout>
              }
            />
            <Route
              path="/refund"
              element={
                <PublicLayout>
                  <RefundPolicy />
                </PublicLayout>
              }
            />
            <Route path="/workshopdetails/:id" element={<WorkshopDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : isAdmin ? (
          /* If logged in & admin → allow dashboard */
          <>
            <Route path="/dashboard" element={<LayoutFixed />}>
              <Route index element={<Navigate to="workshopusers" replace />} />
              <Route path="workshopusers" element={<ViewUsersInWorkshop />} />
              <Route path="addworkshop" element={<AddWorkshop />} />
              <Route path="editworkshop/:id" element={<EditWorkshop />} />
              <Route path="viewworkshop" element={<ViewWorkshop />} />
              <Route path="addclasstypes" element={<AddClassType />} />
              <Route path="editclasstypes/:id" element={<EditClassTypes />} />
              <Route path="viewclasstypes" element={<ViewClassTypes />} />
              <Route path="addcoach" element={<AddCoach />} />
              <Route path="editcoach/:id" element={<EditCoach />} />
              <Route path="viewcoach" element={<ViewCoach />} />
              <Route path="addmembership" element={<AddMembership />} />
              <Route path="editmembership/:id" element={<EditMembership />} />
              <Route path="viewmembership" element={<ViewMembership />} />
              <Route path="membershipusers" element={<MembershipUsers />} />
              <Route path="addclasses" element={<AddClasses />} />
              <Route path="editclasses/:id" element={<EditClasses />} />
              <Route path="viewclasses" element={<ViewClasses />} />
              <Route path="viewclassusers" element={<UsersClasses />} />
              <Route path="viewcontactform" element={<ViewContactus />} />
              <Route path="viewenquireform" element={<ViewEnquiry />} />
              <Route path="viewdemousers" element={<DemoUserDetails />} />
              <Route path="viewallusers" element={<AllUserDetails />} />
              <Route path="renewalform/:id" element={<RenewalForm />} />
              <Route path="payment-success" element={<Success />} />
              <Route path="payment-failure" element={<Failure />} />
              <Route
                path="*"
                element={<Navigate to="workshopusers" replace />}
              />
            </Route>
          </>
        ) : (
          // ) : isUser ? (
          //   /* If logged in & admin → allow dashboard */
          //   <>
          //     <Route path="/userdashboard" element={<UserDashboard />}>
          //       <Route index element={<Navigate to="home" replace />} />

          //       <Route path="home" element={<UserHomePage />} />

          //       <Route path="bookclass" element={<Bookclasses />} />

          //       <Route path="enrolled" element={<EnrolledClasses />} />

          //       <Route path="changepassword" element={<ChangePassword />} />
          //     </Route>
          //   </>
          // ) :
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
