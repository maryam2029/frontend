const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const TOKEN_STORAGE_KEY = "authToken";
const LEGACY_TOKEN_KEYS = ["token", "jwtToken"];

function normalizePath(path) {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return import.meta.env.VITE_API_TOKEN || null;
  }

  const token =
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    LEGACY_TOKEN_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) ||
    import.meta.env.VITE_API_TOKEN ||
    null;

  return token;
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;

  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function pickErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (typeof payload.message === "string") return payload.message;
  if (Array.isArray(payload.message)) return payload.message.join(", ");
  if (typeof payload.error === "string") return payload.error;
  return fallback;
}

async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    withAuth = true,
    signal,
  } = options;

  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (withAuth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Token is missing. Please login first.");
    }
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    throw new Error(pickErrorMessage(payload, fallback));
  }

  return payload;
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
    withAuth: false,
  });
}

export async function fetchProducts() {
  const response = await request("/products");
  return response?.data ?? [];
}

export async function createProduct(productPayload) {
  return request("/products", {
    method: "POST",
    body: productPayload,
  });
}

export async function deleteProduct(productId) {
  return request(`/products/${productId}`, {
    method: "DELETE",
  });
}

export async function fetchSuppliers() {
  const response = await request("/suppliers");
  return Array.isArray(response) ? response : [];
}

export async function createSupplier(supplierPayload) {
  return request("/suppliers", {
    method: "POST",
    body: supplierPayload,
  });
}

export async function fetchInvoices() {
  const response = await request("/invoice");
  return response?.invoices ?? [];
}

