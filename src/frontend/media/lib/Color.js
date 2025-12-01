// src/lib/Color.js (o donde lo tengas)
import ColorThief from "colorthief";

export const getDominantColor = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();

        // Validación necesaria: la imagen debe estar visible en el canvas
        if (!img.complete || img.naturalWidth === 0) {
          return reject("Image not loaded correctly");
        }

        // getColor o getPalette — tú estabas usando getPalette
        const palette = colorThief.getPalette(img, 5);

        if (!palette || !palette.length) {
          return reject("No dominant color found");
        }

        resolve(palette[0]); // RGB array [r, g, b]
      } catch (error) {
        reject("Failed to extract dominant color: " + error.message);
      }
    };

    img.onerror = () => reject("Image failed to load: " + imageUrl);
  });
};
