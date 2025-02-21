import api from "./api";

// Función para generar un PIN
export const generatePin = async (data: any) => {
  const response = await fetch('/api/pin/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al crear el PIN');
  }

  return response.json();
};

// Función para verificar un PIN
export const verifyPin = async (data: any) => {
  try {
    console.log("=> data before calling /api/pin/verify", data);
    const response = await api.post("/api/pin/verify", data);
    return response.data;
  } catch (error) {
    console.error("Error verifying PIN:", error);
    throw error;
  }
};
