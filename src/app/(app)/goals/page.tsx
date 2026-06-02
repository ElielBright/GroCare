'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { HealthGoal } from '@/types';
import Link from 'next/link';

export default function GoalsPage() {
  const [goals, setGoals] = useState<(HealthGoal & { id: string })[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<(HealthGoal & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userGoal, setUserGoal] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetch() {
      const db = getFirestoreInstance();
      const snap = await getDocs(collection(db, 'healthGoals'));
      const items: (HealthGoal & { id: string })[] = [];
      snap.forEach((doc) => items.push({ ...doc.data() as HealthGoal, id: doc.id }));
      setGoals(items);

      if (user) {
        const userSnap = await getDocs(collection(db, 'users'));
        userSnap.forEach((doc) => {
          if (doc.id === user.uid && doc.data().goal) setUserGoal(doc.data().goal);
        });
      }
      setLoading(false);
    }
    fetch();
  }, [user]);

  const selectGoal = async (goal: HealthGoal & { id: string }) => {
    if (!user) return;
    setSaving(true);
    try {
      const db = getFirestoreInstance();
      await setDoc(doc(db, 'users', user.uid), { goal: goal.type }, { merge: true });
      setUserGoal(goal.type);
      setSelectedGoal(goal);
    } catch (err) {
      console.error('Error saving goal:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400">Loading goals...</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Health Goals</h1>
        <p className="text-gray-400 mt-1">Set a health goal and get personalized recommendations</p>
      </div>

      {userGoal && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl">
          <p className="text-green-300">
            Your current goal: <strong>{goals.find((g) => g.type === userGoal)?.name}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`bg-gray-900 border rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 ${
              selectedGoal?.id === goal.id || userGoal === goal.type
                ? 'border-green-500'
                : 'border-gray-800 hover:border-gray-700'
            }`}
            onClick={() => setSelectedGoal(selectedGoal?.id === goal.id ? null : goal)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{goal.name}</h3>
              {(selectedGoal?.id === goal.id || userGoal === goal.type) && (
                <span className="text-green-400 text-sm">Active</span>
              )}
            </div>
            <p className="text-sm text-gray-400">{goal.description}</p>
          </div>
        ))}
      </div>

      {selectedGoal && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{selectedGoal.name}</h2>
            <button
              onClick={() => selectGoal(selectedGoal)}
              disabled={saving || userGoal === selectedGoal.type}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {saving ? 'Saving...' : userGoal === selectedGoal.type ? 'Current Goal' : 'Set as My Goal'}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {selectedGoal.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="text-green-500 mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommended Foods</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGoal.foods.map((food) => (
                  <Link
                    key={food}
                    href={`/foods`}
                    className="px-3 py-1.5 bg-green-900/40 text-green-300 rounded-full text-sm hover:bg-green-800 transition-colors"
                  >
                    {food}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommended Exercises</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGoal.exercises.map((ex) => (
                  <Link
                    key={ex}
                    href={`/exercises`}
                    className="px-3 py-1.5 bg-blue-900/40 text-blue-300 rounded-full text-sm hover:bg-blue-800 transition-colors"
                  >
                    {ex}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
