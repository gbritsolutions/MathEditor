import { useNavigate } from "react-router-dom";

/**
 * Custom navigation utility function for handling common navigation scenarios.
 * Uses React Router's `useNavigate` hook internally.
 */
export const CustomNavigate = () => {
  const navigate = useNavigate();

  /**
   * Navigates to the Access Denied page.
   */
  const accessDenied = () => {
    navigate("/access_denied");
  };

  /**
   * Navigates to the Forgot Success page.
   */
  const forgotSuccess = () => {
    navigate("/forgot_success");
  };

  /**
   * Navigates to the 400 Bad Request error page.
   */
  const navigateError400 = () => {
    navigate("/error_400");
  };

  /**
   * Navigates to the 403 Forbidden error page.
   */
  const navigateError403 = () => {
    navigate("/error_403");
  };

  /**
   * Navigates to the 404 Not Found error page.
   */
  const navigateError404 = () => {
    navigate("/error_404");
  };

  /**
   * Navigates to the 500 Internal Server Error page.
   */
  const navigateError500 = () => {
    navigate("/error_500");
  };

  /**
   * Navigates to the 503 Service Unavailable error page.
   */
  const navigateError503 = () => {
    navigate("/error_503");
  };

  return {
    accessDenied,
    forgotSuccess,
    navigateError400,
    navigateError403,
    navigateError404,
    navigateError500,
    navigateError503,
  };
};
