const DEFAULT_MAX_BYTES = 9 * 1024 * 1024;
const DEFAULT_MAX_DIMENSION = 2000;

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unsupported image file'));
    };
    image.src = url;
  });

const getScaledSize = (width, height, maxDimension) => {
  const ratio = Math.min(1, maxDimension / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
};

export const compressImageForUpload = async (
  file,
  { maxBytes = DEFAULT_MAX_BYTES, maxDimension = DEFAULT_MAX_DIMENSION } = {}
) => {
  if (!file || !file.type?.startsWith('image/')) return file;
  if (file.size <= maxBytes) return file;

  const image = await loadImage(file);
  let { width, height } = getScaledSize(image.naturalWidth, image.naturalHeight, maxDimension);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const outputType = 'image/jpeg';

  for (let scale = 1; scale >= 0.45; scale -= 0.15) {
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (let quality = 0.88; quality >= 0.5; quality -= 0.08) {
      const blob = await canvasToBlob(canvas, outputType, quality);
      if (blob && blob.size <= maxBytes) {
        const safeName = file.name.replace(/\.[^.]+$/, '') || 'image';
        return new File([blob], `${safeName}.jpg`, {
          type: outputType,
          lastModified: Date.now(),
        });
      }
    }
  }

  width = Math.round(width * 0.45);
  height = Math.round(height * 0.45);
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, outputType, 0.45);
  if (!blob || blob.size > maxBytes) {
    throw new Error('Image is too large to upload. Please choose a smaller image.');
  }

  const safeName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${safeName}.jpg`, {
    type: outputType,
    lastModified: Date.now(),
  });
};
