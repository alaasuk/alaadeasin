
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from "../types";

export async function generateInfographicContent(topic: string): Promise<GenerationResult> {
  // البحث عن المفتاح بكل المسميات الممكنة لضمان التوافق مع إعدادات المستخدم في Netlify
  const apiKey = 
    process.env.API_KEY || 
    process.env.GOOGLE_API_KEY || 
    process.env.VITE_GOOGLE_API_KEY || 
    (window as any).process?.env?.GOOGLE_API_KEY;

  if (!apiKey || apiKey === "undefined") {
    throw new Error("لم يتم العثور على المفتاح البرمجي (API Key). يرجى التأكد من تسمية المتغير API_KEY في إعدادات Netlify وإعادة بناء الموقع.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a structured Islamic infographic content for "${topic}". 
  Provide exactly 6 distinct parts/images. 
  Each part must have:
  1. title: A short label.
  2. hook: A catchy question for the top section (Islamic context).
  3. mindMap: An array of 3-5 concise points/facts for the middle section.
  4. spiritualTouch: A short emotional or faith-based sentence for the bottom.
  
  Make all content in Arabic. Use an elegant, professional, and spiritual tone.
  Return ONLY a valid JSON object. No markdown wrappers like \`\`\`json.`;

  try {
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

    const text = response.text || "";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanJson) as GenerationResult;
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    // توضيح الخطأ للمستخدم بدلاً من الفشل الصامت
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("المفتاح البرمجي غير صالح. يرجى التأكد من نسخ المفتاح الصحيح من Google AI Studio.");
    }
    throw error;
  }
}
