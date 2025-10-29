import dragDataPlugin from 'chartjs-plugin-dragdata';

import * as imageProcessor from './imageProcessor.js';
import * as utils from './utils.js';
import * as convMatrices from './conv_matrices.js'


// Load Image
export function setupImageLoader(inputImageId, canvas) {
  const inputImage = document.getElementById(inputImageId);
  const ctx = canvas.getContext('2d');

  inputImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Save Image
export function setupImageSaver(buttonId, canvas) {
  const btnSave = document.getElementById(buttonId);

  btnSave.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'imagem-editada.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// Invert
export function setupInvertButton(buttonId, canvas) {
  const btn = document.getElementById(buttonId);
  btn.addEventListener('click', () => {
    imageProcessor.invertColors(canvas);
  });
}

export function setupAdjustChannel(canvas, btnId, modalId, applyId) {
  const btn = document.getElementById(btnId);
  const modal = document.getElementById(modalId);
  const btnApply = document.getElementById(applyId);
  const input_r = document.getElementById('channel-r');
  const input_g = document.getElementById('channel-g');
  const input_b = document.getElementById('channel-b');


  btn.addEventListener('click', () => {

    modal.style.display = 'block';
  })


  btnApply.addEventListener('click', () => {
    const r_factor = parseFloat(input_r.value)
    const g_factor = parseFloat(input_g.value)
    const b_factor = parseFloat(input_b.value)

    imageProcessor.adjustChannel(canvas, r_factor, g_factor, b_factor)

  });



  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });


}

// Gamma Correction
export function setupGammaCorrection(buttonId, inputId, canvas) {
  const btnGamma = document.getElementById(buttonId);
  const inputGamma = document.getElementById(inputId);

  btnGamma.addEventListener('click', () => {
    const gamma = parseFloat(inputGamma.value);

    if (isNaN(gamma) || gamma <= 0) {
      alert('Informe um valor de gamma válido (maior que 0)');
      return;
    }

    imageProcessor.gammaCorrection(canvas, gamma);
  });
}

// Graph Modal Setup
export function setupPiecewiseGraph(buttonId, modalId, closeId, confirmBtnId, canvas) {
  const btnPiecewise = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);
  const closeModal = document.getElementById(closeId);
  const btnConfirm = document.getElementById(confirmBtnId);

  let getThresholdPointsFn = null;

  btnPiecewise.addEventListener('click', () => {
    modal.style.display = 'block';
    getThresholdPointsFn = setupGraph('graph-container');
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  btnConfirm.addEventListener('click', () => {
    if (!getThresholdPointsFn) return;

    const [p1, p2] = getThresholdPointsFn();

    imageProcessor.linearFunction(canvas, p1, p2);

    modal.style.display = 'none';
  });

}

// Setup GrayScale
export function setupGrayScale(canvas, btnGrayScaleId) {

  const btnGray = document.getElementById(btnGrayScaleId);

  btnGray.addEventListener('click', () => {
    imageProcessor.updateToGrayScale(canvas);
  });

}

// Setup SimpleGrayScale
export function setupSimpleGrayScale(canvas, btnGrayScaleId) {

  const btnGray = document.getElementById(btnGrayScaleId);

  btnGray.addEventListener('click', () => {
    imageProcessor.updateToSimpleGrayScale(canvas);
  });

}

export function setupFourier(canvas, btnFourierId) {

  const btnFourier = document.getElementById(btnFourierId);

  btnFourier.addEventListener('click', () => {
    imageProcessor.fourierTransform(canvas);
  });

}


// Setup Steganography

export function setupSteganography(
  btnSteganographyId,
  modalId,
  closeId,
  textAreaId,
  btnDecodifyId,
  btnCodifyId,
  canvas) {

  const btnSteganography = document.getElementById(btnSteganographyId);
  const modal = document.getElementById(modalId);
  const closeModal = document.getElementById(closeId);
  const textArea = document.getElementById(textAreaId);
  const btnCodify = document.getElementById(btnCodifyId);
  const btnDecodify = document.getElementById(btnDecodifyId);

  btnSteganography.addEventListener('click', () => {
    modal.style.display = 'block';
    textArea.value = "";
  });


  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  btnCodify.addEventListener('click', () => {
    imageProcessor.encodeSteganography(canvas, textArea.value)
    textArea.value = "";
  })


  btnDecodify.addEventListener('click', () => {
    textArea.value = imageProcessor.decodeSteganography(canvas);
  })

}

// Setup Graphic
let chartGraphInstance = null;
function setupGraph(containerId) {
  const canvas = document.getElementById(containerId);

  if (chartGraphInstance) {
    chartGraphInstance.destroy();
    chartGraphInstance = null;
  }

  // posições iniciais dos pontos móveis (x,y)
  let p1 = { x: 0.3, y: 0.3 };
  let p2 = { x: 0.7, y: 0.7 };

  const data = {
    datasets: [{
      label: 'Transformação por Partes',
      data: [
        { x: 0, y: 0 },
        p1,
        p2,
        { x: 1, y: 1 }
      ],
      showLine: true,
      borderColor: 'lightgreen',
      backgroundColor: function(ctx) {
        const index = ctx.dataIndex;
        if (index === 1 || index === 2) return 'red';
        return 'black';
      },
      pointRadius: 12,
      fill: false,
    }]
  };

  const options = {
    scales: {
      x: { type: 'linear', min: 0, max: 1 },
      y: { type: 'linear', min: 0, max: 1 }
    },
    plugins: {
      dragData: {
        round: 3,
        showTooltip: true,
        dragX: true,
        dragY: true,
        onDragStart: (_e, _datasetIndex, index, _value) => {
          return index === 1 || index === 2;
        },
        onDrag: (_e, _datasetIndex, index, value) => {
          if (index === 1) {
            if (value.x > p2.x) value.x = p2.x;
            value.y = Math.min(Math.max(0, value.y), 1);
          }
          if (index === 2) {
            if (value.x < p1.x) value.x = p1.x;
            value.y = Math.min(Math.max(0, value.y), 1);
          }
        },
        onDragEnd: (_e, _datasetIndex, index, value) => {
          if (index === 1) {
            p1 = { x: value.x, y: value.y };
          } else if (index === 2) {
            p2 = { x: value.x, y: value.y };
          }
        }
      }
    }
  };

  chartGraphInstance = new Chart(canvas, {
    type: 'scatter',
    data,
    options,
    plugins: [dragDataPlugin]
  });

  return () => [p1, p2];
}

export function setupRotation(buttonId, modalId, rotButtonId, canvas) {

  const btnRotation = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);
  const btnApplyRotation = document.getElementById(rotButtonId);
  const input = document.getElementById('rot-input');

  btnRotation.addEventListener('click', () => {

    modal.style.display = 'block';
  })

  btnApplyRotation.addEventListener('click', () => {
    const rotationValue = parseFloat(input.value);

    imageProcessor.rotImage(canvas, rotationValue);

  });


  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

}

export function setupScale(buttonId, modalId, scaleButtonId, canvas) {

  const btnScale = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);

  const btnApplyScale = document.getElementById(scaleButtonId);
  const input_x = document.getElementById('scale-input-x');
  const input_y = document.getElementById('scale-input-y');

  btnScale.addEventListener('click', () => {

    modal.style.display = 'block';
  });

  btnApplyScale.addEventListener('click', () => {
    const scaleValueX = parseFloat(input_x.value);
    const scaleValueY = parseFloat(input_y.value);


    imageProcessor.scaleImage(canvas, scaleValueX, scaleValueY);

  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

}

// Histogram Setup

export function setupHistogramAnalysis
  (buttonId, modalId, closeId, equalizeId, equalizeRgbId, canvas) {

  const btnHistogram = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);
  const closeModal = document.getElementById(closeId);
  const btnEqualize = document.getElementById(equalizeId);
  const btnEqualizeRGB = document.getElementById(equalizeRgbId);


  btnHistogram.addEventListener('click', () => {

    modal.style.display = 'block';
    setupHistogramRGB('hist-container', canvas);
  })

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  })


  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  btnEqualize.addEventListener('click', () => {
    imageProcessor.equalizeHistogram(canvas);
    modal.style.display = 'none';
  })

  btnEqualizeRGB.addEventListener('click', () => {
    imageProcessor.equalizeHistogramRGB(canvas);
    modal.style.display = 'none';
  })

}

function setupHistogramRGB(containerId, canvas) {
  const histCanvas = document.getElementById(containerId);
  const ctxHist = histCanvas.getContext('2d');

  const { R, G, B } = utils.splitImage(canvas);
  const Y = utils.getYChannel(canvas);

  const width = canvas.width;
  const height = canvas.height;

  const histR = new Array(256).fill(0);
  const histG = new Array(256).fill(0);
  const histB = new Array(256).fill(0);
  const histI = new Array(256).fill(0);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = Math.min(255, Math.floor(R[y][x] * 255));
      const g = Math.min(255, Math.floor(G[y][x] * 255));
      const b = Math.min(255, Math.floor(B[y][x] * 255));
      const i = Math.min(255, Math.floor(Y[(y * width + x) * 4] * 255));

      histR[r]++;
      histG[g]++;
      histB[b]++;
      histI[i]++;
    }
  }

  if (window.histogramRGBChart) {
    window.histogramRGBChart.destroy();
  }

  const chartData = {
    labels: [...Array(256).keys()],
    datasets: [
      {
        label: 'R',
        data: histR,
        backgroundColor: 'rgba(255,0,0,0.7)',
        borderColor: 'rgba(150,0,0,1)',
        borderWidth: 1
      },
      {
        label: 'G',
        data: histG,
        backgroundColor: 'rgba(0,255,0,0.7)',
        borderColor: 'rgba(0,150,0,1)',
        borderWidth: 1
      },
      {
        label: 'B',
        data: histB,
        backgroundColor: 'rgba(0,0,255,0.7)',
        borderColor: 'rgba(0,0,150,1)',
        borderWidth: 1
      },
      {
        label: 'I',
        data: histI,
        backgroundColor: 'rgba(128,128,128,0.7)',
        borderColor: 'rgba(80,80,80,1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    scales: {
      x: {
        title: { display: true, text: 'Intensidade (0-255)' },
        ticks: { maxTicksLimit: 13 },
        grid: { display: true }
      },
      y: {
        title: { display: true, text: 'Número de Pixels' },
        beginAtZero: true,
        grid: { display: false }
      }
    },
    plugins: { legend: { display: true } }
  };

  window.histogramRGBChart = new Chart(ctxHist, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });
}


// Setup Binarization

export function setupBinarization(btnId, canvas) {

  const btnLimiar = document.getElementById(btnId);

  btnLimiar.addEventListener('click', () => {
    imageProcessor.binarizeImage(canvas);
  });
}

export function setupConvolution({
  triggerBtnId,
  modalId,
  presetSelectId,
  presetDisplayId,
  applyBtnId,
  canvas
}) {
  const btnTrigger = document.getElementById(triggerBtnId);
  const modal = document.getElementById(modalId);
  const btnApply = document.getElementById(applyBtnId);
  const select = document.getElementById(presetSelectId);
  const display = document.getElementById(presetDisplayId);

  btnTrigger.addEventListener('click', () => {
    modal.style.display = 'block';
    showPresetMatrix(select.id, display.id);
  });

  select.addEventListener('change', () => {
    showPresetMatrix(select.id, display.id);
  });

  btnApply.addEventListener('click', () => {
    const matrix = getSelectedPresetMatrix(select.id);

    const adjust = (select.id !== 'gaussiana');

    if (matrix.length > 0) {
      imageProcessor.applyConvolution(matrix, canvas, adjust);
      modal.style.display = 'none';
    } else {
      alert('Selecione uma matriz válida.');
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function getSelectedPresetMatrix(selectId) {
  const preset = document.getElementById(selectId).value;

  switch (preset) {
    case 'laplaciano':
      return convMatrices.laplacian;
    case 'gaussiana':
      return convMatrices.gaussianBlur;
    case 'sobelX':
      return convMatrices.sobelX;
    case 'sobelY':
      return convMatrices.sobelY;
    default:
      return [];
  }
}

function showPresetMatrix(selectId, displayId) {
  const matrix = getSelectedPresetMatrix(selectId);
  document.getElementById(displayId).textContent =
    matrix.map(row => row.join('\t')).join('\n');
}

export function setupManualConvolution(
  triggerBtnId,
  modalId,
  sizeInputId,
  generateBtnId,
  matrixContainerId,
  applyBtnId,
  canvas
) {
  const btnTrigger = document.getElementById(triggerBtnId);
  const modal = document.getElementById(modalId);
  const inputSize = document.getElementById(sizeInputId);
  const btnGenerate = document.getElementById(generateBtnId);
  const matrixContainer = document.getElementById(matrixContainerId);
  const btnApply = document.getElementById(applyBtnId);

  btnTrigger.addEventListener('click', () => {
    modal.style.display = 'block';
    matrixContainer.innerHTML = '';
  });

  btnGenerate.addEventListener('click', () => {
    const size = parseInt(inputSize.value);
    if (isNaN(size) || size < 1) {
      alert('Digite um tamanho válido (número maior que 0)');
      return;
    }

    if (size % 2 === 0) {
      alert('digite um número ímpar para o tamanho da matriz (ex: 3, 5, 7...)');
      return;
    }
    generateMatrixInputs(matrixContainer, size);
  });

  btnApply.addEventListener('click', () => {
    const matrix = readMatrixFromInputs(matrixContainer);
    if (!matrix) {
      alert('Matriz inválida ou incompleta');
      return;
    }

    imageProcessor.applyConvolution(matrix, canvas);
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function generateMatrixInputs(container, size) {
  container.innerHTML = '';
  container.dataset.size = size;

  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gap = '6px';

  for (let i = 0; i < size * size; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    input.style.width = '100%';
    input.style.textAlign = 'center';
    input.placeholder = '0';
    container.appendChild(input);
  }
}

function readMatrixFromInputs(container) {
  const size = parseInt(container.dataset.size);
  if (!size) return null;

  const inputs = container.querySelectorAll('input');
  if (inputs.length !== size * size) return null;

  const matrix = [];
  for (let row = 0; row < size; row++) {
    const rowValues = [];
    for (let col = 0; col < size; col++) {
      const val = inputs[row * size + col].value;
      if (val.trim() === '' || isNaN(Number(val))) {
        return null;
      }
      rowValues.push(Number(val));
    }
    matrix.push(rowValues);
  }
  return matrix;
}


export function setupSharp(btnSharpId, btnHighId, btnLaplaceId, modalId, canvas) {
  const btnSharp = document.getElementById(btnSharpId);
  const btnHigh = document.getElementById(btnHighId);
  const btnLaplace = document.getElementById(btnLaplaceId);
  const modal = document.getElementById(modalId);

  const inputK = modal.querySelector('#input-k');

  btnSharp.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  btnHigh.addEventListener('click', () => {
    const k = parseFloat(inputK.value) || 1;
    imageProcessor.highboost(canvas, k);
    modal.style.display = 'none';
  });

  btnLaplace.addEventListener('click', () => {
    const k = parseFloat(inputK.value) || 1;
    imageProcessor.laplacianSharp(canvas, k);
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}


export function setupFilters(
  btnFilterId,
  modalId,
  btnMediaId,
  btnMediaPondId,
  btnMedianaId,
  canvas
) {
  const btnFilter = document.getElementById(btnFilterId);
  const btnMedia = document.getElementById(btnMediaId);
  const btnMediaPond = document.getElementById(btnMediaPondId);
  const btnMediana = document.getElementById(btnMedianaId);
  const modal = document.getElementById(modalId);

  const matrixInput = document.getElementById('matrix-size');

  btnFilter.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  function getMatrixSize() {
    const size = parseInt(matrixInput.value);
    if (isNaN(size) || size <= 0) {
      alert("Insira um tamanho válido para a matriz.");
      return null;
    }

    if (size % 2 === 0) {
      alert('digite um número ímpar para o tamanho da matriz (ex: 3, 5, 7...)');
      return;
    }

    return size;
  }

  btnMedia.addEventListener('click', () => {
    const size = getMatrixSize();
    if (size === null) return;

    imageProcessor.applyMeanFilter(size, canvas);
  });

  btnMediaPond.addEventListener('click', () => {
    const size = getMatrixSize();
    if (size === null) return;

    imageProcessor.applyWeightedMeanFilter(size, canvas);
  });

  btnMediana.addEventListener('click', () => {
    const size = getMatrixSize();
    if (size === null) return;

    imageProcessor.applyMedianFilter(size, canvas);
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

}



export function setupEdgeDetection(btnId, canvas) {
  const btnEdge = document.getElementById(btnId);

  btnEdge.addEventListener('click', () => {

    imageProcessor.magnitudeEdgeDetection(canvas);
  });
}


export function setupIllum(buttonId, modalId, btnApplyId, canvas) {

  const btn = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);

  const btnApply = document.getElementById(btnApplyId);
  const i_factor = document.getElementById('illum-value');

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  btnApply.addEventListener('click', () => {
    const i_fac = parseFloat(i_factor.value);

    imageProcessor.adjustIlluminance(canvas, i_fac);

  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

}


export function setupSat(buttonId, modalId, btnApplyId, canvas) {

  const btn = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);

  const btnApply = document.getElementById(btnApplyId);
  const i_factor = document.getElementById('sat-value');

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  btnApply.addEventListener('click', () => {
    const i_fac = parseFloat(i_factor.value);

    imageProcessor.adjustSat(canvas, i_fac);

  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

}

export function setupMatiz(buttonId, modalId, btnApplyId, canvas) {

  const btn = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);

  const btnApply = document.getElementById(btnApplyId);
  const i_factor = document.getElementById('matiz-value');

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  btnApply.addEventListener('click', () => {
    const i_fac = parseInt(i_factor.value);

    imageProcessor.adjustMatiz(canvas, i_fac);

  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

}

export function setupSepia(canvas, buttonId) {

  const btn = document.getElementById(buttonId);


  btn.addEventListener('click', () => {
    imageProcessor.applySepia(canvas);
  });


}

export function setupChroma(buttonId, modalId, btnApplyId, canvas) {
  const btn = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);

  const btnApply = document.getElementById(btnApplyId);
  const i_factor = document.getElementById('chroma-value');

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  btnApply.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const i_fac = parseInt(i_factor.value);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        imageProcessor.chromaKey(canvas, i_fac * 255, imageData);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}
