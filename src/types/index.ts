export interface Food {
  id: string;
  name: string;
  category: string;
  benefits: string[];
  risks?: string[];
  goodFor: string[];
  nutrients: { name: string; amount: string }[];
  servingSuggestion?: string;
  imageUrl?: string;
  tags: string[];
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
  benefits: string[];
  instructions: string[];
  duration?: string;
  caloriesBurn?: string;
  imageUrl?: string;
  tags: string[];
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  benefits: string[];
  prepTime: string;
  cookTime: string;
  tags: string[];
}

export interface HealthTip {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

export interface HealthGoal {
  id: string;
  name: string;
  description: string;
  type: 'weight_loss' | 'muscle_gain' | 'maintain' | 'improve_sleep' | 'reduce_sugar' | 'improve_stamina' | 'mental_wellness';
  recommendations: string[];
  exercises: string[];
  foods: string[];
  tags?: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active';
  createdAt: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  waterCups?: number;
  sleepHours?: number;
  exerciseMinutes?: number;
  mood?: number;
  calories?: number;
  notes?: string;
}

export interface SearchResult {
  type: 'food' | 'exercise' | 'recipe' | 'tip';
  id: string;
  title: string;
  description: string;
  tags: string[];
  score: number;
}
