// Color utility functions for handling both preset colors and custom hex colors

export const PRESET_COLORS: { [key: string]: { bg: string; iconBg: string; accent: string; hex: string } } = {
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', accent: 'bg-amber-400', hex: '#fbbf24' },
  rose: { bg: 'bg-rose-50', iconBg: 'bg-rose-100', accent: 'bg-rose-400', hex: '#fb7185' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', accent: 'bg-emerald-400', hex: '#34d399' },
  sky: { bg: 'bg-sky-50', iconBg: 'bg-sky-100', accent: 'bg-sky-400', hex: '#38bdf8' },
  violet: { bg: 'bg-violet-50', iconBg: 'bg-violet-100', accent: 'bg-violet-400', hex: '#a78bfa' },
  orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-100', accent: 'bg-orange-400', hex: '#fb923c' },
};

export const isCustomColor = (color: string | undefined): boolean => {
  return !!color && color.startsWith('#');
};

export const getColorClasses = (color: string | undefined) => {
  if (!color || !isCustomColor(color)) {
    const preset = PRESET_COLORS[color || 'sky'] || PRESET_COLORS.sky;
    return {
      bg: preset.bg,
      iconBg: preset.iconBg,
      accent: preset.accent,
      isCustom: false,
      hex: preset.hex,
    };
  }
  
  return {
    bg: '',
    iconBg: '',
    accent: '',
    isCustom: true,
    hex: color,
  };
};

// Convert hex to rgba with opacity
export const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
