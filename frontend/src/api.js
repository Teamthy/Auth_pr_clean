import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173/api", // adjust if backend runs elsewhere
});

export default api;
