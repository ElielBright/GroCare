'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchKnowledgeBase } from '@/lib/db/search';
import { SearchResult } from '@/types';
import SearchBar from '@/components/SearchBar';
import { FiSearch, FiCoffee, FiActivity, FiBookOpen, FiFileText } from 'react-icons/fi';

const typeConfig: Record<SearchResult['type'], { icon: any; color: string; label: string }> = {
  food: { icon: FiCoffee, color: 'text-green-400', label: 'Food' },
  exercise: { icon: FiActivity, color: 'text-blue-400', label: 'Exercise' },
  recipe: { icon: FiBookOpen, color: 'text-purple-400', label: 'Recipe' },
  tip: { icon: FiFileText, color: 'text-yellow-400', label: 'Health Tip' },
};

const typeLinks: Record<SearchResult['type'], string> = {
  food: '/foods',
  exercise: '/exercises',
  recipe: '/recipes',
  tip: '/search',
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    searchKnowledgeBase(query).then((res) => {
      setResults(res);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-gray-400 mt-1">Search across foods, exercises, recipes, and health tips</p>
      </div>

      <div className="mb-8">
        <SearchBar placeholder="Search anything..." />
      </div>

      {!query && (
        <div className="text-center py-16 text-gray-500">
          <FiSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Type something to search</p>
          <p className="text-sm mt-1">Try "benefits of lettuce", "belly fat exercises", or "oats banana recipe"</p>
        </div>
      )}

      {loading && <p className="text-gray-400">Searching...</p>}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No results found for "{query}"</p>
          <p className="text-sm mt-1">Try different keywords or browse the sections above</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">{results.length} results for "{query}"</p>
          <div className="space-y-3">
            {results.map((result) => {
              const config = typeConfig[result.type];
              const Icon = config.icon;
              return (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={`${typeLinks[result.type]}/${result.id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{result.title}</h3>
                        <span className={`flex-shrink-0 text-xs ${config.color}`}>{config.label}</span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{result.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {result.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
      <SearchContent />
    </Suspense>
  );
}
