import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Vortex } from "react-loader-spinner";
import { Box } from "@mui/material";
import ApiService from "../../apis/ApiService";

const VerifyToken = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the hash part of the URL
    const hash = window.location.hash;

    // Remove the leading '#' character
    const verifyToken = hash.slice(1);
    sessionStorage.setItem("verifyToken", verifyToken);

    if (verifyToken) {
      // Redirect to the empty page after successful verification
      ApiService.verifiedToken(verifyToken)
        .then((res) => {
          console.log(res);
          if (
            res &&
            res.status === 200 &&
            res.data.status === "valid" &&
            res.data.email !== null
          ) {
            sessionStorage.setItem("email", res.data.email);
            navigate("/sign_up");
          } else {
            navigate("/token_verified");
          }
        })
        .catch((error) => {
          console.error("Error while verifying token:", error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
        Verifying Token
      </Box>
    </>
  );
};

export default VerifyToken;
