import api from "./api";

// Función para generar un PIN
export const generatePin = async (data: any) => {
  try {
    const response = await api.post("/api/pin/generate", data);
    return response.data;
  } catch (error) {
    console.error("Error generating PIN:", error);
    throw error;
  }
};

// Función para verificar un PIN
export const verifyPin = async (data: any) => {
  try {
    const response = await api.post("/api/pin/verify", data);
    return response.data;
  } catch (error) {
    console.error("Error verifying PIN:", error);
    throw error;
  }
};
