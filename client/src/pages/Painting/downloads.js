import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel } from "docx";

async function loadImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const bytes = await blob.arrayBuffer();
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
  const isPng = blob.type === "image/png";
  return { bytes, dataUrl, width: size.width, height: size.height, isPng };
}

function labelLines(painting) {
  const lines = [painting.artist + ", " + painting.year];
  if (painting.medium) {
    let line = painting.medium + " on " + (painting.surface || "canvas").toLowerCase();
    if (painting.widthCm && painting.heightCm) {
      line += ", " + painting.widthCm + " x " + painting.heightCm + " cm";
    }
    lines.push(line);
  }
  if (painting.whereItHangs) {
    lines.push(painting.whereItHangs);
  }
  return lines;
}

function saveFile(blob, name) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function downloadPdf(painting) {
  const image = await loadImage(painting.image);
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  const ratio = image.height / image.width;
  let width = maxWidth;
  let height = width * ratio;
  if (height > 140) {
    height = 140;
    width = height / ratio;
  }
  pdf.addImage(image.dataUrl, image.isPng ? "PNG" : "JPEG", (pageWidth - width) / 2, margin, width, height);
  let y = margin + height + 16;
  pdf.setFont("times", "normal");
  pdf.setFontSize(22);
  pdf.text(painting.title, margin, y);
  y += 9;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  labelLines(painting).forEach((line) => {
    pdf.text(line, margin, y);
    y += 6;
  });
  if (painting.story) {
    y += 6;
    const lines = pdf.splitTextToSize(painting.story, maxWidth);
    pdf.text(lines, margin, y);
  }
  pdf.save(painting.slug + ".pdf");
}

export async function downloadWord(painting) {
  const image = await loadImage(painting.image);
  const width = 480;
  const height = Math.round((width * image.height) / image.width);
  const children = [
    new Paragraph({
      children: [new ImageRun({ data: image.bytes, transformation: { width, height }, type: image.isPng ? "png" : "jpg" })]
    }),
    new Paragraph({ text: painting.title, heading: HeadingLevel.HEADING_1 })
  ];
  labelLines(painting).forEach((line) => {
    children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22 })] }));
  });
  if (painting.story) {
    children.push(new Paragraph({ text: "" }));
    children.push(new Paragraph({ children: [new TextRun({ text: painting.story, size: 24 })] }));
  }
  const file = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(file);
  saveFile(blob, painting.slug + ".docx");
}
