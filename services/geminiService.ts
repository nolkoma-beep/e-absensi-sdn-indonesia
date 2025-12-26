
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord } from "../types";

export const getAttendanceMotivation = async (user: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
