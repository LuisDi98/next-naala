import axios from "axios";

// Determinar la URL base dependiendo del entorno
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Cliente (navegador)
    return "";
  }
  // Servidor (Next.js API)
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
