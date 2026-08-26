let currentSvgString = "";

function drawQrPattern(ctx, qr, moduleCount, tileSize, style, fg, bg){
  let svg = "";

  if(style === 'rounded'){
    const dark = (r, c) => r >= 0 && r < moduleCount && c >= 0 && c < moduleCount && qr.isDark(r, c);
    const radius = tileSize * 0.3;
    let svgPath = "";

    ctx.beginPath();
    for(let row = 0; row < moduleCount; row++){
      for(let col = 0; col < moduleCount; col++){
        if(isFinderZone(row, col, moduleCount) || !dark(row, col)) continue;
        const x = col * tileSize;
        const y = row * tileSize;
        const tl = !dark(row - 1, col) && !dark(row, col - 1);
        const tr = !dark(row - 1, col) && !dark(row, col + 1);
        const br = !dark(row + 1, col) && !dark(row, col + 1);
        const bl = !dark(row + 1, col) && !dark(row, col - 1);
        traceModuleCanvas(ctx, x, y, tileSize, tileSize, radius, tl, tr, br, bl);
        svgPath += moduleSvgPath(x, y, tileSize, tileSize, radius, tl, tr, br, bl);
      }
    }
    ctx.fillStyle = fg;
    ctx.fill();
    svg += `<path d="${svgPath}" fill="${fg}"/>`;

    const eyePositions = [
      [0, 0],
      [0, (moduleCount - 7) * tileSize],
      [(moduleCount - 7) * tileSize, 0]
    ];
    for(const [ey, ex] of eyePositions){
      drawFinderEyeCanvas(ctx, ex, ey, tileSize, fg, bg);
      svg += finderEyeSvg(ex, ey, tileSize, fg, bg);
    }
  }else{
    ctx.fillStyle = fg;
    for(let row = 0; row < moduleCount; row++){
      for(let col = 0; col < moduleCount; col++){
        if(qr.isDark(row, col)){
          const x = col * tileSize;
          const y = row * tileSize;
          ctx.fillRect(x, y, tileSize, tileSize);
          svg += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${tileSize.toFixed(2)}" height="${tileSize.toFixed(2)}" fill="${fg}"/>`;
        }
      }
    }
  }

  return svg;
}

function buildQR(){
  const dataEl = document.getElementById('data');
  const text = dataEl.value.trim();
  const placeholder = document.getElementById('placeholder');
  const canvas = document.getElementById('qr-canvas');

  if(!text){
    placeholder.style.display = 'flex';
    canvas.style.display = 'none';
    currentSvgString = "";
    return;
  }

  const ecc = document.getElementById('ecc').value;
  const size = parseInt(document.getElementById('size').value, 10);
  const fg = document.getElementById('fgColor').value;
  const bg = document.getElementById('bgColor').value;
  const style = document.getElementById('style').value;

  let qr;
  try{
    qr = qrcode(0, ecc);
    qr.addData(text);
    qr.make();
  }catch(e){
    qr = qrcode(0, ecc);
    qr.addData(text, 'Byte');
    qr.make();
  }

  const moduleCount = qr.getModuleCount();
  const tileSize = size / moduleCount;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  let svgRects = drawQrPattern(ctx, qr, moduleCount, tileSize, style, fg, bg);

  if(hasLogo()){
    svgRects += drawLogo(ctx, size, bg);
  }

  currentSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${bg}"/>${svgRects}</svg>`;

  placeholder.style.display = 'none';
  canvas.style.display = 'block';
}
