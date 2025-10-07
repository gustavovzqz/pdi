export function getNormalizedPixels(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const normalized = new Float32Array(pixels.length);

  for (let i = 0; i < pixels.length; i++) {
    normalized[i] = pixels[i] / 255;
  }

  return normalized;
}

export function updateCanvas(canvas, normalizedPixels) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < normalizedPixels.length; i++) {
    // converte de volta para 0-255 e arredonda
    data[i] = Math.round(normalizedPixels[i] * 255);
  }

  ctx.putImageData(imageData, 0, 0);
}



