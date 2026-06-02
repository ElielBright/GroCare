'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { FiCoffee, FiActivity, FiBookOpen, FiTarget, FiBarChart2 } from 'react-icons/fi';

const quickModules = [
  { href: '/foods', label: 'Food Explorer', icon: FiCoffee, color: 'bg-green-600', desc: 'Search foods, benefits, and nutrition' },
  { href: '/exercises', label: 'Exercise Library', icon: FiActivity, color: 'bg-blue-600', desc: 'Find exercises and workout plans' },
  { href: '/recipes', label: 'Recipe Finder', icon: FiBookOpen, color: 'bg-purple-600', desc: 'Discover recipes from ingredients' },
  { href: '/goals', label: 'Health Goals', icon: FiTarget, color: 'bg-yellow-600', desc: 'Set and track your health goals' },
  { href: '/progress', label: 'Progress Tracker', icon: FiBarChart2, color: 'bg-red-600', desc: 'Log weight, water, sleep, exercise' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome{user?.displayName ? `, ${user.displayName}` : ''}</h1>
        <p className="text-gray-400 mt-1">Your personal health and wellness command center</p>
      </div>

      <div className="mb-10">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${mod.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{mod.label}</h3>
              <p className="text-gray-400 text-sm">{mod.desc}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Health Tip</h2>
        <p className="text-gray-300 italic">
          "The greatest wealth is health." — Start small, stay consistent, and track your progress.
          Your journey to better health begins with one step.
        </p>
      </div>
    </div>
  );
}
