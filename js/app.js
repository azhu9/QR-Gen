function download(url, filename){
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.getElementById('data').addEventListener('input', buildQR);
document.getElementById('ecc').addEventListener('change', buildQR);
document.getElementById('size').addEventListener('change', buildQR);
document.getElementById('style').addEventListener('change', buildQR);
document.getElementById('fgColor').addEventListener('input', () => {
  document.getElementById('fgHex').textContent = document.getElementById('fgColor').value;
  buildQR();
});
document.getElementById('bgColor').addEventListener('input', () => {
  document.getElementById('bgHex').textContent = document.getElementById('bgColor').value;
  buildQR();
});

setupLogoControls(buildQR);

document.getElementById('downloadPng').addEventListener('click', () => {
  const canvas = document.getElementById('qr-canvas');
  if(canvas.style.display === 'none') return;
  download(canvas.toDataURL('image/png'), 'qr-code.png');
});

document.getElementById('downloadSvg').addEventListener('click', () => {
  if(!currentSvgString) return;
  const blob = new Blob([currentSvgString], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  download(url, 'qr-code.svg');
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.getElementById('copyPng').addEventListener('click', async () => {
  const canvas = document.getElementById('qr-canvas');
  const btn = document.getElementById('copyPng');
  if(canvas.style.display === 'none') return;

  try{
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1500);
  }catch(err){
    alert('Copy failed: ' + err.message);
  }
});

buildQR();
