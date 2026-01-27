import ReCAPTCHA from "react-google-recaptcha";
import axiosClient from "../../apis/Api";

export default function Captcha({ onCaptchaChange }) {
  const siteKey = axiosClient.defaults.apiUrl_Recaptcha;
  function onChange(value) {
    const isChecked = value !== null;
    onCaptchaChange && onCaptchaChange(isChecked);
  }
  return (
    <>
      <ReCAPTCHA
        sitekey={siteKey}
        className="mt-4 mb-5"
        // theme="dark"
        // size="invisible"
        onChange={onChange}
      />
    </>
  );
}
