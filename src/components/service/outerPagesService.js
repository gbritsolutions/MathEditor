import ApiService from "../../apis/ApiService";
import toast from "react-hot-toast";
import { decryptAes, encryptPwd } from "../config/fieldConfig";
import { jwtDecode } from "jwt-decode";
import { ORG_ID, USER_ID } from "../config/sessionStorage";
import {
  FORGOT_FAILED1,
  FORGOT_FAILED2,
  PWD_NOT_MATCH,
  RECOVER_FAILED1,
  RECOVER_FAILED2,
  REG_FAILED1,
  REG_FAILED2,
  RESET_FAILED1,
  RESET_FAILED2,
  SIGNIN_FAILED1,
  SIGNIN_FAILED2,
  SIGNUP_FAILED1,
  SIGNUP_FAILED2,
} from "../config/toastMessage";

// Register
const onRegister = async (formData, navigate, domain, setLoading) => {
  try {
    const res = await ApiService.postUserData(formData, domain);

    if (res?.status === 200) {
      navigate("/register_success");
    } else {
      if (res?.response?.data?.error) {
        toast.error(res.response.data.error);
      } else {
        toast.error(REG_FAILED1);
      }
    }
  } catch (error) {
    console.error("An error occurred during registration:", error);
    toast.error(REG_FAILED2);
  } finally {
    setLoading(false); // After the delay, set loading back to false
  }
};

// SignUp
const onSignUp = async (values, navigate, verifyToken, setLoading) => {
  try {
    const res = await ApiService.SignUp(values, verifyToken);

    if (res?.status === 200) {
      navigate("/signup_success");
    } else {
      if (res?.response?.data) {
        navigate("/token_verified");
      } else {
        toast.error(SIGNUP_FAILED1);
      }
    }
  } catch (error) {
    console.error("An error occurred during sign-up:", error);
    toast.error(SIGNUP_FAILED2);
  } finally {
    setLoading(false); // After the delay, set loading back to false
  }
};

// SignIn
const onSignIn = async (
  values,
  navigate,
  setIsAuthenticated,
  setRes,
  setLoading
) => {
  try {
    const res = await ApiService.SignIn(values);
    console.log("res", res);

    if (res?.data?.accessToken) {
      const decryptedText = decryptAes(res.data.accessToken);

      const ress = await ApiService.JWTverifiedToken(res.data.accessToken);
      console.log("ress", ress);

      const decoded = jwtDecode(decryptedText);
      console.log("decoded", decoded);

      sessionStorage.setItem("token", res.data.accessToken);
      sessionStorage.setItem("organizationName", decoded.organizationName);
      sessionStorage.setItem("userName", decoded.userName);
      sessionStorage.setItem("beneficiaryId", decoded.beneficiaryId);
      sessionStorage.setItem("orgId", decoded.organizationId);
      sessionStorage.setItem("response", ress.data);
      sessionStorage.setItem("googleLogin", res.data.googleLogin);

      if (ress?.status === 200) {
        if (
          decoded?.forcePassword === true &&
          decoded?.isMonitoredUser === false
        ) {
          setIsAuthenticated(true);
          setRes(true);
          navigate("/mathEditor");
        } else {
          navigate("/reset_pwd");
        }
      } else {
        navigate("/access_denied");
      }
    } else {
      if (res?.data?.error) {
        toast.error(res.data.error);
      } else {
        // If accessToken is not received or is null
        toast.error(SIGNIN_FAILED1);
      }
    }
  } catch (error) {
    // Handle any errors that occur during the API call
    console.error("An error occurred during sign-in:", error);
    // Notify user about the error
    toast.error(SIGNIN_FAILED2);
  } finally {
    setLoading(false); // Set loading back to false after the API call is done
  }
};

const onGoogleSignIn = async (
  googleToken,
  setIsAuthenticated,
  setRes,
  navigate
) => {
  try {
    const res = await ApiService.googleSignIn(googleToken);
    console.log(res);

    const decodedToken = jwtDecode(res?.data?.accessToken);
    console.log(decodedToken);

    sessionStorage.setItem("token", res.data.accessToken);
    sessionStorage.setItem("userName", decodedToken.name);
    sessionStorage.setItem("response", "JWT token validated.");
    sessionStorage.setItem("googleLogin", res.data.googleLogin);

    if (res?.status === 200) {
      setIsAuthenticated(true);
      setRes(true);
      navigate("/mathEditor");
    } else {
      navigate("/access_denied");
    }
  } catch (error) {
    console.error(error);
    toast.error(SIGNIN_FAILED2);
  }
};

// Forgot Password
const onForgotPwd = async (values, url, navigate, setLoading) => {
  try {
    const res = await ApiService.forgotPassword(values, url);

    if (res?.status === 200) {
      navigate("/forgot_success");
    } else {
      if (res?.response?.data) {
        toast.error(res.response.data);
      } else {
        toast.error(FORGOT_FAILED1);
      }
    }
  } catch (error) {
    // Handle the error as needed, such as displaying an error message to the user
    console.error("An error occurred during forgot password:", error);
    // Notify user about the error
    toast.error(FORGOT_FAILED2);
  } finally {
    setLoading(false); // Set loading back to false regardless of success or failure
  }
};

// Recover Password
const onRecoverPwd = async (user, resetToken, navigate, setLoading) => {
  try {
    if (user.password === user.confirmPassword) {
      const encodePwd = await encryptPwd(user.password);
      user.password = encodePwd;
      user.confirmPassword = "";

      const res = await ApiService.recoverPassword(user, resetToken);

      if (res?.status === 200) {
        toast.success(res.data);
        navigate("/sign_in");
      } else {
        if (res?.response?.data === "Invalid token") {
          navigate("/token_verified");
        } else {
          toast.error(RECOVER_FAILED1);
        }
      }
    } else {
      toast.error(PWD_NOT_MATCH);
    }
  } catch (error) {
    console.error("An error occurred during password recovery:", error);
    toast.error(RECOVER_FAILED2);
  } finally {
    setLoading(false); // Set loading back to false regardless of success or failure
  }
};

// Reset Password
const onResetPwd = async (values, navigate, setLoading) => {
  try {
    if (values.password === values.confirmPassword) {
      const encodeNewPwd = await encryptPwd(values.password);
      values.password = encodeNewPwd;
      values.confirmPassword = "";

      const userId = USER_ID();
      const orgId = ORG_ID();

      const res = await ApiService.resetPassword(
        userId,
        orgId,
        values.oldPassword,
        values.password
      );

      if (res?.status === 200) {
        toast.success(res.data);
        navigate("/sign_in");
      } else {
        // Handle other response statuses
        if (res?.response?.data) {
          toast.error(res.response.data);
        } else {
          toast.error(RESET_FAILED1);
        }
      }
    } else {
      toast.error(PWD_NOT_MATCH);
    }
  } catch (error) {
    // Handle the error appropriately, such as displaying an error message to the user
    console.error("An error occurred during password reset:", error);
    toast.error(RESET_FAILED2);
  } finally {
    setLoading(false); // Set loading back to false regardless of success or failure
  }
};

export {
  onRegister,
  onSignUp,
  onSignIn,
  onGoogleSignIn,
  onForgotPwd,
  onRecoverPwd,
  onResetPwd,
};
