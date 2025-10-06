import { setupImageLoader, setupImageSaver, setupInvertButton } from './core/setup.js';
import { invertColors } from './core/imageProcessor.js';

const canvas = document.getElementById('canvas');

setupImageLoader('input-image', canvas);
setupImageSaver('btn-save', canvas);
setupInvertButton('btn-inv', canvas, invertColors);
