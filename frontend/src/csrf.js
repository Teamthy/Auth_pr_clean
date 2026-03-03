import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

let csrfTokenCache = null;

/**
 * Fetch CSRF token from backend
 */
export async function getCSRFToken() {
  try {
    // Use cached token if available
    if (csrfTokenCache) {
      return csrfTokenCache;
    }

    const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
      withCredentials: true,
    });
    csrfTokenCache = response.data.csrfToken;
    return csrfTokenCache;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    throw new Error("Unable to obtain CSRF token");
  }
}

/**
 * Clear cached token (called after successful submission)
 */
export function clearCSRFToken() {
  csrfTokenCache = null;
}
