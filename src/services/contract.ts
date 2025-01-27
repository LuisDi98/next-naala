import api from "./api";

export const downloadDocx = async (
  selectedOptions: { [key: string]: [{ name: string; price: number }] },
  clientEmail: string,
  fecha: string,
  finca: string,
  modelo: string,
  propietario: string,
  proyecto: string
) => {
  try {
    console.log("Datos enviados al servidor:", {
      selectedOptions,
      clientEmail,
      fecha,
      modelo,
      propietario,
      finca,
      proyecto,
    });

    console.log("---------------\n");

    // Enviar la solicitud al backend
    const response = await api.post("/api/docx/generate", {
      selectedOptions,
      clientEmail,
      fecha,
      finca,
      modelo,
      propietario,
      proyecto,
    });

    // Obtener la URL del archivo de la respuesta del backend
    const { filePath } = response.data;

    if (!filePath) {
      throw new Error("No se recibió la ruta del archivo desde el servidor.");
    }

    // Crear un enlace temporal para la descarga del archivo
    const link = document.createElement("a");
    link.href = filePath;  // URL proporcionada por el backend
    link.download = `${propietario}-Contrato.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Archivo descargado exitosamente:", filePath);

  } catch (error) {
    console.error("Error descargando el contrato:", error);
    alert("Hubo un problema al descargar el contrato. Por favor, inténtalo de nuevo.");
  }
};
