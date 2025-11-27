import { GoogleGenAI } from "@google/genai";
import { AdvisorResponse, MenuDatabase, MenuItem, UIContent, UserProfile } from "../types";
import { PROMPT_ADVISOR_SYSTEM, PROMPT_GENERATE_MENU, PROMPT_UI_COPY, FALLBACK_DB, FALLBACK_UI } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment. Using mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMenuDatabase = async (): Promise<MenuDatabase> => {
  const ai = getClient();
  if (!ai) return FALLBACK_DB;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: PROMPT_GENERATE_MENU,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MenuDatabase;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Failed to generate menu:", error);
    return FALLBACK_DB;
  }
};

export const generateAdvisorAnalysis = async (
  profile: UserProfile,
  selection: { main_dish: MenuItem; snack: MenuItem; drink: MenuItem },
  alternatives: MenuItem[]
): Promise<AdvisorResponse | null> => {
  const ai = getClient();
  if (!ai) return null;

  const userMessage = {
    user_profile: profile,
    selected_menu: selection,
    candidate_alternatives: alternatives.map(a => ({
        name_th: a.name_th,
        calories_kcal: a.calories_kcal,
        sugar_g: a.sugar_g,
        caffeine_level: a.caffeine_level,
        health_score: a.health_score
    })) // Minify context
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: JSON.stringify(userMessage),
      config: {
        systemInstruction: PROMPT_ADVISOR_SYSTEM,
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AdvisorResponse;
    }
    return null;
  } catch (error) {
    console.error("Analysis failed:", error);
    return null;
  }
};

export const generateUICopy = async (): Promise<UIContent> => {
  const ai = getClient();
  if (!ai) return FALLBACK_UI;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate fresh UI copy.",
      config: {
        systemInstruction: PROMPT_UI_COPY,
        responseMimeType: "application/json",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as UIContent;
    }
    return FALLBACK_UI;
  } catch (error) {
    console.error("Failed to generate UI copy:", error);
    return FALLBACK_UI;
  }
};