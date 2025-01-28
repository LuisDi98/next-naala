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

    const { fileName } = response.data;
    console.log("fileName desde backend: ", fileName);

    if (!fileName) {
      throw new Error("No se recibió el nombre del archivo desde el servidor.");
    }

    // Crear enlace de descarga apuntando al nuevo endpoint de descarga
    const link = document.createElement("a");
    link.href = `/api/docx/download?fileName=${encodeURIComponent(fileName)}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Archivo descargado exitosamente:", fileName);
  } catch (error) {
    console.error("Error descargando el contrato:", error);
    alert("Hubo un problema al descargar el contrato. Por favor, inténtalo de nuevo.");
  }
};
