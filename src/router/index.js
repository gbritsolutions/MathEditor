import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

// Public Routes
import ForgotPwd from "../components/OuterScreens/ForgotPwd";
import Landing from "../components/OuterScreens/Landing";
import RecoverPwd from "../components/OuterScreens/RecoverPwd";
import Register from "../components/OuterScreens/Register";
import ResetPwd from "../components/OuterScreens/ResetPwd";
import SignIn from "../components/OuterScreens/SignIn";
import SignUp from "../components/OuterScreens/SignUp";
import TermsConditions from "../components/OuterScreens/Terms";

// Message Routes
import AccessDenied from "../components/MessageScreens/accessDenied";
import ForgotSuccess from "../components/MessageScreens/forgotSuccess";
import RegisterSuccess from "../components/MessageScreens/registerSuccess";
import SignUpSuccess from "../components/MessageScreens/signupSuccess";
import TokenVerified from "../components/MessageScreens/tokenVerified";
import VerifyToken from "../components/MessageScreens/verifyToken";

// Private Routes
import TopNav from "../components/layout/TopNav";
import MathEditor from "../components/InnerScreens/MathEditor";
import Demo from "./demo";
import DemoUser from "./demoUser";

function AllRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize isAuthenticated from sessionStorage
    return sessionStorage.getItem("isAuthenticated") === "true";
  });
  const [res, setRes] = useState(() => {
    // Initialize response from sessionStorage
    return sessionStorage.getItem("response") === "JWT token validated.";
  });

  useEffect(() => {
    // Update sessionStorage when isAuthenticated changes
    sessionStorage.setItem("isAuthenticated", isAuthenticated);
    sessionStorage.setItem("res", res);
  }, [isAuthenticated, res]);


  const restoreSessionFromURL = () => {
    const params = new URLSearchParams(window.location.search);
  
    const token = params.get("token");
    const response = params.get("response");
    const organizationName = params.get("organizationName");
    const userName = params.get("userName");
    const beneficiaryId = params.get("beneficiaryId");
    const orgId = params.get("orgId");
    const isAuthenticated = params.get("isAuthenticated");
    const res = params.get("res");
    
    if (token && organizationName && userName && beneficiaryId && orgId) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("response", response);
      sessionStorage.setItem("organizationName", organizationName);
      sessionStorage.setItem("userName", userName);
      sessionStorage.setItem("beneficiaryId", beneficiaryId);
      sessionStorage.setItem("orgId", orgId);
      sessionStorage.setItem("isAuthenticated", isAuthenticated);
      sessionStorage.setItem("res", res);
      console.log("Session restored from URL.");

          // 🔹 Remove token and sensitive data from the URL without reloading
    params.delete("token");
    params.delete("response");
    params.delete("organizationName");
    params.delete("userName");
    params.delete("beneficiaryId");
    params.delete("orgId");
    params.delete("isAuthenticated");
    params.delete("res");

     // 🔹 Update the URL without `?` if no query parameters remain
     const newQueryString = params.toString();
     const newUrl = newQueryString ? `${window.location.pathname}?${newQueryString}` : window.location.pathname;
 
     window.history.replaceState(null, "", newUrl);
    }
  };
  
  // Call before rendering the app
  restoreSessionFromURL();

  return (
    <>
      <Routes>
        {/* Private Routes */}
        {isAuthenticated && res ? (
          <>
            <Route
              element={
                <TopNav
                  setIsAuthenticated={setIsAuthenticated}
                  setRes={setRes}
                />
              }
            >
              <Route path="/mathEditor" element={<MathEditor />} />
            </Route>
          </>
        ) : (
          <Route path="signin" element={<Navigate to="/sign_in" />} />
        )}

        {/* Public Routes */}
        <Route path="/" element={<Outlet />}>
          <Route path="/" element={<Landing />} />
          <Route path="/access_denied" element={<AccessDenied />} />
          <Route path="/register" element={<Register />} />
          <Route path="verify_token" element={<VerifyToken />} />
          <Route path="forgot_pwd" element={<ForgotPwd />} />
          <Route path="forgot_success" element={<ForgotSuccess />} />
          <Route path="recover_pwd" element={<RecoverPwd />} />
          <Route path="register_success" element={<RegisterSuccess />} />
          <Route path="reset_pwd" element={<ResetPwd />} />
          <Route path="signup_success" element={<SignUpSuccess />} />
          <Route
            path="sign_in"
            element={
              <SignIn setIsAuthenticated={setIsAuthenticated} setRes={setRes} />
            }
          />
          <Route path="sign_up" element={<SignUp />} />
          <Route path="terms_conditions" element={<TermsConditions />} />
          <Route path="/token_verified" element={<TokenVerified />} />
          <Route path="demo_user" element={<DemoUser />} />
          <Route path="demo" element={<Demo />} />
        </Route>

        <Route path="*" element={<AccessDenied />} />
        <Route
          path="*"
          element={
            <SignIn setIsAuthenticated={setIsAuthenticated} setRes={setRes} />
          }
        />
      </Routes>
    </>
  );
}

export default AllRouter;
