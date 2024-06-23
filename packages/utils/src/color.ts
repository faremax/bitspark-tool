export const hex2rgb = (color: string) => {
  const hex = Number(color.replace('#', '0x'));
  const r = hex >> 16, g = (hex >> 8) & 0xff, b = hex & 0xff;
  return `${r},${g},${b}`;
};

const isHex = (color: string) => /^#([a-f0-9]{6}|[a-f0-9]{3}$/i.test(color);
const isRgb = (color: string) => /^rgba?\(\d{1,3},\d{1,3},\d{1,3}\)$/i.test(color);

export const toRgbValue = (color: string) => {
  if(isHex(color)) return hex2rgb(color);
  if(isRgb(color)) return color.replace(/rgba?\(|\)/g, '');
}