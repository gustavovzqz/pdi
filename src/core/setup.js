export function setupInvertButton(buttonId, canvas, invertFn) {
  const btn = document.getElementById(buttonId);
  btn.addEventListener('click', () => {
    invertFn(canvas);
  });
}

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

export function setupImageSaver(buttonId, canvas) {
  const btnSave = document.getElementById(buttonId);

  btnSave.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'imagem-editada.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}
