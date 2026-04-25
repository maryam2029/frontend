const TOKEN_STORAGE_KEY = "authToken";
const LEGACY_TOKEN_KEYS = ["token", "jwtToken"];

function parseTokenPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const payload = JSON.parse(atob(payloadPart));
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}

function isExpiredToken(token) {
  const payload = parseTokenPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  return Date.now() >= payload.exp * 1000;
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return import.meta.env.VITE_API_TOKEN || null;
  }

  const token = (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    LEGACY_TOKEN_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) ||
    import.meta.env.VITE_API_TOKEN ||
    null
  );

  if (token && isExpiredToken(token)) {
    clearStoredToken();
    return null;
  }

  return token;
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;

  if (!token) {
    clearStoredToken();
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
}

export { TOKEN_STORAGE_KEY };
