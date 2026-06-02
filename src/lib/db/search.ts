import { collection, getDocs, query, where, orderBy, limit, Firestore } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { SearchResult, Food, Exercise, Recipe, HealthTip } from '@/types';

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(Boolean);
}

function score(text: string, queryTokens: string[]): number {
  const tokens = tokenize(text);
  let score = 0;
  for (const qt of queryTokens) {
    for (const t of tokens) {
      if (t === qt) score += 3;
      else if (t.startsWith(qt) || qt.startsWith(t)) score += 1.5;
      else if (t.includes(qt) || qt.includes(t)) score += 0.5;
    }
  }
  return score;
}

export async function searchKnowledgeBase(query: string): Promise<SearchResult[]> {
  const db = getFirestoreInstance();
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const results: SearchResult[] = [];
  const collections = ['foods', 'exercises', 'recipes', 'healthTips'] as const;

  const typeMap: Record<string, SearchResult['type']> = {
    foods: 'food',
    exercises: 'exercise',
    recipes: 'recipe',
    healthTips: 'tip',
  };

  for (const colName of collections) {
    const snapshot = await getDocs(collection(db, colName));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const searchText = [
        data.name || data.title || '',
        ...(data.benefits || []),
        ...(data.tags || []),
        data.category || '',
        ...(data.goodFor || []),
        ...(data.targetMuscles || []),
        ...(data.ingredients || []),
        data.content || '',
      ].join(' ');

      const s = score(searchText, queryTokens);
      if (s > 0) {
        results.push({
          type: typeMap[colName],
          id: docSnap.id,
          title: data.name || data.title,
          description: data.benefits?.[0] || data.content?.slice(0, 120) || '',
          tags: data.tags || [],
          score: s,
        });
      }
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 50);
}

export async function searchFoods(query: string): Promise<(Food & { id: string })[]> {
  const db = getFirestoreInstance();
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const snapshot = await getDocs(collection(db, 'foods'));
  const results: (Food & { id: string })[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as Food;
    const searchText = [data.name, ...data.benefits, ...data.tags, data.category, ...data.goodFor].join(' ').toLowerCase();
    const matches = queryTokens.some((qt) => searchText.includes(qt));
    if (matches) results.push({ ...data, id: doc.id });
  });

  return results;
}

export async function searchExercises(query: string): Promise<(Exercise & { id: string })[]> {
  const db = getFirestoreInstance();
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const snapshot = await getDocs(collection(db, 'exercises'));
  const results: (Exercise & { id: string })[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as Exercise;
    const searchText = [data.name, ...data.benefits, ...data.tags, data.category, ...data.targetMuscles].join(' ').toLowerCase();
    const matches = queryTokens.some((qt) => searchText.includes(qt));
    if (matches) results.push({ ...data, id: doc.id });
  });

  return results;
}

export async function searchRecipesByIngredients(ingredients: string[]): Promise<(Recipe & { id: string })[]> {
  const db = getFirestoreInstance();
  const queryTokens = ingredients.map((i) => i.toLowerCase().trim()).filter(Boolean);
  if (!queryTokens.length) return [];

  const snapshot = await getDocs(collection(db, 'recipes'));
  const results: (Recipe & { id: string })[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as Recipe;
    const recipeIngredients = data.ingredients.map((i) => i.toLowerCase());
    const matchCount = queryTokens.filter((qt) =>
      recipeIngredients.some((ri) => ri.includes(qt) || qt.includes(ri))
    ).length;
    if (matchCount > 0) {
      results.push({ ...data, id: doc.id });
    }
  });

  results.sort((a, b) => {
    const aMatch = a.ingredients.filter((i) => queryTokens.some((qt) => i.toLowerCase().includes(qt))).length;
    const bMatch = b.ingredients.filter((i) => queryTokens.some((qt) => i.toLowerCase().includes(qt))).length;
    return bMatch - aMatch;
  });

  return results;
}
