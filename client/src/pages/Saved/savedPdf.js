import { jsPDF } from "jspdf";

async function thumbData(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    const size = await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.width, height: image.height });
      image.src = dataUrl;
    });
    return { dataUrl, isPng: blob.type === "image/png", ratio: size.height / size.width };
  } catch (error) {
    return null;
  }
}

export async function makeSavedPdf(paintings) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  const thumbWidth = 28;
  let y = margin;
  pdf.setFont("times", "normal");
  pdf.setFontSize(24);
  pdf.text("Everything you've saved", margin, y);
  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(paintings.length + " paintings from ArtMind", margin, y);
  y += 12;
  for (const painting of paintings) {
    const thumb = await thumbData(painting.thumb);
    const rowHeight = thumb ? Math.min(28, thumbWidth * thumb.ratio) + 8 : 16;
    if (y + rowHeight > 280) {
      pdf.addPage();
      y = margin;
    }
    if (thumb) {
      pdf.addImage(thumb.dataUrl, thumb.isPng ? "PNG" : "JPEG", margin, y, thumbWidth, Math.min(28, thumbWidth * thumb.ratio));
    }
    pdf.setFont("times", "normal");
    pdf.setFontSize(14);
    pdf.text(painting.title, margin + thumbWidth + 8, y + 7);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(painting.artist + ", " + painting.year, margin + thumbWidth + 8, y + 13);
    y += rowHeight;
  }
  pdf.save("saved-paintings.pdf");
}
