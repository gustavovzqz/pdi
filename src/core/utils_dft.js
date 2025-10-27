import * as utils from './utils.js';

// IMPLEMENTADO POR MIM 

export function dft2D(matrix) {
  const M = matrix.length;
  const N = matrix[0].length;
  const out = Array.from({ length: M }, () => Array(N).fill({ re: 0, im: 0 }));

  for (let u = 0; u < M; u++) {
    for (let v = 0; v < N; v++) {
      let sumRe = 0;
      let sumIm = 0;

      for (let x = 0; x < M; x++) {
        for (let y = 0; y < N; y++) {
          const angle = (-2 * Math.PI * ((u * x) / M + (v * y) / N));
          const val = matrix[x][y];
          sumRe += val * Math.cos(angle);
          sumIm += val * Math.sin(angle);
        }
      }

      out[u][v] = { re: sumRe, im: sumIm };
    }
  }

  return out;
}

// Inversa da DFT 2D
export function idft2D(matrix) {
  const M = matrix.length;
  const N = matrix[0].length;
  const out = Array.from({ length: M }, () => Array(N).fill(0));

  for (let x = 0; x < M; x++) {
    for (let y = 0; y < N; y++) {
      let sumRe = 0;
      let sumIm = 0;

      for (let u = 0; u < M; u++) {
        for (let v = 0; v < N; v++) {
          const angle = (2 * Math.PI * ((u * x) / M + (v * y) / N));
          const Fuv = matrix[u][v];
          sumRe += Fuv.re * Math.cos(angle) - Fuv.im * Math.sin(angle);
          sumIm += Fuv.re * Math.sin(angle) + Fuv.im * Math.cos(angle);
        }
      }

      out[x][y] = sumRe / (M * N);
    }
  }

  return out;
}

// Desloca quadrantes do espectro (baixas frequências no centro)
export function fftShift2D(matrix) {
  const M = matrix.length;
  const N = matrix[0].length;
  const shifted = Array.from({ length: M }, () => Array(N).fill(0));

  const cx = Math.floor(M / 2);
  const cy = Math.floor(N / 2);

  for (let x = 0; x < M; x++) {
    for (let y = 0; y < N; y++) {
      const nx = (x + cx) % M;
      const ny = (y + cy) % N;
      shifted[x][y] = matrix[nx][ny];
    }
  }

  return shifted;
}

// Normaliza matriz para [0, 1]
function normalizeMatrix2D(matrix) {
  let min = Infinity, max = -Infinity;
  const M = matrix.length;
  const N = matrix[0].length;

  for (let x = 0; x < M; x++) {
    for (let y = 0; y < N; y++) {
      const v = matrix[x][y];
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }

  const out = Array.from({ length: M }, () => Array(N).fill(0));
  for (let x = 0; x < M; x++) {
    for (let y = 0; y < N; y++) {
      out[x][y] = (matrix[x][y] - min) / (max - min);
    }
  }

  return out;
}

export function applyFourierLenta(canvas) {
  const { R, G, B } = utils.splitImage(canvas);

  const FR = dft2D(R);
  const FG = dft2D(G);
  const FB = dft2D(B);

  // Magnitude logarítmica
  const magnitude = (F) => {
    const M = F.length;
    const N = F[0].length;
    const mag = Array.from({ length: M }, () => Array(N).fill(0));
    for (let x = 0; x < M; x++) {
      for (let y = 0; y < N; y++) {
        mag[x][y] = Math.log(1 + Math.sqrt(F[x][y].re ** 2 + F[x][y].im ** 2));
      }
    }
    return mag;
  };

  const MR = fftShift2D(normalizeMatrix2D(magnitude(FR)));
  const MG = fftShift2D(normalizeMatrix2D(magnitude(FG)));
  const MB = fftShift2D(normalizeMatrix2D(magnitude(FB)));

  const spectrum = utils.unifyImage(MR, MG, MB);
  utils.updateCanvas(canvas, spectrum);
}

