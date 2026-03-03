import { useEffect, useMemo, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import { getGoogleClientId, setRuntimeGoogleClientId } from "./googleAuthConfig";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
const fallbackGoogleClientId = "missing-google-client-id.apps.googleusercontent.com";

export default function AppBootstrap() {
  const [runtimeClientId, setRuntimeClientIdState] = useState(getGoogleClientId());

  useEffect(() => {
    if (runtimeClientId) {
      return;
    }

    let isMounted = true;
    fetch(`${apiBaseUrl}/auth/google-client-id`, {
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }
        const payload = await response.json();
        return payload?.clientId || null;
      })
      .then((clientId) => {
        if (!isMounted || !clientId) {
          return;
        }
        setRuntimeGoogleClientId(clientId);
        setRuntimeClientIdState(clientId);
      })
      .catch(() => {
        // Keep fallback behavior when backend config endpoint is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, [runtimeClientId]);

  const effectiveGoogleClientId = useMemo(
    () => runtimeClientId || fallbackGoogleClientId,
    [runtimeClientId]
  );

  return (
    <GoogleOAuthProvider clientId={effectiveGoogleClientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
