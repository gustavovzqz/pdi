export const laplacian = [
  [1, 1, 1],
  [1, -8, 1],
  [1, 1, 1]
];

export const gaussianBlur = [
  [1 / 16, 2 / 16, 1 / 16],
  [2 / 16, 4 / 16, 2 / 16],
  [1 / 16, 2 / 16, 1 / 16]
];

export const sobelX = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1]
];

export const sobelY = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1]
];
