import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const normalizedApiUrl = apiUrl?.replace(/\/$/, "");
const baseURL = normalizedApiUrl
  ? normalizedApiUrl.endsWith("/api")
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : "/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
