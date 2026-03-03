import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Profile from "./Profile";
import AdminDashboard from "./AdminDashboard";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";

function App() {
  const bypassEnabled = String(import.meta.env.VITE_AUTH_BYPASS || "").toLowerCase() === "true";

  const withPrivate = (element) =>
    bypassEnabled ? element : <PrivateRoute>{element}</PrivateRoute>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={withPrivate(<Home />)} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              withPrivate(
                <RoleRoute roles={["user", "admin"]}>
                  <Profile />
                </RoleRoute>
              )
            }
          />
          <Route
            path="/admin"
            element={
              withPrivate(
                <RoleRoute roles={["admin"]}>
                  <AdminDashboard />
                </RoleRoute>
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
