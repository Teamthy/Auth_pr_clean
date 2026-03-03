import api from "./api";

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function verifyEmail(payload) {
  const { data } = await api.post("/auth/verify-email", payload);
  return data;
}

export async function resendVerification(payload) {
  const { data } = await api.post("/auth/resend-verification", payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function googleAuth(payload) {
  const { data } = await api.post("/auth/google", payload);
  return data;
}

export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function forgotPassword(payload) {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
}

export async function resetPassword(payload) {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/profile");
  return data;
}

export async function getAdminUsers() {
  const { data } = await api.get("/admin/users");
  return data.users;
}

export async function updateAdminUserRole(userId, role) {
  const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
  return data.user;
}

export async function updateAdminUserFlags(userId, payload) {
  const { data } = await api.patch(`/admin/users/${userId}/flags`, payload);
  return data.user;
}
