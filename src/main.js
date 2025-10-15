import {
  SetupBinarization,
  setupGammaCorrection,
  setupGrayScale,
  setupHistogramAnalysis,
  setupImageLoader,
  setupImageSaver,
  setupInvertButton,
  setupPiecewiseGraph,
  setupSteganography
} from './core/setup.js';

const canvas = document.getElementById('canvas');

setupImageLoader('input-image', canvas);
setupImageSaver('btn-save', canvas);
setupInvertButton('btn-inv', canvas);
setupGammaCorrection('btn-gamma', 'gamma-value', canvas);
setupPiecewiseGraph(
  'btn-piecewise',
  'graph-modal',
  'close-graph-modal',
  'confirm-graph-points',
  canvas);

setupSteganography(
  'btn-steganography',
  'steganography-modal',
  'close-steganography-modal',
  'text-modal-textarea',
  'btn-decodify',
  'btn-codify',
  canvas)

setupHistogramAnalysis(
  'btn-hist',
  'hist-modal',
  'close-hist-modal',
  'btn-equalize',
  canvas
)

setupGrayScale(canvas, 'btn-gray')
SetupBinarization('btn-limiar', canvas);

