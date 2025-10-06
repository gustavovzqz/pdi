export function invertColors(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i];       // R
    pixels[i + 1] = 255 - pixels[i + 1]; // G
    pixels[i + 2] = 255 - pixels[i + 2]; // B
    // pixels[i + 3] alfa fica igual
  }

  ctx.putImageData(imageData, 0, 0);
}
