// UploadExcel.jsx UPDATED
import { useState, useCallback, useRef, useEffect } from "react";
import ExcelJS from "exceljs";
import GeneratePDF from "./GeneratePDF";
import ErrorBoundary from "../utils/ErrorBoundary";
import Toast from "../utils/Toast";
import { useLayout } from "../context/LayoutProvider";
import { parseJobMetaFromFileName } from "../utils/parseJobMetaFromFileName";

export default function UploadExcel({ resetSignal, setCoupons, hasCoupons, couponsLength, coupons }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [jobMeta, setJobMeta] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  const { values } = useLayout();
  const {
    paperWidthPt,
    paperHeightPt,
    couponWidthPt,
    couponHeightPt,
  } = values;

  const parseExcelFile = useCallback(async (file) => {
    const workbook = new ExcelJS.Workbook();
    const buffer = await readFileAsArrayBuffer(file);
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("No worksheets found in the Excel file");

    const headers = [];
    worksheet.getRow(1).eachCell((cell, i) => {
      headers[i] = cell.value?.toString().trim() || `Column${i}`;
    });

    const data = [];
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const rowData = {};
      let hasData = false;

      row.eachCell((cell, col) => {
        if (cell.value != null) {
          rowData[headers[col]] = cell.value;
          hasData = true;
        }
      });

      if (hasData) data.push(rowData);
    }

    return data;
  }, []);

  const readFileAsArrayBuffer = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = () => rej(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please upload a valid file (.xlsx)");
      setCoupons([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const meta = parseJobMetaFromFileName(file.name);
      setJobMeta(meta);
      const data = await parseExcelFile(file);
      setCoupons(data);
    } catch (err) {
      setError(err.message);
      setCoupons([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsLoading(false);
    }
  }, [parseExcelFile, setCoupons]);

  // RESET FIX
  useEffect(() => {
    if (resetSignal) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setCoupons([]);
      setError(null);
    }
  }, [resetSignal]);

  const checkSizesBeforeUpload = (e) => {
    const noPaper = !paperWidthPt || !paperHeightPt;
    const noCoupon = !couponWidthPt || !couponHeightPt;

    if (noPaper && noCoupon) {
      e.preventDefault();
      triggerToast("Please set paper and coupon size");
      return true;
    }

    if (noPaper) {
      e.preventDefault();
      triggerToast("Please set a paper size");
      return true;
    }

    if (noCoupon) {
      e.preventDefault();
      triggerToast("Please set a coupon size");
      return true;
    }

    return false;
  };

  return (
    <div className="w-full flex flex-col items-center bg-nero-800 focus:outline-none focus:ring-1 focus:border-nero-400">
      <div className="w-full p-2.5 flex flex-col justify-center items-center gap-1 focus:outline-none focus:ring-1 focus:border-nero-400">
        <input
          ref={fileInputRef}
          className="w-full h-12 p-2 flex items-center cursor-pointer bg-nero-800 border border-default-medium text-heading text-sm rounded-md focus:ring-brand focus:border-brand focus:outline-none"
          id="file_input"
          accept=".xlsx,.xls"
          disabled={isLoading}
          type="file"
          onClick={(e) => {
            if (checkSizesBeforeUpload(e)) return;
          }}
          onChange={handleFile}
        />

        {!error && hasCoupons && (
          <div className="w-full flex justify-start items-center px-2">
            <h1 className="text-[14px] text-nero-300">
              {couponsLength} Coupon{couponsLength !== 1 ? "s" : ""}
            </h1>
          </div>
        )}

        {error && (
          <div className="w-[90%] text-red-200 mt-2 text-sm text-center py-0 px-2 rounded-md border border-red-200">
            {error}
          </div>
        )}
      </div>

      <ErrorBoundary>
        <GeneratePDF
          key={resetSignal}
          coupons={coupons}
          jobMeta={jobMeta}
          error={error}
        />
      </ErrorBoundary>

      <Toast message={toastMsg} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
