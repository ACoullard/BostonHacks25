/**
 * Convert an image to ASCII art that fills the viewport in color.
 * Uses actual line-height measurement to fully fill vertically.
 *
 * @param {string} imagePath - path to image (e.g. /Lake.jpg)
 * @param {number} fontSizePx - font size for ASCII characters
 * @returns {Promise<string>} - HTML string with colored ASCII spans
 */
export async function imageToAscii(imagePath, fontSizePx = 10) {
  const img = await loadImage(imagePath);

  // Measure actual monospace character dimensions with line-height: 1
  const { width: charWidth, lineHeight } = getCharDimensions(fontSizePx);

  // Compute number of columns/rows to fill viewport exactly
  const columns = Math.floor(window.innerWidth / charWidth);
  const rows = Math.floor(window.innerHeight / lineHeight);

  // Draw scaled image on canvas
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, columns, rows);

  const imageData = ctx.getImageData(0, 0, columns, rows).data;
  const chars = "@%#*+=-:. "; // darkest → lightest
  let asciiHtml = "";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const idx = (y * columns + x) * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];

      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const char = chars[Math.floor((1 - brightness) * (chars.length - 1))];

      asciiHtml += `<span style="color: rgb(${r},${g},${b})">${char}</span>`;
    }
    asciiHtml += "\n"; // newline for proper <pre> rendering
  }

  return asciiHtml;
}

/* Load image helper */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* Measure monospace character width and actual line-height */
function getCharDimensions(fontSizePx = 10, fontFamily = "monospace") {
  const span = document.createElement("span");
  span.style.fontFamily = fontFamily;
  span.style.fontSize = fontSizePx + "px";
  span.style.lineHeight = "1"; // CRITICAL: Match the line-height in your <pre> element
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "pre";
  span.textContent = "M";
  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  const lineHeight = span.offsetHeight; // actual rendered height including spacing
  document.body.removeChild(span);
  return { width: rect.width, lineHeight };
}