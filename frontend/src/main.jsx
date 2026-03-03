import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import AuthProvider from "./context/AuthProvider";
import "./index.css";
import "./App.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const fallbackGoogleClientId = "missing-google-client-id.apps.googleusercontent.com";
const effectiveGoogleClientId = googleClientId || fallbackGoogleClientId;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={effectiveGoogleClientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
