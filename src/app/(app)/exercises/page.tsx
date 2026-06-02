'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { Exercise } from '@/types';
import { FiSearch } from 'react-icons/fi';

const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];
const categories = ['All', 'cardio', 'strength', 'hiit', 'flexibility'];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<(Exercise & { id: string })[]>([]);
  const [filtered, setFiltered] = useState<(Exercise & { id: string })[]>([]);
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const db = getFirestoreInstance();
      const snap = await getDocs(collection(db, 'exercises'));
      const items: (Exercise & { id: string })[] = [];
      snap.forEach((doc) => items.push({ ...doc.data() as Exercise, id: doc.id }));
      setExercises(items);
      setFiltered(items);
      setLoading(false);
    }
    fetch();
  }, []);

  useEffect(() => {
    let result = exercises;
    if (difficulty !== 'All') result = result.filter((e) => e.difficulty === difficulty);
    if (category !== 'All') result = result.filter((e) => e.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.benefits.some((b) => b.toLowerCase().includes(q)) ||
          e.targetMuscles.some((m) => m.includes(q)) ||
          e.tags.some((t) => t.includes(q))
      );
    }
    setFiltered(result);
  }, [difficulty, category, search, exercises]);

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return 'text-green-400 bg-green-900/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/30';
      case 'advanced': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Exercise Library</h1>
        <p className="text-gray-400 mt-1">Find exercises, learn proper form, and build workouts</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-500 py-2">Difficulty:</span>
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              difficulty === d ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-500 py-2">Category:</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {c === 'All' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading exercises...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No exercises found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all hover:-translate-y-1"
            >
              {exercise.imageUrl && (
                <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>
              <p className="text-sm text-green-400 capitalize">{exercise.category}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {exercise.targetMuscles.map((m) => (
                  <span key={m} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">
                    {m}
                  </span>
                ))}
              </div>
              <ul className="mt-3 space-y-1">
                {exercise.benefits.slice(0, 2).map((b, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                {exercise.duration && <span>⏱ {exercise.duration}</span>}
                {exercise.caloriesBurn && <span>🔥 {exercise.caloriesBurn}</span>}
              </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
