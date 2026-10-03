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
      if (design.shape === 'cat' || modules.isReserved(row, col)) marks.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      else if (design.shape === 'dots') marks.push(`<circle cx="${x + .5}" cy="${y + .5}" r=".48"/>`);
      else marks.push(`<rect x="${x}" y="${y}" width="1" height="1" rx=".22"/>`);
    }
  }
  const svg = design.shape === 'cat'
    ? catArtwork(marks.join(''), dimension, color, size)
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimension} ${dimension}" width="${size}" height="${size}"><rect width="100%" height="100%" fill="#ffffff"/><g fill="${color}">${marks.join('')}</g></svg>`;
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

function catArtwork(marks, dimension, color, size) {
  // All decoration stays outside the QR's full four-module white quiet zone.
  const edge = dimension + 24;
  const center = edge / 2;
  const qrX = 12, qrY = 12;
  const faceY = qrY + dimension + 5;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${edge} ${edge}" width="${size}" height="${size}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <g stroke="#ad8c70" stroke-width=".65" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 16 8 2 Q8 1 9 2 L23 12 M${edge - 7} 16 ${edge - 8} 2 Q${edge - 8} 1 ${edge - 9} 2 L${edge - 23} 12" fill="#fff0da"/>
      <rect x="5" y="8" width="${edge - 10}" height="${edge - 12}" rx="9" fill="#fff0da"/>
      <path d="M10 9 10 4 17 9 M${edge - 10} 9 ${edge - 10} 4 ${edge - 17} 9" stroke="none" fill="#eab2ab"/>
      <path d="M${center - 4} 8v2 M${center} 8v2.8 M${center + 4} 8v2" stroke="#d4ac7d"/>
    </g>
    <rect x="${qrX}" y="${qrY}" width="${dimension}" height="${dimension}" rx="0" fill="#ffffff"/>
    <g fill="${color}" transform="translate(${qrX} ${qrY})">${marks}</g>
    <g fill="#533e33">
      <circle cx="${center - 5}" cy="${faceY - 1}" r=".85"/><circle cx="${center + 5}" cy="${faceY - 1}" r=".85"/>
      <path d="M${center - 1.4} ${faceY - .1} Q${center} ${faceY - .8} ${center + 1.4} ${faceY - .1} L${center} ${faceY + 1.3}Z" fill="#d68e8b"/>
    </g>
    <g fill="none" stroke="#80604c" stroke-width=".5" stroke-linecap="round">
      <path d="M${center} ${faceY + 1.2}q-1.4 2-2.5 .8 M${center} ${faceY + 1.2}q1.4 2 2.5 .8"/>
      <path d="M${center - 9} ${faceY}l-5-1 M${center - 9} ${faceY + 2}l-5 1 M${center + 9} ${faceY}l5-1 M${center + 9} ${faceY + 2}l5 1"/>
    </g>
    <g fill="#edb9ab" opacity=".65"><ellipse cx="${center - 8}" cy="${faceY + .7}" rx="1.8" ry=".9"/><ellipse cx="${center + 8}" cy="${faceY + .7}" rx="1.8" ry=".9"/></g>
    <g stroke="#ad8c70" stroke-width=".55" fill="#fff5e6">
      <rect x="7" y="${edge - 8}" width="8" height="6" rx="3"/><rect x="${edge - 15}" y="${edge - 8}" width="8" height="6" rx="3"/>
      <path d="M10 ${edge - 4}v1.5 M12 ${edge - 4}v1.5 M${edge - 12} ${edge - 4}v1.5 M${edge - 10} ${edge - 4}v1.5"/>
    </g>
  </svg>`;
}
