import { getNormalizedPixels, updateCanvas } from './utils.js';

const RGBA_SHIFT = 4;

// Invert
export function invertColors(canvas) {
  const normalized = getNormalizedPixels(canvas);

  for (let i = 0; i < normalized.length; i += RGBA_SHIFT) {
    normalized[i] = 1 - normalized[i];       // R
    normalized[i + 1] = 1 - normalized[i + 1]; // G
    normalized[i + 2] = 1 - normalized[i + 2]; // B
    // alfa mantido (normalized[i + 3]) // A
  }

  updateCanvas(canvas, normalized);
}

// Gamma
export function gammaCorrection(canvas, gammaFactor) {

  const normalized = getNormalizedPixels(canvas);

  for (let i = 0; i < normalized.length; i += RGBA_SHIFT) {
    normalized[i] = Math.pow(normalized[i], gammaFactor);       // R
    normalized[i + 1] = Math.pow(normalized[i + 1], gammaFactor); // G
    normalized[i + 2] = Math.pow(normalized[i + 2], gammaFactor); // B
    // alfa mantido (normalized[i + 3]) // A
  }

  updateCanvas(canvas, normalized);
}

