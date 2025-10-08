import { getNormalizedPixels, updateCanvas } from './utils.js';

const RGBA_SHIFT = 4;

// Invert

export function invertColors(canvas) {
  const normalized = getNormalizedPixels(canvas);

  for (let i = 0; i < normalized.length; i += RGBA_SHIFT) {
    for (let j = 0; j < 3; j++) { // R G B
      normalized[i + j] = 1 - normalized[i + j]; // alpha ignorado
    }
  }

  updateCanvas(canvas, normalized);
}
// Gamma
export function gammaCorrection(canvas, gammaFactor) {

  const normalized = getNormalizedPixels(canvas);

  for (let i = 0; i < normalized.length; i += RGBA_SHIFT) {
    for (let j = 0; j < 3; j++) { // R G B
      normalized[i + j] = Math.pow(normalized[i + j], gammaFactor);
    }
  }

  updateCanvas(canvas, normalized);
}
// Linear 
export function linearFunction(canvas, p1, p2) {
  const normalized = getNormalizedPixels(canvas);

  // First line (0,0) to p1
  const m1 = p1.y / p1.x;
  const f1 = (x) => m1 * x;

  // Second line p1 to p2
  const m2 = (p2.y - p1.y) / (p2.x - p1.x);
  const f2 = (x) => m2 * (x - p1.x) + p1.y;

  // Third line p2 to (1, 1)
  const m3 = (1 - p2.y) / (1 - p2.x);
  const f3 = (x) => m3 * (x - p2.x) + p2.y;

  for (let i = 0; i < normalized.length; i += RGBA_SHIFT) {
    for (let j = 0; j < 3; j++) { // R G B 
      const old_value = normalized[i + j];
      let new_value;

      if (old_value <= p1.x) {
        new_value = f1(old_value);
      } else if (old_value <= p2.x) {
        new_value = f2(old_value);
      } else {
        new_value = f3(old_value);
      }

      normalized[i + j] = new_value;
    }
  }

  updateCanvas(canvas, normalized);
}

