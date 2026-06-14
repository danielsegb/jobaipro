import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

if (typeof global.DOMMatrix === 'undefined') {
  (global as any).DOMMatrix = class DOMMatrix {};
}
if (typeof global.ImageData === 'undefined') {
  (global as any).ImageData = class ImageData {};
}
if (typeof global.Path2D === 'undefined') {
  (global as any).Path2D = class Path2D {};
}

const pdfParse = require("pdf-parse");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "pdf" || file.type === "application/pdf") {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (
      ext === "docx" ||
      ext === "doc" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract any text from the document" },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("Error parsing document:", error);
    return NextResponse.json(
      { error: "Failed to parse document" },
      { status: 500 }
    );
  }
}
