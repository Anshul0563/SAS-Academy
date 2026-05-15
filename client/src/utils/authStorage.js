export const getStoredAdminUser = () => {
  try {
    return JSON.parse(localStorage.getItem("adminUser") || "{}");
  } catch {
    return {};
  }
};

export const getAdminAuthToken = () => {
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) return adminToken;

  const adminUser = getStoredAdminUser();
  if (adminUser?.role === "admin") {
    return localStorage.getItem("token") || "";
  }

  return "";
};

export const storeAdminAuth = ({ token, user }) => {
  localStorage.setItem("adminToken", token);
  localStorage.setItem("adminUser", JSON.stringify(user || {}));

  // Keep this for older admin pages that still read "token".
  localStorage.setItem("token", token);

  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
};
