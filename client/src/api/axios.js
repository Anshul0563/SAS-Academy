import axios from "axios";

const apiUrl =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://sas-academy-1ruh.onrender.com"
    : "");
const normalizedApiUrl = apiUrl?.replace(/\/$/, "");
const baseURL = normalizedApiUrl
  ? normalizedApiUrl.endsWith("/api")
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : "/api";

const API = axios.create({
  baseURL,
  // Authentication uses bearer tokens in the Authorization header, not cookies.
  // Do not opt into cross-site cookies unless the backend authentication changes.
  withCredentials: false,
});

export default API;
