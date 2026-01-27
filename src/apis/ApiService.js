import axiosClient from "./Api";

// Add Form Api's

const addFormulas = async (values, token, isGoogleLogin) => {
  try {
    const response = await axiosClient.post(`/formulas/addFormulas`, values, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
        isGoogleLogin: isGoogleLogin,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const updateFormulas = async (values, token, isGoogleLogin) => {
  try {
    const response = await axiosClient.put("/formulas/updateFormulas", values, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
        isGoogleLogin: isGoogleLogin,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const getAllFormulas = async (token, isGoogleLogin) => {
  try {
    const response = await axiosClient.get("/formulas/getAllFormulas", {
      headers: {
        Authorization: token,
        isGoogleLogin: isGoogleLogin,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

// Outer Screen Api's

const forgotPassword = async (user, url) => {
  try {
    const response = await axiosClient.post("/register/forgotPassword", null, {
      headers: {
        userEmail: user.userEmail,
        url: url,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const JWTverifiedToken = async (token) => {
  return axiosClient
    .get(`/user/verifyToken`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const postUserData = async (user, domain) => {
  try {
    const response = await axiosClient.post(`/register/save`, user, {
      headers: { domain: domain },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const recoverPassword = async (user, resetToken) => {
  try {
    const response = await axiosClient.post("/register/setPassword", null, {
      params: {
        token: resetToken,
        password: user.password,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const resetPassword = async (userId, orgId, oldPassword, currentPassword) => {
  try {
    const response = await axiosClient.post(`/register/passwordReset`, null, {
      headers: {
        userId: userId,
        orgId: orgId,
        oldPassword: oldPassword,
        currentPassword: currentPassword,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const SignIn = async (user) => {
  try {
    const response = await axiosClient.post(`/user/login`, user, {
      headers: {
        token: null,
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

const googleSignIn = async (googleToken) => {
  try {
    const response = await axiosClient.post(`/user/login`, undefined, {
      headers: {
        token: googleToken,
      },
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};

const SignUp = async (user, verifyToken) => {
  try {
    const response = await axiosClient.post(
      `/register/completeUserRegistration`,
      user,
      {
        headers: {
          "Content-Type": "application/json",
          token: verifyToken,
          orgNameWithId: "null",
          orgName: "null",
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

const verifiedToken = async (verifyToken) => {
  return axiosClient
    .get(`/register/verifyToken`, {
      params: {
        token: verifyToken,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

const verifyResetPasswordToken = async (token) => {
  try {
    const response = await axiosClient.get(
      "/register/verifyResetPasswordToken",
      {
        params: { token: token },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

const ApiService = {
  // Math editor Api's
  addFormulas,
  updateFormulas,
  getAllFormulas,

  // Outer Screen Api's
  forgotPassword,
  JWTverifiedToken,
  postUserData,
  recoverPassword,
  resetPassword,
  SignIn,
  googleSignIn,
  SignUp,
  verifiedToken,
  verifyResetPasswordToken,
};

export default ApiService;
