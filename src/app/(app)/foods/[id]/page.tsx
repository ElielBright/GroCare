'use client';

import { useParams } from 'next/navigation';
import { useDocument } from '@/lib/hooks/useFirestore';
import { Food } from '@/types';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function FoodDetailPage() {
  const { id } = useParams();
  const { data: food, loading } = useDocument<Food>('foods', id as string);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!food) return <p className="text-gray-400">Food not found.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/foods" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <FiArrowLeft /> Back to Foods
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {food.imageUrl && (
          <img src={food.imageUrl} alt={food.name} className="w-full h-56 object-cover" />
        )}
        <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold capitalize">{food.name}</h1>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-green-400 capitalize">{food.category}</span>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Benefits</h2>
          <ul className="space-y-2">
            {food.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <span className="text-green-500 mt-1">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {food.nutrients && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Nutrition (per 100g)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {food.nutrients.map((n, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{n.amount}</p>
                  <p className="text-sm text-gray-400 mt-1">{n.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {food.goodFor && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Good For</h2>
            <div className="flex flex-wrap gap-2">
              {food.goodFor.map((g) => (
                <span key={g} className="px-3 py-1.5 bg-green-900/50 text-green-300 rounded-full text-sm">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {food.risks && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-yellow-400">Risks</h2>
            <ul className="space-y-2">
              {food.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-yellow-300">
                  <span>⚠</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {food.servingSuggestion && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">Serving Suggestion</p>
            <p className="text-gray-200 mt-1">{food.servingSuggestion}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          {food.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-500">
              #{tag}
            </span>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
