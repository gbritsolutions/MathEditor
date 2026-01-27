// To store the session storage for getItems

export const JWT_TOKEN = () => sessionStorage.getItem("token");

export const ORG_ID = () => sessionStorage.getItem("orgId");

export const ORG_NAME = () => sessionStorage.getItem("organizationName") || "";

export const USER_ID = () => sessionStorage.getItem("beneficiaryId");

export const USER_NAME = () => sessionStorage.getItem("userName");

export const USER_ROLE = () => sessionStorage.getItem("role");

export const GOOGLE_LOGIN = () => sessionStorage.getItem("googleLogin");

export const ROLE_ACCESS = () =>
  JSON.parse(sessionStorage.getItem("UserRoleAccess")) || [];

export const USER_TOKEN = () =>
  sessionStorage.getItem("isAuthenticated") === "true";
