// ----------------------------------------------
// TrimMarksPDFLib.jsx
// GRID-LOCKED TRIM MARKS (+1mm OFFSET)
// ----------------------------------------------

import { PDFDocument } from "pdf-lib";

export const addTrimMarksToPDF = async (pdfBytes, layout) => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  const {
    paperWidthPt,
    paperHeightPt,
    couponWidthPt,
    couponHeightPt,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    gapXPt,
    gapYPt,
  } = layout;

  pages.forEach((page) => {
    addDynamicTrimMarks(
      page,
      paperWidthPt,
      paperHeightPt,
      couponWidthPt,
      couponHeightPt,
      leftMargin,
      rightMargin,
      topMargin,
      bottomMargin,
      gapXPt || 0,
      gapYPt || 0
    );
  });

  return pdfDoc.save();
};

// TRIM MARK DRAWER
function addDynamicTrimMarks(
  page,
  pageWidth,
  pageHeight,
  couponWidth,
  couponHeight,
  leftMargin,
  rightMargin,
  topMargin,
  bottomMargin,
  gapX,
  gapY
) {
  const thickness = 0.7;
  const len = 8.5039;

  // 1mm offset (POINTS)
  const TRIM_OFFSET = 2.83465;

  const usableW = pageWidth - leftMargin - rightMargin;
  const usableH = pageHeight - topMargin - bottomMargin;

  const cols = Math.floor((usableW + gapX) / (couponWidth + gapX));
  const rows = Math.floor((usableH + gapY) / (couponHeight + gapY));

  if (cols <= 0 || rows <= 0) return;

  const gridHeight =
    rows * couponHeight + (rows - 1) * gapY;

  const startX = leftMargin;
  const startY = pageHeight - topMargin - gridHeight;

  const endX =
    startX + cols * couponWidth + (cols - 1) * gapX;
  const endY = startY + gridHeight;

  // CUT GRIDS
  const xCuts = [];
  for (let c = 0; c <= cols; c++) {
    xCuts.push(
      startX +
      c * couponWidth +
      Math.max(0, c - 1) * gapX
    );
  }

  const yCuts = [];
  for (let r = 0; r <= rows; r++) {
    yCuts.push(
      startY +
      r * couponHeight +
      Math.max(0, r - 1) * gapY
    );
  }

  // TOP & BOTTOM (VERTICAL)
  xCuts.forEach((x) => {
    // bottom
    page.drawLine({
      start: { x, y: startY - TRIM_OFFSET - len },
      end: { x, y: startY - TRIM_OFFSET },
      thickness,
    });

    // top
    page.drawLine({
      start: { x, y: endY + TRIM_OFFSET },
      end: { x, y: endY + TRIM_OFFSET + len },
      thickness,
    });
  });

  // LEFT & RIGHT (HORIZONTAL)
  yCuts.forEach((y) => {
    // left
    page.drawLine({
      start: { x: startX - TRIM_OFFSET - len, y },
      end: { x: startX - TRIM_OFFSET, y },
      thickness,
    });

    // right
    page.drawLine({
      start: { x: endX + TRIM_OFFSET, y },
      end: { x: endX + TRIM_OFFSET + len, y },
      thickness,
    });
  });

  // SECOND TRIM LOOP (ONLY IF GAP EXISTS)
  if (gapX > 0 || gapY > 0) {

    for (let c = 0; c < cols - 1; c++) {
      const labelEndX =
        startX + (c + 1) * couponWidth + c * gapX;

      const shiftedX = labelEndX + gapX;

      page.drawLine({
        start: { x: shiftedX, y: startY - TRIM_OFFSET - len },
        end: { x: shiftedX, y: startY - TRIM_OFFSET },
        thickness,
      });

      page.drawLine({
        start: { x: shiftedX, y: endY + TRIM_OFFSET },
        end: { x: shiftedX, y: endY + TRIM_OFFSET + len },
        thickness,
      });
    }

    for (let r = 0; r < rows - 1; r++) {
      const labelTopY =
        startY + (r + 1) * couponHeight + r * gapY;

      const shiftedY = labelTopY + gapY;

      page.drawLine({
        start: { x: startX - TRIM_OFFSET - len, y: shiftedY },
        end: { x: startX - TRIM_OFFSET, y: shiftedY },
        thickness,
      });

      page.drawLine({
        start: { x: endX + TRIM_OFFSET, y: shiftedY },
        end: { x: endX + TRIM_OFFSET + len, y: shiftedY },
        thickness,
      });
    }

  }

}
