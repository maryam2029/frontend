import axios from "axios";
import { clearStoredToken, getStoredToken } from "@/lib/auth";

export const API_UNAUTHORIZED_EVENT = "api:unauthorized";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function extractApiErrorMessage(error) {
  const payload = error?.response?.data;

  if (Array.isArray(payload?.message)) {
    return payload.message.join(", ");
  }

  if (typeof payload?.message === "string") {
    return payload.message;
  }

  if (typeof payload?.error === "string") {
    return payload.error;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return "Unexpected error occurred.";
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearStoredToken();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(API_UNAUTHORIZED_EVENT));
      }
    }

    return Promise.reject(new Error(extractApiErrorMessage(error)));
  },
);

export default api;
