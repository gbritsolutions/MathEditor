import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";

export default function Demo() {
  const navigate = useNavigate();
  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    const decodedToken = jwtDecode(response.credential);
    console.log("decodedToken", decodedToken);

    if (decodedToken.email_verified === true) {
      navigate("/sign_in");
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <Container>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy="single_host_origin"
          shape="pill"
        />
        <br />
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy="single_host_origin"
          shape="pill"
          size="small"
          text="signup_with"
          width={280}
        />

        <br />
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy="single_host_origin"
          shape="pill"
          text="continue_with"
        />

        <br />
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy="single_host_origin"
          shape="pill"
          text="continue_with"
          theme="filled_blue"
        />

        <br />
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy="single_host_origin"
          shape="pill"
          text="continue_with"
          theme="filled_blue"
          type="icon"
        />
      </GoogleOAuthProvider>
    </Container>
  );
}
