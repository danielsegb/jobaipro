import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

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
      extractedText = await new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfParser = new (PDFParser as any)(null, 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
        pdfParser.parseBuffer(buffer);
      }) as string;
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

    // Helper to sanitize and normalize text
    const cleanText = (text: string): string => {
      if (!text) return "";
      const lines = text.split(/\r?\n/);
      const cleanedLines: string[] = [];

      for (const line of lines) {
        const trimmedLine = line.trimEnd();

        // Remove every line matching /-*\s*Page \(\d+\) Break\s*-*/gi
        if (/-*\s*Page \(\d+\) Break\s*-*/gi.test(trimmedLine)) {
          continue;
        }

        // Strip runs of dashes used as separators (e.g., --, ---, -----)
        const sanitizedLine = trimmedLine.replace(/-{2,}/g, "");

        cleanedLines.push(sanitizedLine);
      }

      // Collapse 3+ blank lines into one (at most 1 consecutive blank line)
      const collapsedLines: string[] = [];
      let consecutiveEmptyCount = 0;
      for (const line of cleanedLines) {
        if (line.trim() === "") {
          consecutiveEmptyCount++;
          if (consecutiveEmptyCount <= 1) {
            collapsedLines.push("");
          }
        } else {
          consecutiveEmptyCount = 0;
          collapsedLines.push(line);
        }
      }

      return collapsedLines.join("\n").trim();
    };

    extractedText = cleanText(extractedText);

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
