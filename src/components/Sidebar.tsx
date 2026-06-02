'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { FiHome, FiSearch, FiCoffee, FiActivity, FiBookOpen, FiTarget, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/search', label: 'Search', icon: FiSearch },
  { href: '/foods', label: 'Food Explorer', icon: FiCoffee },
  { href: '/exercises', label: 'Exercise Library', icon: FiActivity },
  { href: '/recipes', label: 'Recipes', icon: FiBookOpen },
  { href: '/goals', label: 'My Goals', icon: FiTarget },
  { href: '/progress', label: 'Progress', icon: FiBarChart2 },
  { href: '/admin', label: 'Admin (Seed DB)', icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const close = () => setOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-400">GroCare</h1>
          <p className="text-sm text-gray-400 mt-1">Your Life OS</p>
        </div>
        <button onClick={close} className="lg:hidden text-gray-400 hover:text-white">
          <FiX className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-gray-300 hover:text-white"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex-col z-50 hidden lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={close} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-gray-900 text-white flex flex-col z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
