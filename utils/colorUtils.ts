export const getContrastColor = (hexColor: string): string => {
  if (!hexColor || !hexColor.startsWith('#')) {
    return '#111827'; // Default to dark text
  }

  const hex = hexColor.slice(1);
  if (hex.length !== 3 && hex.length !== 6) {
    return '#111827';
  }

  let r: number, g: number, b: number;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
    
  // WCAG luminance calculation
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    
  return luminance > 0.5 ? '#1f2937' : '#f9fafb'; // Return dark gray for light backgrounds, and light gray for dark backgrounds
};

export const shadeColor = (color: string, percent: number): string => {
  if (!color || !color.startsWith('#') || (color.length !== 4 && color.length !== 7)) {
    return color; // Return original if format is invalid
  }

  let R = color.length === 4 ? parseInt(color[1] + color[1], 16) : parseInt(color.substring(1, 3), 16);
  let G = color.length === 4 ? parseInt(color[2] + color[2], 16) : parseInt(color.substring(3, 5), 16);
  let B = color.length === 4 ? parseInt(color[3] + color[3], 16) : parseInt(color.substring(5, 7), 16);

  R = Math.round(R * (100 + percent) / 100);
  G = Math.round(G * (100 + percent) / 100);
  B = Math.round(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = Math.max(0, R);
  G = Math.max(0, G);
  B = Math.max(0, B);

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};
