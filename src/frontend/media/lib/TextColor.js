export const getTextColorForBackground = (rgb) => {
  if (!rgb || rgb.length < 3) return "white"; // fallback seguro

  // Cálculo de luminancia según WCAG 2.0
  const luminance = (r, g, b) => {
    const toLinear = (value) => {
      value /= 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    return (
      toLinear(r) * 0.2126 +
      toLinear(g) * 0.7152 +
      toLinear(b) * 0.0722
    );
  };

  const L = luminance(rgb[0], rgb[1], rgb[2]);

  // Threshold recomendado por WCAG
  // L > 0.55 → fondo claro → usar texto negro
  // L <= 0.55 → fondo oscuro → usar texto blanco
  return L > 0.55 ? "black" : "white";
};
