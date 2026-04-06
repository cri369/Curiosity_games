import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateNewQuestions() {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: "Genera 5 nuove curiosità bizzarre per un quiz. Ogni curiosità deve avere una domanda, 1 risposta corretta e 5 risposte sbagliate plausibili. Rispondi in formato JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING },
              correct: { type: Type.STRING },
              wrong: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["q", "correct", "wrong"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Errore generazione AI:", error);
    return null;
  }
}
