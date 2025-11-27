import { MenuDatabase, MenuItem, UIContent } from "./types";

export const DEFAULT_USER_PROFILE = {
  age: 25,
  gender: "female" as const,
  weight_kg: 60,
  height_cm: 165,
  goal: "maintain" as const,
  has_diabetes: false,
  has_hypertension: false,
  sensitive_to_caffeine: false,
};

// Fallback data in case API fails or for initial state
const MOCK_ITEM: MenuItem = {
  id: "mock-1",
  name_th: "ข้าวผัดกะเพราไก่ไข่ดาว",
  name_en: "Basil Chicken Fried Rice",
  description_th: "อาหารยอดนิยม รสจัดจ้าน",
  calories_kcal: 550,
  protein_g: 25,
  fat_g: 20,
  carb_g: 65,
  sugar_g: 5,
  fiber_g: 2,
  caffeine_level: "none",
  health_score: 6,
  type_tag: "normal"
};

export const FALLBACK_DB: MenuDatabase = {
  version: "1.0",
  categories: {
    main_dish: [MOCK_ITEM, { ...MOCK_ITEM, id: "mock-2", name_th: "สุกี้น้ำไก่", calories_kcal: 350, health_score: 9, type_tag: "healthy" }],
    snack: [{ ...MOCK_ITEM, id: "mock-3", name_th: "ผลไม้รวม", calories_kcal: 60, sugar_g: 10, type_tag: "healthy" }],
    drink: [{ ...MOCK_ITEM, id: "mock-4", name_th: "น้ำเปล่า", calories_kcal: 0, sugar_g: 0, health_score: 10, type_tag: "healthy" }]
  }
};

export const FALLBACK_UI: UIContent = {
  buttons: {
    spin_now: "หมุนเลย!",
    spin_all: "สุ่มชุดอาหาร",
    save_meal: "บันทึกมื้อนี้",
    see_stats: "ดูสถิติ"
  },
  messages: {
    daily_success: ["เยี่ยมมาก!"],
    low_sugar_reward: ["ลดน้ำตาลเพื่อสุขภาพที่ดี"],
    high_caffeine_warning: ["ระวังคาเฟอีนเกินขนาด"]
  }
};

// PROMPTS
export const PROMPT_GENERATE_MENU = `
You are a professional nutrition assistant.
GOAL: Generate diverse food menus and drinks in Thai and English with basic nutrition information.
Output MUST be strictly valid JSON.
Return a JSON object with this structure:
{
  "version": "1.0",
  "categories": {
    "main_dish": [ ... ],
    "snack": [ ... ],
    "drink": [ ... ]
  }
}
Each item must be an object:
{
  "id": "string-unique-id",
  "name_th": "string",
  "name_en": "string",
  "description_th": "string",
  "calories_kcal": number,
  "protein_g": number,
  "fat_g": number,
  "carb_g": number,
  "sugar_g": number,
  "fiber_g": number,
  "caffeine_level": "none | low | medium | high",
  "health_score": number, // 1-10
  "type_tag": "healthy | normal | high_calorie | low_carb | high_protein"
}
Generate 5 main_dish, 5 snack, and 5 drink items.
`;

export const PROMPT_ADVISOR_SYSTEM = `
You are "Nutri Advisor", an AI nutrition coach for the NutriWheel app.
GOAL: Given user profile and selected menu items, summarize, evaluate, highlight risks, and suggest alternatives.
Speak in friendly Thai, concise, motivating.
OUTPUT FORMAT (JSON):
{
  "summary_th": "string",
  "evaluation_th": "ดี / พอใช้ / ควรระวัง + เหตุผล",
  "risk_factors_th": ["string"],
  "advice_th": "string",
  "health_score_overall": number,
  "suggested_alternatives": [
    { "from_category": "main_dish | snack | drink", "name_th": "string", "reason_th": "string" }
  ]
}
`;

export const PROMPT_UI_COPY = `
You are a UX writer for NutriWheel.
Generate short Thai copy for buttons and messages. Friendly, motivating, modern.
OUTPUT FORMAT (JSON):
{
  "buttons": { "spin_now": "string", "spin_all": "string", "save_meal": "string", "see_stats": "string" },
  "messages": { "daily_success": ["string"], "low_sugar_reward": ["string"], "high_caffeine_warning": ["string"] }
}
`;
