
import { GoogleGenAI } from "@google/genai";

export const getAttendanceMotivation = async (user: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Semangat mengabdi untuk mencerdaskan anak bangsa!";
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan satu kalimat motivasi pagi yang singkat dan inspiratif untuk seorang guru bernama ${user} di SD Negeri Indonesia. Gunakan bahasa Indonesia yang sopan dan menyemangati.`
    });
    return response.text || "Semangat mengabdi untuk mencerdaskan anak bangsa!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Semangat mengajar hari ini!";
  }
};
