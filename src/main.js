import {
  setupBinarization,
  setupConvolution,
  setupGammaCorrection,
  setupGrayScale,
  setupHistogramAnalysis,
  setupImageLoader,
  setupImageSaver,
  setupInvertButton,
  setupPiecewiseGraph,
  setupSteganography,
  setupManualConvolution,
  setupFilters,
  setupSharp,
  setupEdgeDetection,
  setupRotation,
  setupScale
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
setupBinarization('btn-limiar', canvas);



setupConvolution({
  triggerBtnId: 'btn-conv',
  modalId: 'conv-modal',
  presetSelectId: 'preset',
  presetDisplayId: 'preset-display',
  applyBtnId: 'apply-conv-btn',
  canvas
});

setupManualConvolution(
  'btn-conv-manual',
  'conv-manual-modal',
  'matrix-size',
  'btn-generate-matrix',
  'matrix-container',
  'apply-manual-conv-btn',
  canvas
);

setupFilters('btn-filters',
  'filters-manual-modal',
  'btn-media',
  'btn-media-ponderada',
  'btn-mediana',
  canvas
);

setupSharp('btn-sharp',
  'btn-high-boost',
  'btn-laplacian-sharp',
  'sharp-modal',
  canvas);

setupEdgeDetection('btn-edge', canvas);

setupRotation('btn-rot', 'rot-modal', 'confirm-rotation', canvas)
setupScale('btn-scale', 'scale-modal', 'confirm-scale', canvas)
