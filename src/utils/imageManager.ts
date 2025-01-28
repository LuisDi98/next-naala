const mergeImages = async (baseImage: string, overlayImages: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      if (!ctx) return reject("No se pudo obtener el contexto de Canvas");
  
      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous"; // Para evitar problemas de CORS
      baseImg.src = baseImage;
  
      baseImg.onload = () => {
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  
        let imagesLoaded = 0;
        overlayImages.forEach((src) => {
          const overlayImg = new Image();
          overlayImg.crossOrigin = "anonymous";
          overlayImg.src = src;
  
          overlayImg.onload = () => {
            ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
            imagesLoaded++;
            if (imagesLoaded === overlayImages.length) {
              resolve(canvas.toDataURL("image/png")); // Retorna la imagen final como base64
            }
          };
  
          overlayImg.onerror = (err) => reject(`Error cargando imagen: ${src}`);
        });
  
        if (overlayImages.length === 0) {
          resolve(canvas.toDataURL("image/png"));
        }
      };
  
      baseImg.onerror = (err) => reject("Error cargando la imagen base");
    });
  };
  