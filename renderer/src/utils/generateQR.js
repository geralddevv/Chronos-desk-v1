import QRCode from "qrcode";

export const generateQR = async (value) => {
  if (!value) return null;

  try {
    return await QRCode.toDataURL(String(value), {
      margin: 0,
      width: 256,
      color: {
        dark: "#000000",
        light: "#FFFFFF00",
      },
    });
  } catch (err) {
    console.error("QR generation failed:", err);
    return null;
  }
};
