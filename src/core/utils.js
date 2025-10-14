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
    data[i] = Math.round(normalizedPixels[i] * 255);
  }

  ctx.putImageData(imageData, 0, 0);
}


export function getYChannel(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const yChannel = new Float32Array(pixels.length);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];     // Red
    const g = pixels[i + 1]; // Green
    const b = pixels[i + 2]; // Blue

    const y = 0.299 * r + 0.587 * g + 0.114 * b;

    const yNormalized = y / 255;

    // Preenche os canais R, G, B com Y (escala de cinza)
    yChannel[i] = yNormalized;
    yChannel[i + 1] = yNormalized;
    yChannel[i + 2] = yNormalized;
    yChannel[i + 3] = pixels[i + 3] / 255;
  }

  return yChannel;
}

