import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeRouteExplanation = async (
  origin: string, 
  destination: string, 
  stops: string[]
): Promise<string> => {
  try {
    const prompt = `
      As an expert logistics AI for OptiiFreight (US Market), explain how you would optimize a partial load shipment 
      from ${origin} to ${destination} potentially sharing space with stops at ${stops.join(', ')}.
      
      Focus on:
      1. Cost savings methodology (USD).
      2. Carbon footprint reduction.
      3. Efficiency gains.
      
      Keep the response concise (under 100 words) and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Optimization analysis currently unavailable.";
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return "Unable to generate optimization analysis at this time.";
  }
};

export const chatWithAssistant = async (message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: message,
            config: {
                systemInstruction: "You are 'OptiiBot', a helpful logistics assistant for OptiiFreight in the United States. You help businesses save money on freight and carriers fill their trucks. Use USD and Imperial units (lbs, miles). Be concise and professional."
            }
        });
        return response.text || "I didn't catch that.";
    } catch (error) {
        console.error("Chat error", error);
        return "I am having trouble connecting to the optimization engine.";
    }
}