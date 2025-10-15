export const laplace = [
  [0, -1, 0],
  [-1, 4, -1],
  [0, -1, 0]
];

export const gaussianBlur = [
  [1 / 16, 2 / 16, 1 / 16],
  [2 / 16, 4 / 16, 2 / 16],
  [1 / 16, 2 / 16, 1 / 16]
];

export const sharpen = [
  [0, -1, 0],
  [-1, 5, -1],
  [0, -1, 0]
];

export const edgeDetect = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1]
];
