
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateInfographicContent(topic: string): Promise<GenerationResult> {
  const prompt = `Generate a structured Islamic infographic content for "${topic}". 
  Follow this logic:
  Provide 6 distinct parts/images. 
  Each part must have:
  1. title: A short label (e.g., "The Story of...", "Signs of Creation").
  2. hook: A catchy question for the top section (Islamic context).
  3. mindMap: An array of 3-5 concise points/facts for the middle section.
  4. spiritualTouch: A short emotional or faith-based sentence for the bottom.
  
  Make all content in Arabic. Use an elegant, professional, and spiritual tone.
  Ensure the data is accurate to Islamic teachings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          surahName: { type: Type.STRING },
          parts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                hook: { type: Type.STRING },
                mindMap: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                spiritualTouch: { type: Type.STRING }
              },
              required: ["title", "hook", "mindMap", "spiritualTouch"]
            }
          }
        },
        required: ["surahName", "parts"]
      }
    }
  });

  const jsonStr = response.text || "";
  return JSON.parse(jsonStr) as GenerationResult;
}
