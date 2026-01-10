export const parseJobMetaFromFileName = (fileName = "") => {
  // remove extension (.xlsx, .xls, etc.)
  const name = fileName.replace(/\.[^/.]+$/, "");

  // GWPMUUKACOO4E8 (Lot 1, Job 1)
  const codeMatch = name.match(/^(.+?)\s*\(/);
  const lotMatch = name.match(/Lot\s*(\d+)/i);
  const jobMatch = name.match(/Job\s*(\d+)/i);

  return {
    code: codeMatch?.[1]?.trim() || "",
    lot: lotMatch?.[1] || "",
    job: jobMatch?.[1] || "",
  };
};
