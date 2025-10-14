import { getNormalizedPixels, getYChannel, updateCanvas } from './utils.js';

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


function textToBin(str) {

  const bits = [];


  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const bin = charCode.toString(2).padStart(8, '0');
    for (let bit of bin) {
      bits.push(parseInt(bit));
    }
  }

  return bits;
}

export function encodeSteganography(canvas, text) {

  const new_text = text.length + "$" + text;
  const bits = textToBin(new_text);

  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let k = 0;

  for (let i = 0; i < bits.length; i++) {

    if (k % 4 === 3) {
      k++;
    }
    pixels[k] = ((pixels[k] & 0b11111110) | bits[i]);
    k++;

  }

  ctx.putImageData(imageData, 0, 0);

}



export function decodeSteganography(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let text = [];
  let length_array = [];

  let j = 7;
  let num = 0;
  let c = '';
  let i = 0;

  while (i < pixels.length) {
    if (i % 4 === 3) {
      i++; // pular canal alpha
      continue;
    }

    num += Math.pow(2, j) * (pixels[i] & 1);
    j--;

    if (j < 0) {
      j = 7;
      c = String.fromCharCode(num);
      if (c === "$") break;
      length_array.push(c);
      num = 0;
    }

    i++;
  }

  const encoded_length = Number(length_array.join(""));
  const total_bits = encoded_length * 8;

  j = 7;
  num = 0;
  c = '';
  let bits_read = 0;
  i++;

  while (i < pixels.length && bits_read < total_bits) {
    if (i % 4 === 3) {
      i++;
      continue;
    }

    num += Math.pow(2, j) * (pixels[i] & 1);
    j--;
    bits_read++;

    if (j < 0) {
      j = 7;
      text.push(String.fromCharCode(num));
      num = 0;
    }

    i++;
  }

  return text.join('');
}

export function updateToGrayScale(canvas) {

  const yChannel = getYChannel(canvas);
  updateCanvas(canvas, yChannel);

}
