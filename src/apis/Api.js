import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BE_URL,
});

axiosClient.defaults.apiUrl = process.env.REACT_APP_API_URL;

// Recaptcha Site Key
axiosClient.defaults.apiUrl_Recaptcha =
  process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY;

// Forgot Password given URL
axiosClient.defaults.apiUrl_recoverPwd =
  process.env.REACT_APP_API_RECOVER_PWD_URL;

axiosClient.defaults.apiUrl_DemoUser = process.env.REACT_APP_API_DEMO_USER_URL; 

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    return Promise.reject(err);
  }
);

export default axiosClient;
