import api from "./api";

export const downloadDocx = async (
  selectedOptions: { [key: string]: [{ name: string; price: number }] },
  clientEmail: string,
  fecha: string,
  finca: string,
  modelo: string,
  propietario: string,
  proyecto: string,
  listaAnexosRadio: string[],
  listaAnexosCheckbox: { base: string, overlays: string[] }[],

) => {
  try {
    console.log("Desde contract.ts antes del backend:");
    
    console.log("📌 Anexos de Radios:", listaAnexosRadio);
    console.log("📌 Anexos de Checkboxes (Combinados):", listaAnexosCheckbox);
    
    const response = await api.post("/api/docx/generate", {
      selectedOptions,
      clientEmail,
      fecha,
      finca,
      modelo,
      propietario,
      proyecto,
      listaAnexosRadio,
      listaAnexosCheckbox
    }, { responseType: 'blob' }); // 🔹 Importante para recibir el PDF
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Contrato-${propietario}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("✅ Archivo descargado correctamente.");
    
  } catch (error) {
    console.error("Error descargando el contrato:", error);
    alert("Hubo un problema al descargar el contrato. Por favor, inténtalo de nuevo.");
  }
};
