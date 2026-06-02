'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { Food } from '@/types';
import SearchBar from '@/components/SearchBar';
import { FiSearch } from 'react-icons/fi';

const categories = ['All', 'vegetable', 'fruit', 'protein', 'grain', 'nuts', 'dairy', 'ingredient', 'sweetener', 'beverage'];

export default function FoodsPage() {
  const [foods, setFoods] = useState<(Food & { id: string })[]>([]);
  const [filtered, setFiltered] = useState<(Food & { id: string })[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const db = getFirestoreInstance();
      const snap = await getDocs(collection(db, 'foods'));
      const items: (Food & { id: string })[] = [];
      snap.forEach((doc) => items.push({ ...doc.data() as Food, id: doc.id }));
      setFoods(items);
      setFiltered(items);
      setLoading(false);
    }
    fetch();
  }, []);

  useEffect(() => {
    let result = foods;
    if (category !== 'All') result = result.filter((f) => f.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.benefits.some((b) => b.toLowerCase().includes(q)) ||
          f.tags.some((t) => t.includes(q))
      );
    }
    setFiltered(result);
  }, [category, search, foods]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Food Explorer</h1>
        <p className="text-gray-400 mt-1">Search foods, discover benefits and nutrition information</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading foods...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No foods found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((food) => (
            <Link
              key={food.id}
              href={`/foods/${food.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all hover:-translate-y-1"
            >
              {food.imageUrl && (
                <img src={food.imageUrl} alt={food.name} className="w-full h-36 object-cover" />
              )}
              <div className="p-5">
              <h3 className="text-lg font-semibold capitalize">{food.name}</h3>
              <p className="text-sm text-green-400 mt-1 capitalize">{food.category}</p>
              <ul className="mt-3 space-y-1">
                {food.benefits.slice(0, 3).map((b, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {b}
                  </li>
                ))}
                {food.benefits.length > 3 && (
                  <li className="text-sm text-gray-500">+{food.benefits.length - 3} more benefits</li>
                )}
              </ul>
              <div className="flex flex-wrap gap-2 mt-3">
                {food.goodFor.slice(0, 2).map((g) => (
                  <span key={g} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
                    {g}
                  </span>
                ))}
              </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
