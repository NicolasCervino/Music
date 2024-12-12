function ensureColorContrast(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Only darken very light colors, and brighten very dark colors
  let adjustmentFactor = 0;
  if (luminance > 0.8) {
    // If very light, darken slightly
    adjustmentFactor = 0.2;
    return darkenColor(color, adjustmentFactor);
  } else if (luminance < 0.2) {
    // If very dark, brighten slightly
    adjustmentFactor = 0.2;
    return lightenColor(color, adjustmentFactor);
  }

  // For colors with good luminance, keep them vibrant
  return color;
}

function lightenColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));

  return rgbToHex({ r, g, b });
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function darkenColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Ensure values stay within 0-255 range
  const r = Math.min(255, Math.max(0, Math.round(rgb.r * (1 - factor))));
  const g = Math.min(255, Math.max(0, Math.round(rgb.g * (1 - factor))));
  const b = Math.min(255, Math.max(0, Math.round(rgb.b * (1 - factor))));

  return rgbToHex({ r, g, b });
}


function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const validR = Math.min(255, Math.max(0, r));
  const validG = Math.min(255, Math.max(0, g));
  const validB = Math.min(255, Math.max(0, b));

  return `#${validR.toString(16).padStart(2, '0')}${validG.toString(16).padStart(2, '0')}${validB.toString(16).padStart(2, '0')}`;
}

export {
  ensureColorContrast,
};