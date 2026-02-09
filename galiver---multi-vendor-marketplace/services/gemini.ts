
// Fixed: Using process.env.API_KEY directly and ensuring correct initialization pattern.
import { GoogleGenAI } from "@google/genai";

export const getShoppingAdvice = async (query: string, products: any[]) => {
  try {
    // Correct initialization using process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const productContext = products.slice(0, 10).map(p => `${p.name}: ${p.price} টাকা`).join(', ');
    
    // Using basic text model as recommended for Q&A tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User asks in Bengali: "${query}". Products: [${productContext}]. Suggest the best one in Bengali (max 2 sentences).`,
    });

    // Accessing .text property directly instead of calling .text()
    return response.text || "আমি ঠিক বুঝতে পারছি না। দয়া করে আবার বলুন।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI সহকারী এই মুহূর্তে কাজ করছে না। আবার চেষ্টা করুন।";
  }
};
