export interface Message {
  id: string;
  sender: 'user' | 'nitish' | 'bappa';
  text: string;
  timestamp: string;
  category?: 'bmi' | 'plan' | 'supplement' | 'beginner_warning' | 'macro' | 'general';
  planData?: PlanData;
  bmiData?: BmiData;
}

export interface BmiData {
  heightCm: number;
  weightKg: number;
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  advice: string;
}

export interface Meal {
  time: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  items: string[];
}

export interface DailyPlan {
  day: string;
  focus: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    keyTip: string;
    isBeginnerSafe: boolean;
  }[];
  meals: Meal[];
  waterLitres: number;
}

export interface PlanData {
  goal: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  dietPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  dailyCalorieTarget: number;
  weeklySplit: DailyPlan[];
}

export interface ChatRequest {
  messages: { role: 'user' | 'model'; parts: { text: string }[] }[];
  userProfile?: {
    name?: string;
    experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    heightCm?: number;
    weightKg?: number;
    dietPreference?: string;
  };
}
