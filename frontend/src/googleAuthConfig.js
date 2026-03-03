export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || globalThis.__APP_GOOGLE_CLIENT_ID__ || "";
}

export function setRuntimeGoogleClientId(clientId) {
  globalThis.__APP_GOOGLE_CLIENT_ID__ = clientId || "";
}
