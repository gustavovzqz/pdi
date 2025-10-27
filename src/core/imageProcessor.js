import * as utils from './utils.js';
import * as conv_matrices from './conv_matrices.js';

const RGBA_SHIFT = 4;

// Invert

export function invertColors(canvas) {
  const normalized = utils.getNormalizedPixels(canvas);

  for (let i = 0; i < normalized.length; i += RGBA_SHIFT) {
    for (let j = 0; j < 3; j++) { // R G B
      normalized[i + j] = 1 - normalized[i + j]; // alpha ignorado
    }
  }

  utils.updateCanvas(canvas, normalized);
}
// Gamma
export function gammaCorrection(canvas, gammaFactor) {

  const normalized = utils.getNormalizedPixels(canvas);

  for (let i = 0; i < normalized.length; i += RGBA_SHIFT) {
    for (let j = 0; j < 3; j++) { // R G B
      normalized[i + j] = Math.pow(normalized[i + j], gammaFactor);
    }
  }

  utils.updateCanvas(canvas, normalized);
}
// Linear 
export function linearFunction(canvas, p1, p2) {
  const normalized = utils.getNormalizedPixels(canvas);

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

  utils.updateCanvas(canvas, normalized);
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

  const yChannel = utils.getYChannel(canvas);
  utils.updateCanvas(canvas, yChannel);

}


export function equalizeHistogram(canvas) {
  const yChannel = utils.getYChannel(canvas); // valores normalizados entre 0 e 1
  const hist = new Array(256).fill(0);

  // 1. Construir o histograma (valores entre 0 e 255)
  for (let i = 0; i < yChannel.length; i++) {
    const val = Math.floor(yChannel[i] * 255);
    hist[val]++;
  }

  // 2. Normalizar o histograma
  const total = yChannel.length;
  const prob = hist.map(count => count / total);

  // 3. Calcular a CDF
  const cdf = [];
  let sum = 0;
  for (let i = 0; i < prob.length; i++) {
    sum += prob[i];
    cdf[i] = sum;
  }

  // 4. Mapear os valores antigos para novos
  const equalized = new Float32Array(yChannel.length);
  for (let i = 0; i < yChannel.length; i++) {
    const val = Math.floor(yChannel[i] * 255);
    const newVal = cdf[val] * 255;
    equalized[i] = newVal / 255;
  }

  // 5. Atualizar a imagem
  utils.updateCanvas(canvas, equalized);
}

export function binarizeImage(canvas) {
  const yChannel = utils.getYChannel(canvas);
  const binary = yChannel.map(value => value < 0.5 ? 0 : 1);
  utils.updateCanvas(canvas, binary);
}

export function applyConvolution(convMatrix, canvas, adjust = false) {

  const { R, G, B } = utils.splitImage(canvas);

  const R_conv = utils.applyGenericConvolution(convMatrix, R);
  const G_conv = utils.applyGenericConvolution(convMatrix, G);
  const B_conv = utils.applyGenericConvolution(convMatrix, B);

  let unifiedImage = utils.unifyImage(R_conv, G_conv, B_conv);

  if (adjust) {

    unifiedImage = utils.adjustImage(unifiedImage);

  }

  utils.updateCanvas(canvas, unifiedImage)
}



export function applyMeanFilter(size, canvas) {
  const value = 1 / (size * size);
  const conv_mean = Array.from({ length: size }, () => Array(size).fill(value));
  applyConvolution(conv_mean, canvas);
}

function createWeightedMeanKernel(n) {
  const kernel = [];
  const center = Math.floor(n / 2);
  let sum = 0;

  for (let i = 0; i < n; i++) {
    kernel[i] = [];
    for (let j = 0; j < n; j++) {
      // distancia euclidiana
      const dist = Math.sqrt((i - center) ** 2 + (j - center) ** 2);
      const weight = 1 / (dist + 1); // +1 
      kernel[i][j] = weight;
      sum += weight;
    }
  }

  // normalize
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      kernel[i][j] /= sum;
    }
  }

  return kernel;
}

export function applyWeightedMeanFilter(size, canvas) {

  const kernel = createWeightedMeanKernel(size);

  applyConvolution(kernel, canvas);
}

export function applyMedianFilter(size, canvas) {

  const { R, G, B } = utils.splitImage(canvas);

  const R_filtered = utils.applyGenericMedianFilter(size, R);
  const G_filtered = utils.applyGenericMedianFilter(size, G);
  const B_filtered = utils.applyGenericMedianFilter(size, B);

  const unifiedImage = utils.unifyImage(R_filtered, G_filtered, B_filtered);

  utils.updateCanvas(canvas, unifiedImage)

}


export function laplacianSharp(canvas, k) {

  const laplace_matrix = conv_matrices.laplacian;

  const { R, G, B } = utils.splitImage(canvas);

  const R_conv = utils.applyGenericConvolution(laplace_matrix, R);
  const G_conv = utils.applyGenericConvolution(laplace_matrix, G);
  const B_conv = utils.applyGenericConvolution(laplace_matrix, B);


  const laplacian_image = utils.unifyImage(R_conv, G_conv, B_conv);

  const image_normalized = utils.getNormalizedPixels(canvas);
  const sharpened_image = utils.add(image_normalized, laplacian_image, -1 * k);
  utils.updateCanvas(canvas, sharpened_image);
}


export function highboost(canvas, k) {

  const gaussian_matrix = conv_matrices.gaussianBlur;

  const { R, G, B } = utils.splitImage(canvas);

  const R_conv = utils.applyGenericConvolution(gaussian_matrix, R);
  const G_conv = utils.applyGenericConvolution(gaussian_matrix, G);
  const B_conv = utils.applyGenericConvolution(gaussian_matrix, B);

  const blurred_image = utils.unifyImage(R_conv, G_conv, B_conv);

  const image_normalized = utils.getNormalizedPixels(canvas);

  const mask = utils.add(image_normalized, blurred_image, -1);

  const sharpened_image = utils.add(image_normalized, mask, k);
  utils.updateCanvas(canvas, sharpened_image);

}


export function magnitudeEdgeDetection(canvas) {
  const { R, G, B } = utils.splitImage(canvas);

  // Aplica convolução com Sobel X e Y em cada canal
  const Rx = utils.applyGenericConvolution(conv_matrices.sobelX, R);
  const Ry = utils.applyGenericConvolution(conv_matrices.sobelY, R);

  const Gx = utils.applyGenericConvolution(conv_matrices.sobelX, G);
  const Gy = utils.applyGenericConvolution(conv_matrices.sobelY, G);

  const Bx = utils.applyGenericConvolution(conv_matrices.sobelX, B);
  const By = utils.applyGenericConvolution(conv_matrices.sobelY, B);

  const height = R.length;
  const width = R[0].length;

  const magnitudeR = [];
  const magnitudeG = [];
  const magnitudeB = [];

  for (let y = 0; y < height; y++) {
    magnitudeR[y] = [];
    magnitudeG[y] = [];
    magnitudeB[y] = [];
    for (let x = 0; x < width; x++) {
      magnitudeR[y][x] = Math.sqrt(Rx[y][x] ** 2 + Ry[y][x] ** 2);
      magnitudeG[y][x] = Math.sqrt(Gx[y][x] ** 2 + Gy[y][x] ** 2);
      magnitudeB[y][x] = Math.sqrt(Bx[y][x] ** 2 + By[y][x] ** 2);
    }
  }

  const magnitudeImage = utils.unifyImage(magnitudeR, magnitudeG, magnitudeB);

  utils.updateCanvas(canvas, magnitudeImage);
}


// CÓDIGOS ADAPTADOS (baseados no do yuri)
export function scaleImage(canvas, sx, sy) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const src = imgData.data;

  const largura = canvas.width;
  const altura = canvas.height;

  const novaLargura = Math.round(largura * sx);
  const novaAltura = Math.round(altura * sy);

  const newCanvas = document.createElement('canvas');
  newCanvas.width = novaLargura;
  newCanvas.height = novaAltura;
  const newCtx = newCanvas.getContext('2d');
  const newImgData = newCtx.createImageData(novaLargura, novaAltura);
  const dst = newImgData.data;

  function getPixel(x, y) {
    if (x < 0 || y < 0 || x >= largura || y >= altura) return [0, 0, 0, 0];
    const idx = (y * largura + x) * 4;
    return [
      src[idx],
      src[idx + 1],
      src[idx + 2],
      src[idx + 3]
    ];
  }

  for (let y = 0; y < novaAltura; y++) {
    for (let x = 0; x < novaLargura; x++) {

      const divx = x / sx;
      const divy = y / sy;

      const intx = Math.floor(divx);
      const inty = Math.floor(divy);

      const px = divx - intx;
      const py = divy - inty;

      const p1 = getPixel(intx, inty);
      const p2 = getPixel(intx, inty + 1);
      const p3 = getPixel(intx + 1, inty);
      const p4 = getPixel(intx + 1, inty + 1);

      const rgba = [0, 0, 0, 0];
      for (let c = 0; c < 4; c++) {
        const i1 = (1 - py) * p1[c] + py * p2[c];
        const i2 = (1 - py) * p3[c] + py * p4[c];
        rgba[c] = (1 - px) * i1 + px * i2;
      }

      const dstIdx = (y * novaLargura + x) * 4;
      dst[dstIdx] = rgba[0];
      dst[dstIdx + 1] = rgba[1];
      dst[dstIdx + 2] = rgba[2];
      dst[dstIdx + 3] = rgba[3];
    }
  }

  canvas.width = novaLargura;
  canvas.height = novaAltura;
  ctx.putImageData(newImgData, 0, 0);
}



export function rotImage(canvas, anguloGraus) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const src = imgData.data;

  const largura = canvas.width;
  const altura = canvas.height;

  const a = (Math.PI * anguloGraus) / 180;
  const sina = Math.sin(-a);
  const cosa = Math.cos(-a);

  const p1x = largura * Math.cos(a);
  const p1y = largura * Math.sin(a);

  const p2x = largura * Math.cos(a) - altura * Math.sin(a);
  const p2y = largura * Math.sin(a) + altura * Math.cos(a);

  const p3x = -altura * Math.sin(a);
  const p3y = altura * Math.cos(a);

  const vx = [0, p1x, p2x, p3x];
  const vy = [0, p1y, p2y, p3y];

  const largf = Math.round(Math.max(...vx) - Math.min(...vx));
  const altf = Math.round(Math.max(...vy) - Math.min(...vy));

  const dx = Math.min(...vx);
  const dy = Math.min(...vy);

  const newCanvas = document.createElement('canvas');
  newCanvas.width = largf;
  newCanvas.height = altf;
  const newCtx = newCanvas.getContext('2d');
  const newImgData = newCtx.createImageData(largf, altf);
  const dst = newImgData.data;

  function getPixel(x, y) {
    if (x < 0 || y < 0 || x >= largura || y >= altura) return [0, 0, 0, 0];
    const idx = (Math.floor(y) * largura + Math.floor(x)) * 4;
    return [src[idx], src[idx + 1], src[idx + 2], src[idx + 3]];
  }

  for (let y = 0; y < altf; y++) {
    for (let x = 0; x < largf; x++) {
      const xo = (x + dx) * cosa - (y + dy) * sina;
      const yo = (x + dx) * sina + (y + dy) * cosa;

      const color = getPixel(xo, yo);
      const idx = (y * largf + x) * 4;

      dst[idx] = color[0];
      dst[idx + 1] = color[1];
      dst[idx + 2] = color[2];
      dst[idx + 3] = color[3];
    }
  }

  canvas.width = largf;
  canvas.height = altf;
  ctx.putImageData(newImgData, 0, 0);
}
