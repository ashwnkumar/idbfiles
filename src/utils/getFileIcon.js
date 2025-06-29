const icons = {
  pdf: "/icons/pdf.png",
  doc: "/icons/doc.png",
  docx: "/icons/doc.png",
  xls: "/icons/xls.png",
  xlsx: "/icons/xls.png",
  jpeg: "/icons/jpg.png",
  jpg: "/icons/jpg.png",
  png: "/icons/png.png",
  svg: "/icons/svg.png",
  gif: "/icons/gif.png",
};

export const getFileIcon = (file) => {
  if (!file) return "/icons/default.png";
  const ext = file.name.split(".").pop().toLowerCase();
  return icons[ext] || "/icons/default.png";
};
