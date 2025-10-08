import {
  setupGammaCorrection,
  setupImageLoader,
  setupImageSaver,
  setupInvertButton,
  setupGraphModal
} from './core/setup.js';

const canvas = document.getElementById('canvas');

setupImageLoader('input-image', canvas);
setupImageSaver('btn-save', canvas);
setupInvertButton('btn-inv', canvas);
setupGammaCorrection('btn-gamma', 'gamma-value', canvas);
setupGraphModal('btn-piecewise', 'graph-modal', 'close-modal', 'confirm-points', canvas);
