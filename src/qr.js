import QRCode from 'qrcode';

export const qrOptions = { margin: 4, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } };
export const qrColors = { graphite: '#111114', ocean: '#12394a', forest: '#164334' };
export async function qrArtwork(url, format = 'png', size = 1024, design = { shape: 'classic', color: 'graphite' }) {
  const color = qrColors[design.color] || qrColors.graphite;
  if (design.shape === 'classic') {
    const options = { ...qrOptions, color: { dark: color, light: '#ffffff' } };
    if (format === 'svg') return QRCode.toString(url, { ...options, type: 'svg' });
    return QRCode.toDataURL(url, { ...options, width: Number(size) });
  }
  const { modules } = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const dimension = modules.size + 8;
  const marks = [];
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (!modules.get(row, col)) continue;
      const x = col + 4, y = row + 4;
      if (modules.isReserved(row, col)) marks.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      else if (design.shape === 'dots') marks.push(`<circle cx="${x + .5}" cy="${y + .5}" r=".48"/>`);
      else marks.push(`<rect x="${x}" y="${y}" width="1" height="1" rx=".22"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimension} ${dimension}" width="${size}" height="${size}"><rect width="100%" height="100%" fill="#ffffff"/><g fill="${color}">${marks.join('')}</g></svg>`;
  if (format === 'svg') return svg;
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = Number(size); canvas.height = Number(size);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not create a PNG. Please download SVG.');
  context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}
