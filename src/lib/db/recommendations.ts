import { collection, getDocs } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { Food, Exercise, HealthTip, HealthGoal } from '@/types';

export interface RecommendationResult {
  foods: (Food & { id: string })[];
  exercises: (Exercise & { id: string })[];
  tips: (HealthTip & { id: string })[];
  goal?: HealthGoal & { id: string };
}

export async function getRecommendationsForGoal(goalType: string): Promise<RecommendationResult> {
  const db = getFirestoreInstance();
  let goal: (HealthGoal & { id: string }) | undefined;

  const goalsSnap = await getDocs(collection(db, 'healthGoals'));
  goalsSnap.forEach((doc) => {
    const data = doc.data() as HealthGoal;
    if (data.type === goalType) goal = { ...data, id: doc.id };
  });

  if (!goal) return { foods: [], exercises: [], tips: [] };

  const allFoods = await getDocs(collection(db, 'foods'));
  const foods: (Food & { id: string })[] = [];
  allFoods.forEach((doc) => {
    const data = doc.data() as Food;
    if (goal!.foods.some((f) => data.name.toLowerCase().includes(f.toLowerCase()) || f.includes(data.name.toLowerCase()))) {
      foods.push({ ...data, id: doc.id });
    }
  });

  const allExercises = await getDocs(collection(db, 'exercises'));
  const exercises: (Exercise & { id: string })[] = [];
  allExercises.forEach((doc) => {
    const data = doc.data() as Exercise;
    if (goal!.exercises.some((e) => data.name.toLowerCase().includes(e.toLowerCase()) || e.includes(data.name.toLowerCase()))) {
      exercises.push({ ...data, id: doc.id });
    }
  });

  const allTips = await getDocs(collection(db, 'healthTips'));
  const tips: (HealthTip & { id: string })[] = [];
  allTips.forEach((doc) => {
    const data = doc.data() as HealthTip;
    if (data.tags.some((t) => goal!.tags?.includes(t) || goalType.includes(t))) {
      tips.push({ ...data, id: doc.id });
    }
  });

  return { foods, exercises, tips, goal };
}
