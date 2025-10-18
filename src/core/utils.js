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

