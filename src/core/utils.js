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



export function splitImage(canvas) {
  const { width, height } = canvas;

  const normalized = getNormalizedPixels(canvas);

  const R = [];
  const G = [];
  const B = [];

  for (let y = 0; y < height; y++) {
    const rowR = [];
    const rowG = [];
    const rowB = [];

    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      rowR.push(normalized[index]);     // Red
      rowG.push(normalized[index + 1]); // Green
      rowB.push(normalized[index + 2]); // Blue
    }

    R.push(rowR);
    G.push(rowG);
    B.push(rowB);
  }

  return { R, G, B };
}

export function unifyImage(R, G, B) {
  const height = R.length;
  const width = R[0].length;

  const output = new Float32Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      output[index] = R[y][x];        // R
      output[index + 1] = G[y][x];    // G
      output[index + 2] = B[y][x];    // B
      output[index + 3] = 1.0;        // A 
    }
  }

  return output;
}

export function applyGenericConvolution(convMatrix, imageMatrix) {
  const CONV_SIZE = convMatrix.length;
  const IMAGE_X_SIZE = imageMatrix.length;
  const IMAGE_Y_SIZE = imageMatrix[0].length;

  const half = Math.floor(CONV_SIZE / 2);

  const outputMatrix = Array.from({ length: IMAGE_X_SIZE }, () =>
    Array(IMAGE_Y_SIZE).fill(0)
  );

  for (let i = 0; i < IMAGE_X_SIZE; i++) {
    for (let j = 0; j < IMAGE_Y_SIZE; j++) {
      let result = 0;

      for (let i_conv = 0; i_conv < CONV_SIZE; i_conv++) {
        for (let j_conv = 0; j_conv < CONV_SIZE; j_conv++) {
          const x = i - half + i_conv;
          const y = j - half + j_conv;

          // Se estiver fora da imagem, considera 0
          if (x >= 0 && x < IMAGE_X_SIZE && y >= 0 && y < IMAGE_Y_SIZE) {
            result += imageMatrix[x][y] * convMatrix[i_conv][j_conv];
          } else {
            result += 0;
          }
        }
      }

      outputMatrix[i][j] = result;
    }
  }

  return outputMatrix;
}


export function applyGenericMedianFilter(size, imageMatrix) {
  const IMAGE_X_SIZE = imageMatrix.length;
  const IMAGE_Y_SIZE = imageMatrix[0].length;

  const half = Math.floor(size / 2);

  const outputMatrix = Array.from({ length: IMAGE_X_SIZE }, () =>
    Array(IMAGE_Y_SIZE).fill(0)
  );

  for (let i = 0; i < IMAGE_X_SIZE; i++) {
    for (let j = 0; j < IMAGE_Y_SIZE; j++) {
      let values = [];

      for (let i_conv = 0; i_conv < size; i_conv++) {
        for (let j_conv = 0; j_conv < size; j_conv++) {
          const x = i - half + i_conv;
          const y = j - half + j_conv;

          if (x >= 0 && x < IMAGE_X_SIZE && y >= 0 && y < IMAGE_Y_SIZE) {
            values.push(imageMatrix[x][y]);
          } else {
            // acho que nao faz sentido aqui considerar a borda preta.
            // so ignora
          }
        }
      }

      values.sort((a, b) => a - b);

      let median;
      const mid = Math.floor(values.length / 2);

      if (values.length % 2 === 0) {
        median = (values[mid - 1] + values[mid]) / 2;
      } else {
        median = values[mid];

      }

      outputMatrix[i][j] = median;
    }

  }
  return outputMatrix;
}



export function add(data, image, k) {
  const result = new Float32Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    result[i] = data[i] + k * image[i];         // R
    result[i + 1] = data[i + 1] + k * image[i + 1]; // G
    result[i + 2] = data[i + 2] + k * image[i + 2]; // B
    result[i + 3] = data[i + 3];
  }

  return result;
}


export function adjustImage(data) {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      if (data[i + c] < min) min = data[i + c];
      if (data[i + c] > max) max = data[i + c];
    }
  }

  const range = max - min || 1;

  const adjusted = new Float32Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      adjusted[i + c] = (data[i + c] - min) / range;
    }
    adjusted[i + 3] = data[i + 3];
  }

  return adjusted;
}

export function normalizeMatrix2D(matrix) {
  const M = matrix.length;
  const N = matrix[0].length;
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      if (matrix[i][j] < min) min = matrix[i][j];
      if (matrix[i][j] > max) max = matrix[i][j];
    }
  }

  const range = max - min || 1; // evita divisão por zero
  const normalized = Array.from({ length: M }, (_, i) =>
    Array.from({ length: N }, (_, j) => (matrix[i][j] - min) / range)
  );

  return normalized;
}

export function rgbToHsiImage(data) {
  const output = new Float32Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const sum = r + g + b;

    // Intensidade
    const I = sum / 3;

    // Saturação
    const minRGB = Math.min(r, g, b);
    const S = sum === 0 ? 0 : 1 - 3 * minRGB / sum;

    // Matiz
    let H = 0;
    if (S !== 0) {
      const numerator = 0.5 * ((r - g) + (r - b));
      const denominator = Math.sqrt((r - g) ** 2 + (r - b) * (g - b));
      let theta = Math.acos(Math.min(Math.max(numerator / (denominator || 1e-10), -1), 1));
      if (b > g) theta = 2 * Math.PI - theta;
      H = theta / (2 * Math.PI);
    }

    output[i] = H;
    output[i + 1] = S;
    output[i + 2] = I;
    output[i + 3] = data[i + 3]; // alfa permanece
  }

  return output;
}

export function hsiToRgbImage(data) {
  const output = new Float32Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const H = data[i];
    const S = data[i + 1];
    const I = data[i + 2];
    const h = H * 2 * Math.PI;

    let r, g, b;

    if (h < 2 * Math.PI / 3) {
      b = I * (1 - S);
      r = I * (1 + (S * Math.cos(h)) / Math.cos(Math.PI / 3 - h));
      g = 3 * I - (r + b);
    } else if (h < 4 * Math.PI / 3) {
      const h2 = h - 2 * Math.PI / 3;
      r = I * (1 - S);
      g = I * (1 + (S * Math.cos(h2)) / Math.cos(Math.PI / 3 - h2));
      b = 3 * I - (r + g);
    } else {
      const h3 = h - 4 * Math.PI / 3;
      g = I * (1 - S);
      b = I * (1 + (S * Math.cos(h3)) / Math.cos(Math.PI / 3 - h3));
      r = 3 * I - (g + b);
    }

    output[i] = r;
    output[i + 1] = g;
    output[i + 2] = b;
    output[i + 3] = data[i + 3]; // alfa permanece
  }

  return output;
}

export function rgbToHsvImage(data) {
  const output = new Float32Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Valor
    const V = max;

    // Saturação
    const S = max === 0 ? 0 : delta / max;

    // Matiz
    let H = 0;
    if (delta !== 0) {
      if (max === r) H = ((g - b) / delta) % 6;
      else if (max === g) H = (b - r) / delta + 2;
      else H = (r - g) / delta + 4;
      H /= 6;
      if (H < 0) H += 1;
    }

    output[i] = H;
    output[i + 1] = S;
    output[i + 2] = V;
    output[i + 3] = data[i + 3];
  }

  return output;
}

export function hsvToRgbImage(data) {
  const output = new Float32Array(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const H = data[i];
    const S = data[i + 1];
    const V = data[i + 2];

    const h = H * 6;
    const c = V * S;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = V - c;

    let r1 = 0, g1 = 0, b1 = 0;
    if (0 <= h && h < 1) [r1, g1, b1] = [c, x, 0];
    else if (1 <= h && h < 2) [r1, g1, b1] = [x, c, 0];
    else if (2 <= h && h < 3) [r1, g1, b1] = [0, c, x];
    else if (3 <= h && h < 4) [r1, g1, b1] = [0, x, c];
    else if (4 <= h && h < 5) [r1, g1, b1] = [x, 0, c];
    else if (5 <= h && h < 6) [r1, g1, b1] = [c, 0, x];

    output[i] = r1 + m;
    output[i + 1] = g1 + m;
    output[i + 2] = b1 + m;
    output[i + 3] = data[i + 3];
  }

  return output;
}
