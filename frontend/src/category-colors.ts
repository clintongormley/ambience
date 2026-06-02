export type CategoryColor = { id: string; label: string; hex: string };

// Curated HA-ish palette (Material 500-ish). `id` is what's stored on the category.
export const CATEGORY_COLORS: CategoryColor[] = [
  { id: "red", label: "Red", hex: "#f44336" },
  { id: "pink", label: "Pink", hex: "#e91e63" },
  { id: "purple", label: "Purple", hex: "#9c27b0" },
  { id: "deep-purple", label: "Deep purple", hex: "#673ab7" },
  { id: "indigo", label: "Indigo", hex: "#3f51b5" },
  { id: "blue", label: "Blue", hex: "#2196f3" },
  { id: "light-blue", label: "Light blue", hex: "#03a9f4" },
  { id: "cyan", label: "Cyan", hex: "#00bcd4" },
  { id: "teal", label: "Teal", hex: "#009688" },
  { id: "green", label: "Green", hex: "#4caf50" },
  { id: "light-green", label: "Light green", hex: "#8bc34a" },
  { id: "lime", label: "Lime", hex: "#cddc39" },
  { id: "yellow", label: "Yellow", hex: "#ffeb3b" },
  { id: "amber", label: "Amber", hex: "#ffc107" },
  { id: "orange", label: "Orange", hex: "#ff9800" },
  { id: "deep-orange", label: "Deep orange", hex: "#ff5722" },
  { id: "brown", label: "Brown", hex: "#795548" },
  { id: "grey", label: "Grey", hex: "#9e9e9e" },
  { id: "blue-grey", label: "Blue grey", hex: "#607d8b" },
];

// hex for a stored color id (undefined if unset/unknown).
export function colorHex(color: string | undefined): string | undefined {
  if (!color) return undefined;
  return CATEGORY_COLORS.find((c) => c.id === color)?.hex;
}

// Pick black or white text for legibility on a hex background (W3C relative luminance).
export function textColorFor(hex: string): "#000000" | "#ffffff" {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.5 ? "#000000" : "#ffffff";
}

// Inline style for a coloured category swatch: the category's colour as background
// with an auto-contrast foreground, or "" when the category has no colour (callers
// fall back to a neutral CSS class). Keeps the bg/fg contrast pairing in one place.
export function categorySwatchStyle(color: string | undefined): string {
  const hex = colorHex(color);
  return hex ? `background:${hex};color:${textColorFor(hex)}` : "";
}
