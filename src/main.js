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
  setupScale,
  setupSimpleGrayScale,
  setupFourier,
  setupAdjustChannel,
  setupIllum,
  setupSat,
  setupMatiz,
  setupSepia,
  setupChroma,
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
  'btn-equalize-rgb',
  canvas
)

setupGrayScale(canvas, 'btn-gray')
setupSimpleGrayScale(canvas, 'btn-gray-simple')
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

setupRotation('btn-rot', 'rot-modal', 'confirm-rotation', canvas);
setupIllum('btn-ajuste-illum', 'illum-modal', 'confirm-illum', canvas);
setupSat('btn-ajuste-sat', 'sat-modal', 'confirm-sat', canvas);
setupMatiz('btn-ajuste-matiz', 'matiz-modal', 'confirm-matiz', canvas);
setupScale('btn-scale', 'scale-modal', 'confirm-scale', canvas);
setupFourier(canvas, 'btn-fourier');
setupAdjustChannel(
  canvas,
  'btn-ajuste-canal',
  'channel-modal',
  'apply-channel')
setupSepia(canvas, 'btn-sepia');
// o valor esta em chroma valuechroma-value
setupChroma('btn-chroma', 'chroma-modal', 'confirm-chroma', canvas);
