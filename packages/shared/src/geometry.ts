/**
 * Geometry conversion utilities for SignDesk PDF placement.
 * Canvas coordinates: origin top-left (0,0), Y goes downward.
 * PDF coordinates: origin bottom-left (0,0), Y goes upward.
 *
 * All coordinates in the database are stored as RATIOS (0.0 to 1.0) of page width & height.
 */

export interface FieldRatioGeometry {
  xRatio: number;
  yRatio: number;
  wRatio: number;
  hRatio: number;
}

export interface PdfPointGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasPixelGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Converts canvas pixel coordinates to normalized ratios (0 to 1).
 */
export function canvasPixelsToRatio(
  pixel: CanvasPixelGeometry,
  canvasWidth: number,
  canvasHeight: number
): FieldRatioGeometry {
  if (canvasWidth <= 0 || canvasHeight <= 0) {
    throw new Error('Canvas dimensions must be greater than zero');
  }
  return {
    xRatio: Math.max(0, Math.min(1, pixel.x / canvasWidth)),
    yRatio: Math.max(0, Math.min(1, pixel.y / canvasHeight)),
    wRatio: Math.max(0, Math.min(1, pixel.width / canvasWidth)),
    hRatio: Math.max(0, Math.min(1, pixel.height / canvasHeight)),
  };
}

/**
 * Converts normalized ratios to canvas pixel coordinates for a given zoom/render size.
 */
export function ratioToCanvasPixels(
  ratio: FieldRatioGeometry,
  canvasWidth: number,
  canvasHeight: number
): CanvasPixelGeometry {
  return {
    x: ratio.xRatio * canvasWidth,
    y: ratio.yRatio * canvasHeight,
    width: ratio.wRatio * canvasWidth,
    height: ratio.hRatio * canvasHeight,
  };
}

/**
 * Converts normalized ratios to PDF points with the Y-flip.
 * In PDF coordinates, origin (0,0) is bottom-left, so:
 * pdfX = xRatio * pdfPageWidth
 * pdfY = pdfPageHeight - (yRatio * pdfPageHeight) - (hRatio * pdfPageHeight)
 */
export function ratioToPdfPoints(
  ratio: FieldRatioGeometry,
  pdfPageWidth: number,
  pdfPageHeight: number
): PdfPointGeometry {
  const width = ratio.wRatio * pdfPageWidth;
  const height = ratio.hRatio * pdfPageHeight;
  const x = ratio.xRatio * pdfPageWidth;
  const y = pdfPageHeight - (ratio.yRatio * pdfPageHeight) - height;

  return {
    x,
    y,
    width,
    height,
  };
}

/**
 * Converts PDF points back to normalized ratios.
 */
export function pdfPointsToRatio(
  point: PdfPointGeometry,
  pdfPageWidth: number,
  pdfPageHeight: number
): FieldRatioGeometry {
  const xRatio = point.x / pdfPageWidth;
  const wRatio = point.width / pdfPageWidth;
  const hRatio = point.height / pdfPageHeight;
  const yRatio = (pdfPageHeight - point.y - point.height) / pdfPageHeight;

  return {
    xRatio: Math.max(0, Math.min(1, xRatio)),
    yRatio: Math.max(0, Math.min(1, yRatio)),
    wRatio: Math.max(0, Math.min(1, wRatio)),
    hRatio: Math.max(0, Math.min(1, hRatio)),
  };
}
