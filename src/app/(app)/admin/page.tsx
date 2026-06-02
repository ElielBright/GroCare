'use client';

import { useState } from 'react';
import { seedAll } from '@/lib/db/seedFirestore';

export default function AdminPage() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setStatus('seeding');
    setMessage('Seeding database...');
    try {
      await seedAll();
      setStatus('done');
      setMessage('Database seeded successfully! All foods, exercises, recipes, health tips, and goals are now in Firestore.');
    } catch (err: any) {
      setStatus('error');
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Admin: Seed Database</h1>
      <p className="text-gray-400 mb-6">
        Populate Firestore with the initial knowledge base data (foods, exercises, recipes, health tips, and goals).
        Run this once after setting up your Firebase project.
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Knowledge Base Seeder</h2>
        <p className="text-gray-400 text-sm mb-4">
          This will create the following collections in Firestore:
        </p>
        <ul className="text-sm text-gray-400 space-y-1 mb-6">
          <li>• foods (60+ items)</li>
          <li>• exercises (35+ items)</li>
          <li>• recipes (27 items)</li>
          <li>• healthTips (32 items)</li>
          <li>• healthGoals (6 items)</li>
        </ul>

        <button
          onClick={handleSeed}
          disabled={status === 'seeding'}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {status === 'seeding' ? 'Seeding...' : 'Seed Database'}
        </button>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            status === 'done' ? 'bg-green-900/30 text-green-300 border border-green-700' :
            status === 'error' ? 'bg-red-900/30 text-red-300 border border-red-700' :
            'bg-gray-800 text-gray-300'
          }`}>
            {message}
          </div>
        )}
      </div>

      <div className="mt-8 bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
        <h3 className="text-yellow-400 font-semibold mb-2">⚠ Important</h3>
        <p className="text-sm text-yellow-300">
          Make sure you have set up your Firebase project and added the environment variables to{' '}
          <code className="px-1 py-0.5 bg-gray-800 rounded text-xs">.env.local</code> before running this.
          The seed will create documents in your Firestore database. If you run it multiple times,
          it will create duplicate documents.
        </p>
      </div>
    </div>
  );
}
