export type CaffeineLevel = "none" | "low" | "medium" | "high";
export type HealthTag = "healthy" | "normal" | "high_calorie" | "low_carb" | "high_protein";
export type CategoryType = "main_dish" | "snack" | "drink";

export interface MenuItem {
  id: string;
  name_th: string;
  name_en: string;
  description_th: string;
  calories_kcal: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
  sugar_g: number;
  fiber_g: number;
  caffeine_level: CaffeineLevel;
  health_score: number;
  type_tag: HealthTag;
}

export interface MenuDatabase {
  version: string;
  categories: {
    main_dish: MenuItem[];
    snack: MenuItem[];
    drink: MenuItem[];
  };
}

export interface UserProfile {
  age: number;
  gender: "male" | "female" | "other";
  weight_kg: number;
  height_cm: number;
  goal: "weight_loss" | "maintain" | "muscle_gain";
  has_diabetes: boolean;
  has_hypertension: boolean;
  sensitive_to_caffeine: boolean;
}

export interface Suggestion {
  from_category: CategoryType;
  name_th: string;
  reason_th: string;
}

export interface AdvisorResponse {
  summary_th: string;
  evaluation_th: string;
  risk_factors_th: string[];
  advice_th: string;
  health_score_overall: number;
  suggested_alternatives: Suggestion[];
}

export interface UIContent {
  buttons: {
    spin_now: string;
    spin_all: string;
    save_meal: string;
    see_stats: string;
  };
  messages: {
    daily_success: string[];
    low_sugar_reward: string[];
    high_caffeine_warning: string[];
  };
}

export interface SelectionState {
  main_dish: MenuItem | null;
  snack: MenuItem | null;
  drink: MenuItem | null;
}