let logoImage = null;
let logoDataUrl = null;

function hasLogo(){
  return !!logoImage;
}

function drawLogo(ctx, size, bg){
  const logoPct = parseInt(document.getElementById('logoSize').value, 10) / 100;
  const logoSize = size * logoPct;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;
  const pad = logoSize * 0.14;
  const bx = logoX - pad, by = logoY - pad, bw = logoSize + pad * 2, bh = logoSize + pad * 2;

  const backingR = bw * 0.16;
  const iconR = logoSize * 0.2;

  ctx.fillStyle = bg;
  roundRectPath(ctx, bx, by, bw, bh, backingR);
  ctx.fill();

  const iw = logoImage.naturalWidth || logoImage.width;
  const ih = logoImage.naturalHeight || logoImage.height;
  const cropSize = Math.min(iw, ih);
  const sx = (iw - cropSize) / 2;
  const sy = (ih - cropSize) / 2;

  ctx.save();
  roundRectPath(ctx, logoX, logoY, logoSize, logoSize, iconR);
  ctx.clip();
  ctx.drawImage(logoImage, sx, sy, cropSize, cropSize, logoX, logoY, logoSize, logoSize);
  ctx.restore();

  const clipId = 'logoClip';
  return `<rect x="${bx.toFixed(2)}" y="${by.toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" rx="${backingR.toFixed(2)}" fill="${bg}"/><clipPath id="${clipId}"><rect x="${logoX.toFixed(2)}" y="${logoY.toFixed(2)}" width="${logoSize.toFixed(2)}" height="${logoSize.toFixed(2)}" rx="${iconR.toFixed(2)}"/></clipPath><image x="${logoX.toFixed(2)}" y="${logoY.toFixed(2)}" width="${logoSize.toFixed(2)}" height="${logoSize.toFixed(2)}" href="${logoDataUrl}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>`;
}

function setupLogoControls(onChange){
  document.getElementById('logoInput').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      logoDataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        logoImage = img;
        document.getElementById('clearLogo').style.display = 'inline-block';
        document.getElementById('logoSizeField').style.display = 'block';
        document.getElementById('ecc').value = 'H';
        onChange();
      };
      img.src = logoDataUrl;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('clearLogo').addEventListener('click', () => {
    logoImage = null;
    logoDataUrl = null;
    document.getElementById('logoInput').value = '';
    document.getElementById('clearLogo').style.display = 'none';
    document.getElementById('logoSizeField').style.display = 'none';
    onChange();
  });

  document.getElementById('logoSize').addEventListener('input', () => {
    document.getElementById('logoSizeVal').textContent = document.getElementById('logoSize').value + '%';
    onChange();
  });
}
