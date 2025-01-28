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
    const response = await api.post("/api/docx/generate", {
      selectedOptions,
      clientEmail,
      fecha,
      finca,
      modelo,
      propietario,
      proyecto,
    });

    const { filePath } = response.data;
    if (!filePath) {
      throw new Error("No se recibió la ruta del archivo desde el servidor.");
    }
    const link = document.createElement("a");
    console.log("filePath desde backend: ", filePath);
    
    link.href = filePath;
    console.log();
    
    link.download = filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Archivo descargado exitosamente:", filePath);

  } catch (error) {
    console.error("Error descargando el contrato:", error);
    alert("Hubo un problema al descargar el contrato. Por favor, inténtalo de nuevo.");
  }
};
