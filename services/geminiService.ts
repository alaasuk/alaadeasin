
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from "../types";

export async function generateInfographicContent(topic: string): Promise<GenerationResult> {
  // استخدام المفتاح مباشرة من بيئة التشغيل كما تطلب المكتبة
  // سيقوم النظام تلقائياً باستبدال هذه القيمة بالمفتاح الذي وضعته في Netlify
  const apiKey = process.env.API_KEY;

  const ai = new GoogleGenAI({ apiKey: apiKey as string });

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

    const text = response.text;
    if (!text) throw new Error("لم يتم استلام نص من الذكاء الاصطناعي.");
    
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as GenerationResult;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // إظهار الخطأ الحقيقي للمستخدم للمساعدة في التشخيص
    throw new Error(error.message || "فشل الاتصال بـ Gemini. تأكد من أن المفتاح البرمجي API_KEY صحيح ومفعل في إعدادات Netlify.");
  }
}
