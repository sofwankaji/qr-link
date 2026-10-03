import QRCode from 'qrcode';

export const qrOptions = { margin: 4, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } };
export async function qrArtwork(url, format = 'png', size = 1024) {
  if (format === 'svg') return QRCode.toString(url, { ...qrOptions, type: 'svg' });
  return QRCode.toDataURL(url, { ...qrOptions, width: Number(size) });
}
