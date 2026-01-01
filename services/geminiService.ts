
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from "../types";

export async function generateInfographicContent(topic: string): Promise<GenerationResult> {
  // محاولة جلب المفتاح من كافة المصادر الممكنة في المتصفح وبيئة البناء
  const apiKey = 
    (process.env?.API_KEY) || 
    (window as any).process?.env?.API_KEY ||
    (import.meta as any).env?.VITE_API_KEY ||
    (import.meta as any).env?.API_KEY ||
    (process.env as any).GOOGLE_API_KEY;

  // فحص صارم للقيمة الناتجة
  if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey.length < 10) {
    console.error("API Key missing. Current process.env:", process.env);
    throw new Error("⚠️ لم يتم تفعيل المفتاح بعد. يرجى الذهاب إلى Netlify Deploys والضغط على 'Trigger deploy' ثم 'Clear cache and deploy site' لكي يتم حقن المفتاح الذي أضفته.");
  }

  // إنشاء العميل باستخدام المفتاح الذي تم العثور عليه
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
    if (error.message?.includes("403") || error.message?.includes("API_KEY_INVALID")) {
      throw new Error("المفتاح البرمجي الذي أدخلته في Netlify غير صالح. يرجى التأكد من نسخه بشكل صحيح من Google AI Studio.");
    }
    throw error;
  }
}
