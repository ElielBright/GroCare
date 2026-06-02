'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { DailyLog } from '@/types';
import { format } from 'date-fns';

export default function ProgressPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<(DailyLog & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    weight: '',
    waterCups: '',
    sleepHours: '',
    exerciseMinutes: '',
    mood: '5',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchLogs = async () => {
    if (!user) return;
    const db = getFirestoreInstance();
    const q = query(collection(db, 'dailyLogs'), orderBy('date', 'desc'), limit(30));
    const snap = await getDocs(q);
    const items: (DailyLog & { id: string })[] = [];
    snap.forEach((doc) => items.push({ ...doc.data() as DailyLog, id: doc.id }));
    setLogs(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const db = getFirestoreInstance();
      await addDoc(collection(db, 'dailyLogs'), {
        userId: user.uid,
        date: format(new Date(), 'yyyy-MM-dd'),
        weight: form.weight ? parseFloat(form.weight) : null,
        waterCups: form.waterCups ? parseInt(form.waterCups) : null,
        sleepHours: form.sleepHours ? parseFloat(form.sleepHours) : null,
        exerciseMinutes: form.exerciseMinutes ? parseInt(form.exerciseMinutes) : null,
        mood: parseInt(form.mood),
        notes: form.notes || null,
      });
      setForm({ weight: '', waterCups: '', sleepHours: '', exerciseMinutes: '', mood: '5', notes: '' });
      fetchLogs();
    } catch (err) {
      console.error('Error saving log:', err);
    } finally {
      setSaving(false);
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs.find((l) => l.date === today);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Progress Tracker</h1>
        <p className="text-gray-400 mt-1">Track your daily health metrics and see your progress over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {todayLog ? "Today's Log" : 'Log Today'}
          </h2>

          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Water (cups)</label>
                <input
                  type="number"
                  value={form.waterCups}
                  onChange={(e) => setForm({ ...form, waterCups: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Sleep (hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.sleepHours}
                  onChange={(e) => setForm({ ...form, sleepHours: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Exercise (min)</label>
                <input
                  type="number"
                  value={form.exerciseMinutes}
                  onChange={(e) => setForm({ ...form, exerciseMinutes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mood (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span className="text-green-400 font-medium">{form.mood}/10</span>
                <span>High</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Save Today\'s Log'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent History</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-400">No logs yet. Start tracking today!</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">{log.date}</p>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {log.weight && (
                      <div>
                        <p className="text-lg font-bold text-green-400">{log.weight}</p>
                        <p className="text-xs text-gray-500">kg</p>
                      </div>
                    )}
                    {log.waterCups !== null && log.waterCups !== undefined && (
                      <div>
                        <p className="text-lg font-bold text-blue-400">{log.waterCups}</p>
                        <p className="text-xs text-gray-500">water</p>
                      </div>
                    )}
                    {log.sleepHours && (
                      <div>
                        <p className="text-lg font-bold text-purple-400">{log.sleepHours}h</p>
                        <p className="text-xs text-gray-500">sleep</p>
                      </div>
                    )}
                    {log.exerciseMinutes && (
                      <div>
                        <p className="text-lg font-bold text-orange-400">{log.exerciseMinutes}m</p>
                        <p className="text-xs text-gray-500">exercise</p>
                      </div>
                    )}
                    {log.mood && (
                      <div>
                        <p className="text-lg font-bold text-yellow-400">{log.mood}/10</p>
                        <p className="text-xs text-gray-500">mood</p>
                      </div>
                    )}
                  </div>
                  {log.notes && <p className="text-sm text-gray-400 mt-2">{log.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
