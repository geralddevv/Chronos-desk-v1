import { Document, Page, View, pdf, Text } from "@react-pdf/renderer";
import { useState, useEffect, useRef } from "react";
import { addTrimMarksToPDF } from "../utils/TrimMarksPDFLib";
import TokenTemplate from "../utils/TokenTemplate";
import { useLayout } from "../context/LayoutProvider";
import mergePDFBuffers from "../utils/mergePDFBuffers";
import ProgressBar from "../utils/ProgressBar";
import { useRefresh } from "../context/RefreshContext";
import Toast from "../utils/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { generateQR } from "../utils/generateQR";

// Utility Helpers

const split = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

function computeAutoMargins(layout) {
  const {
    paperWidthPt,
    paperHeightPt,
    couponWidthPt,
    couponHeightPt,
  } = layout.values;

  if (!paperWidthPt || !paperHeightPt || !couponWidthPt || !couponHeightPt)
    return;

  const { gapXPt, gapYPt } = layout.values;

  const cols = Math.floor(
    (paperWidthPt + gapXPt) / (couponWidthPt + gapXPt)
  );

  const rows = Math.floor(
    (paperHeightPt + gapYPt) / (couponHeightPt + gapYPt)
  );

  const usedW =
    cols * couponWidthPt + Math.max(0, cols - 1) * gapXPt;

  const usedH =
    rows * couponHeightPt + Math.max(0, rows - 1) * gapYPt;

  let marginX = Math.max(0, (paperWidthPt - usedW) / 2);
  let marginY = Math.max(0, (paperHeightPt - usedH) / 2);

  marginX -= paperWidthPt * 0.00008;
  marginY -= paperHeightPt * 0.00008;

  if (!layout.values.userMarginOverride) {
    layout.set.setLeftMargin(marginX);
    layout.set.setRightMargin(marginX);
    layout.set.setTopMargin(marginY);
    layout.set.setBottomMargin(marginY);
  }
}

const calculatePerPage = (layout) => {
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
  } = layout.values;

  const usableW = paperWidthPt - leftMargin - rightMargin;
  const usableH = paperHeightPt - topMargin - bottomMargin;

  const cols = Math.floor(
    (usableW + gapXPt) / (couponWidthPt + gapXPt)
  );

  const rows = Math.floor(
    (usableH + gapYPt) / (couponHeightPt + gapYPt)
  );

  return cols * rows;
};


// ----------------------------
// PDF Document Component
// ----------------------------

const PDFDoc = ({
  coupons,
  qrList,
  layout,
  pageOffset,
  totalSheets,
  totalLabels,
  code,
  lot,
  job,
}) => {

  const { values } = layout;

  const {
    paperWidthPt,
    paperHeightPt,
    couponWidthPt,
    couponHeightPt,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    fontScale,
    gapXPt,
    gapYPt,
  } = values;

  const usableW = paperWidthPt - leftMargin - rightMargin;
  const usableH = paperHeightPt - topMargin - bottomMargin;

  const columns = Math.max(
    1,
    Math.floor((usableW + gapXPt) / (couponWidthPt + gapXPt))
  );

  const rows = Math.max(
    1,
    Math.floor((usableH + gapYPt) / (couponHeightPt + gapYPt))
  );

  const perPage = columns * rows;

  const pages = [];
  for (let i = 0; i < coupons.length; i += perPage) {
    pages.push(coupons.slice(i, i + perPage));
  }

  return (
    <Document>
      {pages.map((pageCoupons, pIndex) => (
        <Page
          key={pIndex}
          size={{ width: paperWidthPt, height: paperHeightPt }}
          style={{ position: "relative" }}
        >
          <View
            style={{
              position: "absolute",
              // container = full top margin band
              top: 0,
              height: topMargin,
              // anchored to paper edge
              right: rightMargin,
              width: paperWidthPt,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#000",
                textAlign: "right",
                fontWeight: 700,
                paddingBottom: 10,
              }}
            >
              {code} ({totalLabels}) | EUREKA | DEC 2025 | Lot {lot} | Job {job} | Sheet {pageOffset + pIndex + 1}/{totalSheets}
            </Text>
          </View>
          <View
            style={{
              position: "absolute",

              // container = full top margin band
              bottom: 0,
              height: bottomMargin,

              // anchored to paper edge
              left: leftMargin,

              width: paperWidthPt,

              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#000",
                textAlign: "left",
                fontWeight: 700,
                paddingTop: 10,
              }}
            >
              {code} ({totalLabels}) | EUREKA | DEC 2025 | Lot {lot} | Job {job} | Sheet {pageOffset + pIndex + 1}/{totalSheets}
            </Text>
          </View>



          {pageCoupons.map((coupon, i) => {
            const globalIndex = pIndex * perPage + i;
            const row = Math.floor(i / columns);
            const col = i % columns;

            const x = leftMargin + col * (couponWidthPt + gapXPt);
            const y = topMargin + row * (couponHeightPt + gapYPt);

            const qrObj = qrList[globalIndex] || {};

            return (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: couponWidthPt,
                  height: couponHeightPt,
                }}
              >

                <TokenTemplate
                  coupon={coupon}
                  qrCode={qrObj.mainQr}
                  internalQr={qrObj.internalQr}
                  couponWidthPt={couponWidthPt}
                  couponHeightPt={couponHeightPt}
                  fontSize={5 * fontScale}
                />
              </View>
            );
          })}
        </Page>
      ))}
    </Document>
  );
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

export default function GeneratePDF({ coupons, jobMeta, error }) {
  const { resetSignal } = useRefresh();

  const qrListRef = useRef([]);
  const [pdfBlob, setPdfBlob] = useState(null);

  const [isReady, setIsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("qr");

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const layout = useLayout();

  // --------------------------------------------
  // Reset when refresh signal triggers
  // --------------------------------------------
  useEffect(() => {
    setProgress(0);
    setPhase("qr");
    setPdfBlob(null);
    qrListRef.current = [];
    setIsReady(false);
    setIsGenerating(false);
  }, [resetSignal]);

  // --------------------------------------------
  // Auto margin calculation
  // --------------------------------------------
  useEffect(() => {
    computeAutoMargins(layout);
  }, [
    layout.values.paperWidthPt,
    layout.values.paperHeightPt,
    layout.values.couponWidthPt,
    layout.values.couponHeightPt,
    layout.values.userMarginOverride,
  ]);

  // --------------------------------------------
  // QR GENERATION (batching)
  // --------------------------------------------
  useEffect(() => {
    const run = async () => {
      if (!coupons.length) return;

      setProgress(0);
      setPhase("qr");

      const batches = split(coupons, 100);
      const temp = [];

      for (let batch of batches) {
        for (let coupon of batch) {
          const qrValue =
            coupon.qrCode !== undefined
              ? coupon.qrCode
              : coupon["Code URL"];

          const mainQr =
            qrValue !== undefined && qrValue !== null && qrValue !== ""
              ? await generateQR(qrValue.toString())
              : null;

          const internalQr = coupon["Internal Code"]
            ? await generateQR(coupon["Internal Code"].toString())
            : null;

          temp.push({ mainQr, internalQr });

          setProgress(Math.round((temp.length / coupons.length) * 50));
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      qrListRef.current = temp;
      setProgress(50);
      setIsReady(true);
    };

    run();
  }, [coupons]);

  // --------------------------------------------
  // PAGE GENERATION + MERGING
  // --------------------------------------------
  useEffect(() => {
    const run = async () => {
      if (!isReady || qrListRef.current.length !== coupons.length) return;

      setIsGenerating(true);
      setPhase("pdf");

      const perPage = calculatePerPage(layout);
      const couponPages = split(coupons, perPage);
      const qrPages = split(qrListRef.current, perPage);

      const buffers = [];

      for (let i = 0; i < couponPages.length; i++) {
        setProgress(50 + Math.round(((i + 1) / couponPages.length) * 40));

        const blob = await pdf(
          <PDFDoc
            coupons={couponPages[i]}
            qrList={qrPages[i]}
            layout={layout}
            pageOffset={i * Math.ceil(couponPages[i].length / perPage)}
            totalSheets={Math.ceil(coupons.length / perPage)}
            totalLabels={coupons.length}
            code={jobMeta?.code}
            lot={jobMeta?.lot}
            job={jobMeta?.job}
          />
        ).toBlob();

        const raw = await blob.arrayBuffer();
        buffers.push(raw);
      }


      setPhase("merge");
      setProgress(95);

      const merged = await mergePDFBuffers(buffers);

      const trimmedPdf = await addTrimMarksToPDF(
        merged,
        layout.values
      );

      setPdfBlob(new Blob([trimmedPdf], { type: "application/pdf" }));

      setProgress(100);
      setIsGenerating(false);

      setToastMsg("PDF Generated!");
      setShowToast(true);

    };

    run();
  }, [isReady, coupons, layout.values]);

  const getOutputFileName = () => {
    const code = jobMeta?.code || "OUTPUT";
    const count = coupons.length;
    
    const lot = jobMeta?.lot ? `Lot ${jobMeta.lot}` : null;
    const job = jobMeta?.job ? `Job ${jobMeta.job}` : null;
    
    const extra =
      lot || job
        ? ` ( ${[lot, job].filter(Boolean).join(", ")} )`
        : "";
    
    return `${code} (${count})${extra}.pdf`;
  };

  // --------------------------------------------
  // ELECTRON DOWNLOAD
  // --------------------------------------------
  const handleElectronDownload = () => {
    if (!pdfBlob) return;

    const url = URL.createObjectURL(pdfBlob);
    const fileName = getOutputFileName();

    window.electronAPI.startElectronDownload(url, fileName);

    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };


  // --------------------------------------------
  // UI RENDER
  // --------------------------------------------

  if (!coupons.length || error) return null;

  return (
    <div className="w-full flex flex-col items-center gap-4 p-2.5 bg-nero-800">
      <AnimatePresence mode="wait">
        {(phase === "qr" || phase === "pdf" || phase === "merge") && (
          <ProgressBar progress={progress} phase={phase} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pdfBlob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              className="w-48 h-8 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-denim-600 hover:bg-denim-700 active:scale-95 transition-all focus:outline-none"
              onClick={handleElectronDownload}
            >
              Download
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
