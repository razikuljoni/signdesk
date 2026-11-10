import {
  canvasPixelsToRatio,
  ratioToCanvasPixels,
  ratioToPdfPoints,
  pdfPointsToRatio,
} from './geometry';

describe('Geometry & Ratio conversion', () => {
  const canvasWidth = 800;
  const canvasHeight = 1100;
  const pdfPageWidth = 595.28; // Standard A4 width in pt
  const pdfPageHeight = 841.89; // Standard A4 height in pt

  it('converts canvas pixels to normalized ratios and back', () => {
    const originalPixel = { x: 100, y: 200, width: 150, height: 50 };
    const ratio = canvasPixelsToRatio(originalPixel, canvasWidth, canvasHeight);

    expect(ratio.xRatio).toBeCloseTo(100 / 800);
    expect(ratio.yRatio).toBeCloseTo(200 / 1100);
    expect(ratio.wRatio).toBeCloseTo(150 / 800);
    expect(ratio.hRatio).toBeCloseTo(50 / 1100);

    const reconstructed = ratioToCanvasPixels(ratio, canvasWidth, canvasHeight);
    expect(reconstructed.x).toBeCloseTo(originalPixel.x);
    expect(reconstructed.y).toBeCloseTo(originalPixel.y);
    expect(reconstructed.width).toBeCloseTo(originalPixel.width);
    expect(reconstructed.height).toBeCloseTo(originalPixel.height);
  });

  it('correctly flips Y when converting ratios to PDF points (origin bottom-left)', () => {
    // A field placed at top-left: yRatio = 0, hRatio = 0.1
    const topField = { xRatio: 0.1, yRatio: 0.0, wRatio: 0.2, hRatio: 0.1 };
    const pdfPoints = ratioToPdfPoints(topField, pdfPageWidth, pdfPageHeight);

    // In PDF, top-left field should have Y near the top of the page:
    // pdfY = pdfPageHeight - 0 - (0.1 * pdfPageHeight) = 0.9 * pdfPageHeight
    expect(pdfPoints.y).toBeCloseTo(pdfPageHeight * 0.9);
    expect(pdfPoints.height).toBeCloseTo(pdfPageHeight * 0.1);

    // Reverse conversion should yield the exact original ratio
    const backToRatio = pdfPointsToRatio(pdfPoints, pdfPageWidth, pdfPageHeight);
    expect(backToRatio.xRatio).toBeCloseTo(topField.xRatio);
    expect(backToRatio.yRatio).toBeCloseTo(topField.yRatio);
    expect(backToRatio.wRatio).toBeCloseTo(topField.wRatio);
    expect(backToRatio.hRatio).toBeCloseTo(topField.hRatio);
  });

  it('preserves field placement across different zoom levels', () => {
    const ratio = { xRatio: 0.25, yRatio: 0.5, wRatio: 0.2, hRatio: 0.05 };

    const zoom100 = ratioToCanvasPixels(ratio, 800, 1100);
    const zoom150 = ratioToCanvasPixels(ratio, 1200, 1650);

    expect(zoom150.x / zoom100.x).toBeCloseTo(1.5);
    expect(zoom150.y / zoom100.y).toBeCloseTo(1.5);
    expect(zoom150.width / zoom100.width).toBeCloseTo(1.5);
    expect(zoom150.height / zoom100.height).toBeCloseTo(1.5);
  });
});
