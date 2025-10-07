import { setupGammaCorrection, setupImageLoader, setupImageSaver, setupInvertButton } from './core/setup.js';

const canvas = document.getElementById('canvas');

setupImageLoader('input-image', canvas);
setupImageSaver('btn-save', canvas);
setupInvertButton('btn-inv', canvas);
setupGammaCorrection('btn-gamma', 'gamma-value', canvas)
