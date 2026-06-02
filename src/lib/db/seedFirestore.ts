import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { foodsSeedData } from '@/lib/seed/foods';
import { exercisesSeedData } from '@/lib/seed/exercises';
import { recipesSeedData } from '@/lib/seed/recipes';
import { healthTipsSeedData } from '@/lib/seed/healthTips';
import { healthGoalsSeedData } from '@/lib/seed/healthGoals';

export async function seedFoods() {
  const db = getFirestoreInstance();
  const batch = writeBatch(db);
  foodsSeedData.forEach((food, index) => {
    const ref = doc(db, 'foods', `food_${index + 1}`);
    batch.set(ref, food);
  });
  await batch.commit();
}

export async function seedExercises() {
  const db = getFirestoreInstance();
  const batch = writeBatch(db);
  exercisesSeedData.forEach((exercise, index) => {
    const ref = doc(db, 'exercises', `exercise_${index + 1}`);
    batch.set(ref, exercise);
  });
  await batch.commit();
}

export async function seedRecipes() {
  const db = getFirestoreInstance();
  const batch = writeBatch(db);
  recipesSeedData.forEach((recipe, index) => {
    const ref = doc(db, 'recipes', `recipe_${index + 1}`);
    batch.set(ref, recipe);
  });
  await batch.commit();
}

export async function seedHealthTips() {
  const db = getFirestoreInstance();
  const batch = writeBatch(db);
  healthTipsSeedData.forEach((tip, index) => {
    const ref = doc(db, 'healthTips', `tip_${index + 1}`);
    batch.set(ref, tip);
  });
  await batch.commit();
}

export async function seedHealthGoals() {
  const db = getFirestoreInstance();
  const batch = writeBatch(db);
  healthGoalsSeedData.forEach((goal, index) => {
    const ref = doc(db, 'healthGoals', `goal_${index + 1}`);
    batch.set(ref, goal);
  });
  await batch.commit();
}

export async function seedAll() {
  await Promise.all([
    seedFoods(),
    seedExercises(),
    seedRecipes(),
    seedHealthTips(),
    seedHealthGoals(),
  ]);
}
