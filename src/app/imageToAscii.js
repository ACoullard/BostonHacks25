/**
 * Draws an image as colored ASCII directly to a canvas (no DOM heavy spans).
 * @param {string} imagePath 
 * @param {number} fontSizePx 
 * @param {HTMLCanvasElement} canvas 
 */
export async function imageToAscii(imagePath, fontSizePx = 12, canvas) {
  const img = await loadImage(imagePath);
  const ctx = canvas.getContext("2d");
  const { width: charW, lineHeight } = getCharDimensions(fontSizePx);
  const cols = Math.floor(window.innerWidth / charW);
  const rows = Math.floor(window.innerHeight / lineHeight);
  canvas.width = cols * charW;
  canvas.height = rows * lineHeight;

  // scale image to ASCII grid
  const temp = document.createElement("canvas");
  temp.width = cols;
  temp.height = rows;
  const tctx = temp.getContext("2d");
  tctx.drawImage(img, 0, 0, cols, rows);
  const data = tctx.getImageData(0, 0, cols, rows).data;

  const chars = "@%#*+=-:. ";
  let rSum = 0, gSum = 0, bSum = 0, samples = 0;

  ctx.font = `${fontSizePx}px monospace`;
  ctx.textBaseline = "top";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      if (x % 10 === 0 && y % 10 === 0) {
        rSum += r; gSum += g; bSum += b; samples++;
      }
      const brightness = (0.299*r + 0.587*g + 0.114*b) / 255;
      const char = chars[Math.floor((1 - brightness) * (chars.length - 1))];
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillText(char, x * charW, y * lineHeight);
    }
  }

  return {
    dominantColor: {
      r: Math.round(rSum / samples),
      g: Math.round(gSum / samples),
      b: Math.round(bSum / samples),
    }
  };
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function getCharDimensions(fontSizePx = 10, fontFamily = "monospace") {
  const span = document.createElement("span");
  span.style.fontFamily = fontFamily;
  span.style.fontSize = fontSizePx + "px";
  span.style.lineHeight = "1";
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.textContent = "M";
  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  document.body.removeChild(span);
  return { width: rect.width, lineHeight: rect.height };
}
