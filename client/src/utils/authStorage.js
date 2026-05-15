const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const USER_AUTH_KEYS = ["userToken", "user", "userSessionExpiresAt"];
const ADMIN_AUTH_KEYS = ["adminToken", "adminUser", "adminSessionExpiresAt"];

const getSessionExpiry = (key) => Number(localStorage.getItem(key) || 0);

const sessionIsExpired = (key) => {
  const expiresAt = getSessionExpiry(key);
  return Boolean(expiresAt && Date.now() > expiresAt);
};

const setSessionExpiry = (key) => {
  localStorage.setItem(key, String(Date.now() + SESSION_DURATION_MS));
};

const clearKeys = (keys) => keys.forEach((key) => localStorage.removeItem(key));

export const clearUserAuth = () => {
  clearKeys(USER_AUTH_KEYS);

  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    localStorage.setItem("token", adminToken);
  } else {
    localStorage.removeItem("token");
  }
};

export const clearAdminAuth = () => {
  clearKeys(ADMIN_AUTH_KEYS);

  const userToken = localStorage.getItem("userToken");
  if (userToken) {
    localStorage.setItem("token", userToken);
  } else {
    localStorage.removeItem("token");
  }
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

export const getStoredAdminUser = () => {
  try {
    return JSON.parse(localStorage.getItem("adminUser") || "{}");
  } catch {
    return {};
  }
};

export const getUserAuthToken = () => {
  if (sessionIsExpired("userSessionExpiresAt")) {
    clearUserAuth();
    return "";
  }

  return localStorage.getItem("userToken") || "";
};

export const getAdminAuthToken = () => {
  if (sessionIsExpired("adminSessionExpiresAt")) {
    clearAdminAuth();
    return "";
  }

  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) return adminToken;

  const adminUser = getStoredAdminUser();
  if (adminUser?.role === "admin") {
    return localStorage.getItem("token") || "";
  }

  return "";
};

export const storeUserAuth = ({ token, user }) => {
  localStorage.setItem("userToken", token);
  localStorage.setItem("user", JSON.stringify(user || {}));
  setSessionExpiry("userSessionExpiresAt");

  // Keep this for older user pages that still read "token".
  localStorage.setItem("token", token);
};

export const storeAdminAuth = ({ token, user }) => {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminUser", JSON.stringify(user || {}));
  setSessionExpiry("adminSessionExpiresAt");

  // Keep this for older admin pages that still read "token".
  localStorage.setItem("token", token);
};
