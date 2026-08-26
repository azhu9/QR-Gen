function roundRectPath(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function isFinderZone(row, col, moduleCount){
  return (row < 7 && col < 7) ||
         (row < 7 && col >= moduleCount - 7) ||
         (row >= moduleCount - 7 && col < 7);
}

function traceModuleCanvas(ctx, x, y, w, h, r, tl, tr, br, bl){
  const rtl = tl ? r : 0, rtr = tr ? r : 0, rbr = br ? r : 0, rbl = bl ? r : 0;
  ctx.moveTo(x + rtl, y);
  ctx.lineTo(x + w - rtr, y);
  if(rtr) ctx.arcTo(x + w, y, x + w, y + rtr, rtr);
  ctx.lineTo(x + w, y + h - rbr);
  if(rbr) ctx.arcTo(x + w, y + h, x + w - rbr, y + h, rbr);
  ctx.lineTo(x + rbl, y + h);
  if(rbl) ctx.arcTo(x, y + h, x, y + h - rbl, rbl);
  ctx.lineTo(x, y + rtl);
  if(rtl) ctx.arcTo(x, y, x + rtl, y, rtl);
}

function moduleSvgPath(x, y, w, h, r, tl, tr, br, bl){
  const rtl = tl ? r : 0, rtr = tr ? r : 0, rbr = br ? r : 0, rbl = bl ? r : 0;
  let d = `M${(x + rtl).toFixed(2)},${y.toFixed(2)} L${(x + w - rtr).toFixed(2)},${y.toFixed(2)} `;
  if(rtr) d += `A${rtr.toFixed(2)},${rtr.toFixed(2)} 0 0 1 ${(x + w).toFixed(2)},${(y + rtr).toFixed(2)} `;
  d += `L${(x + w).toFixed(2)},${(y + h - rbr).toFixed(2)} `;
  if(rbr) d += `A${rbr.toFixed(2)},${rbr.toFixed(2)} 0 0 1 ${(x + w - rbr).toFixed(2)},${(y + h).toFixed(2)} `;
  d += `L${(x + rbl).toFixed(2)},${(y + h).toFixed(2)} `;
  if(rbl) d += `A${rbl.toFixed(2)},${rbl.toFixed(2)} 0 0 1 ${x.toFixed(2)},${(y + h - rbl).toFixed(2)} `;
  d += `L${x.toFixed(2)},${(y + rtl).toFixed(2)} `;
  if(rtl) d += `A${rtl.toFixed(2)},${rtl.toFixed(2)} 0 0 1 ${(x + rtl).toFixed(2)},${y.toFixed(2)} `;
  d += 'Z ';
  return d;
}

function drawFinderEyeCanvas(ctx, x0, y0, moduleSize, fg, bg){
  const outer = moduleSize * 7;
  roundRectPath(ctx, x0, y0, outer, outer, outer * 0.32);
  ctx.fillStyle = fg;
  ctx.fill();

  const midOff = moduleSize, midSize = moduleSize * 5;
  roundRectPath(ctx, x0 + midOff, y0 + midOff, midSize, midSize, midSize * 0.28);
  ctx.fillStyle = bg;
  ctx.fill();

  const inOff = moduleSize * 2, inSize = moduleSize * 3;
  roundRectPath(ctx, x0 + inOff, y0 + inOff, inSize, inSize, inSize * 0.45);
  ctx.fillStyle = fg;
  ctx.fill();
}

function finderEyeSvg(x0, y0, moduleSize, fg, bg){
  const outer = moduleSize * 7;
  const midOff = moduleSize, midSize = moduleSize * 5;
  const inOff = moduleSize * 2, inSize = moduleSize * 3;
  return `<rect x="${x0.toFixed(2)}" y="${y0.toFixed(2)}" width="${outer.toFixed(2)}" height="${outer.toFixed(2)}" rx="${(outer * 0.32).toFixed(2)}" fill="${fg}"/>` +
         `<rect x="${(x0 + midOff).toFixed(2)}" y="${(y0 + midOff).toFixed(2)}" width="${midSize.toFixed(2)}" height="${midSize.toFixed(2)}" rx="${(midSize * 0.28).toFixed(2)}" fill="${bg}"/>` +
         `<rect x="${(x0 + inOff).toFixed(2)}" y="${(y0 + inOff).toFixed(2)}" width="${inSize.toFixed(2)}" height="${inSize.toFixed(2)}" rx="${(inSize * 0.45).toFixed(2)}" fill="${fg}"/>`;
}
