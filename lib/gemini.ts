import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Initializes the Gemini generative model.
 * Returns null if the API key is missing.
 */
export function getGeminiModel(modelName: "gemini-2.5-flash" | "gemini-1.5-flash" = "gemini-2.5-flash") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: modelName });
  } catch (error) {
    console.error(`Error initializing Gemini model ${modelName}:`, error);
    return null;
  }
}

/**
 * Generates content using Gemini, falling back to gemini-1.5-flash if 2.5 fails,
 * and falling back to a custom mock generator if the key is missing or all calls fail.
 */
export async function generateContent(
  prompt: string,
  options: { jsonMode?: boolean } = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  // Try gemini-2.5-flash first
  try {
    const model = getGeminiModel("gemini-2.5-flash");
    if (!model) throw new Error("Failed to get gemini-2.5-flash model");

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: options.jsonMode
        ? { responseMimeType: "application/json" }
        : undefined,
    });
    
    const text = response.response.text();
    if (text) return text;
    throw new Error("Empty response from gemini-2.5-flash");
  } catch (error) {
    console.warn("gemini-2.5-flash failed, attempting fallback to gemini-1.5-flash...", error);
    
    // Fallback to gemini-1.5-flash
    try {
      const fallbackModel = getGeminiModel("gemini-1.5-flash");
      if (!fallbackModel) throw new Error("Failed to get gemini-1.5-flash model");

      const response = await fallbackModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: options.jsonMode
          ? { responseMimeType: "application/json" }
          : undefined,
      });

      const text = response.response.text();
      if (text) return text;
      throw new Error("Empty response from gemini-1.5-flash");
    } catch (fallbackError) {
      console.error("All Gemini models failed:", fallbackError);
      throw fallbackError;
    }
  }
}
