const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || "";

export const API_ROUTES = {
  PASSKEY_LOGIN: `${BASE_API_URL}/api/passkey-login`,
  PASSKEY_REGISTER: `${BASE_API_URL}/api/passkey-register`,
  PASSKEY_CHANGE: `${BASE_API_URL}/api/passkey-change`,
  PASSKEY_ADD_PASSWORD: `${BASE_API_URL}/api/passkey-add-password`,
  PASSWORD_LOGIN: `${BASE_API_URL}/api/password-login`,
  PASSWORD_REGISTER: `${BASE_API_URL}/api/password-register`,
  PASSWORD_CHANGE: `${BASE_API_URL}/api/password-change`,
  PASSWORD_ADD_PASSKEY: `${BASE_API_URL}/api/password-add-passkey`,
  COMMENTS: `${BASE_API_URL}/api/comment`,
  CHANGE_USERNAME: `${BASE_API_URL}/api/change-username`,
  ME: `${BASE_API_URL}/api/me`,
  LOGOUT: `${BASE_API_URL}/api/logout`,
  DELETE_ACCOUNT: `${BASE_API_URL}/api/delete-account`,
};
