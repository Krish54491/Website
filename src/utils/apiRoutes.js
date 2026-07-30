const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || "";

export const API_ROUTES = {
  PASSKEY_LOGIN: `${BASE_API_URL}/api/passkey-login`,
  COMMENTS: `${BASE_API_URL}/api/comment`,
  CHANGE_USERNAME: `${BASE_API_URL}/api/change-username`,
};
