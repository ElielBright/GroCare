'use client';

import { useParams } from 'next/navigation';
import { useDocument } from '@/lib/hooks/useFirestore';
import { Exercise } from '@/types';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

const difficultyColor = (d: string) => {
  switch (d) {
    case 'beginner': return 'text-green-400 bg-green-900/30';
    case 'intermediate': return 'text-yellow-400 bg-yellow-900/30';
    case 'advanced': return 'text-red-400 bg-red-900/30';
    default: return 'text-gray-400 bg-gray-800';
  }
};

export default function ExerciseDetailPage() {
  const { id } = useParams();
  const { data: exercise, loading } = useDocument<Exercise>('exercises', id as string);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!exercise) return <p className="text-gray-400">Exercise not found.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/exercises" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <FiArrowLeft /> Back to Exercises
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {exercise.imageUrl && (
          <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-64 object-cover" />
        )}
        <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
        <p className="text-green-400 capitalize mb-6">{exercise.category}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {exercise.targetMuscles.map((m) => (
            <span key={m} className="px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300">{m}</span>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Benefits</h2>
          <ul className="space-y-2">
            {exercise.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <span className="text-green-500 mt-1">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Instructions</h2>
          <ol className="space-y-3">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center gap-6 p-4 bg-gray-800 rounded-lg">
          {exercise.duration && (
            <div>
              <p className="text-sm text-gray-400">Duration</p>
              <p className="text-lg font-semibold">{exercise.duration}</p>
            </div>
          )}
          {exercise.caloriesBurn && (
            <div>
              <p className="text-sm text-gray-400">Calories Burn</p>
              <p className="text-lg font-semibold">{exercise.caloriesBurn}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {exercise.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-500">#{tag}</span>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
