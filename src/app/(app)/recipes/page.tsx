'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { Recipe } from '@/types';
import { FiSearch, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<(Recipe & { id: string })[]>([]);
  const [filtered, setFiltered] = useState<(Recipe & { id: string })[]>([]);
  const [ingredients, setIngredients] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const db = getFirestoreInstance();
      const snap = await getDocs(collection(db, 'recipes'));
      const items: (Recipe & { id: string })[] = [];
      snap.forEach((doc) => items.push({ ...doc.data() as Recipe, id: doc.id }));
      setRecipes(items);
      setFiltered(items);
      setLoading(false);
    }
    fetch();
  }, []);

  useEffect(() => {
    let result = recipes;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.includes(q)) ||
          r.tags.some((t) => t.includes(q))
      );
    }
    if (ingredients.trim()) {
      const inputIngredients = ingredients.split(',').map((i) => i.trim().toLowerCase()).filter(Boolean);
      result = result.filter((r) =>
        inputIngredients.some((input) =>
          r.ingredients.some((ri) => ri.toLowerCase().includes(input) || input.includes(ri.toLowerCase()))
        )
      );
      result.sort((a, b) => {
        const aMatch = a.ingredients.filter((i) => inputIngredients.some((ii) => i.toLowerCase().includes(ii))).length;
        const bMatch = b.ingredients.filter((i) => inputIngredients.some((ii) => i.toLowerCase().includes(ii))).length;
        return bMatch - aMatch;
      });
    }
    setFiltered(result);
  }, [search, ingredients, recipes]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Recipe Finder</h1>
        <p className="text-gray-400 mt-1">Discover recipes based on ingredients you have</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter ingredients (e.g., oats, banana, cocoa)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading recipes...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No recipes found. Try different ingredients.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-xl font-semibold">{recipe.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><FiClock /> Prep: {recipe.prepTime}</span>
                  <span className="flex items-center gap-1"><FiClock /> Cook: {recipe.cookTime}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {recipe.ingredients.map((ing) => (
                    <span key={ing} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-green-400">{ing}</span>
                  ))}
                </div>

                <div className="mt-3 space-y-1">
                  {recipe.benefits.map((b, i) => (
                    <p key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      {b}
                    </p>
                  ))}
                </div>

                <button
                  onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)}
                  className="mt-3 flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                >
                  {expanded === recipe.id ? 'Hide' : 'Show'} Instructions
                  {expanded === recipe.id ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {expanded === recipe.id && (
                  <ol className="mt-3 space-y-2 border-t border-gray-800 pt-3">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-xs">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
