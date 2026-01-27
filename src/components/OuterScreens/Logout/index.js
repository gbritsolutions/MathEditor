import { useNavigate } from "react-router-dom";

export default function Logout({ setIsAuthenticated, setRes }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token here
    setIsAuthenticated(false); //To set frontend authentication
    setRes(false);

    // To remove session storage for logout
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("organizationName");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("beneficiaryId");
    sessionStorage.removeItem("orgId");
    sessionStorage.removeItem("response");
    sessionStorage.removeItem("googleLogin");

    navigate("/sign_in");
  };

  return handleLogout;
}
