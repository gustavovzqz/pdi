import Chart from 'chart.js/auto';
import dragDataPlugin from 'chartjs-plugin-dragdata';

import { invertColors, gammaCorrection, linearFunction, encodeSteganography, decodeSteganography, updateToGrayScale } from './imageProcessor.js';


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
    invertColors(canvas);
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

    gammaCorrection(canvas, gamma);
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

    linearFunction(canvas, p1, p2);

    modal.style.display = 'none';
  });

}

// Setup GrayScale

export function setupGrayScale(canvas, btnGrayScaleId) {

  const btnGray = document.getElementById(btnGrayScaleId);

  btnGray.addEventListener('click', () => {
    updateToGrayScale(canvas);
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
    encodeSteganography(canvas, textArea.value)
    textArea.value = "";
  })


  btnDecodify.addEventListener('click', () => {
    textArea.value = decodeSteganography(canvas);
  })

}




// Setup Graphic
let chartInstance = null;
export function setupGraph(containerId) {
  const canvas = document.getElementById(containerId);

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
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

  chartInstance = new Chart(canvas, {
    type: 'scatter',
    data,
    options,
    plugins: [dragDataPlugin]
  });

  return () => [p1, p2];
}
