import { Search, Sparkles, X, Zap, TrendingUp, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { searchProducts, getTrendingProducts } from '../lib/search';
import { products } from '../data/products';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showTrends, setShowTrends] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { setSearchResults } = useStore();

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
    setTrendingProducts(getTrendingProducts());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowTrends(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const results = searchProducts(query);
      setSuggestions(results);
      setShowTrends(true);
      setSearchResults(results);
    } else {
      setSuggestions([]);
      setSearchResults([]);
    }
  }, [query, setSearchResults]);

  const handleSearch = (searchQuery: string) => {
    const results = searchProducts(searchQuery);
    
    // Update recent searches
    const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    setSearchResults(results);
    setShowTrends(false);
    setQuery(searchQuery);
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-500 dark:text-indigo-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowTrends(true)}
          placeholder="Search products..."
          className="w-full rounded-xl border-2 border-indigo-100 bg-white/80 py-3 pl-10 pr-12 text-sm backdrop-blur-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-indigo-900 dark:bg-gray-900/80 dark:text-white dark:focus:border-indigo-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSearchResults([]);
            }}
            className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 p-1 text-indigo-500 transition-colors hover:bg-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-500/30"
          onClick={() => setShowTrends(true)}
        >
          <Sparkles size={16} />
        </button>
      </div>
      <AnimatePresence>
        {(suggestions.length > 0 || showTrends) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-full rounded-2xl border border-indigo-100/50 bg-white/80 p-4 shadow-xl backdrop-blur-sm dark:border-indigo-900/50 dark:bg-gray-900/80 dark:shadow-indigo-900/5"
          >
            {suggestions.length > 0 ? (
              <>
                <p className="mb-3 flex items-center gap-2 text-xs font-medium text-indigo-500 dark:text-indigo-400">
                  <Zap size={14} className="animate-bounce-subtle" />
                  AI-Powered Suggestions
                </p>
                {suggestions.map((product) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={product.id}
                    onClick={() => handleSearch(product.name)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-indigo-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </>
            ) : (
              <div className="space-y-4">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <Clock size={14} />
                      Recent Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search) => (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <TrendingUp size={14} />
                    Trending Products
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {trendingProducts.map((product) => (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={product.id}
                        onClick={() => handleSearch(product.name)}
                        className="rounded-lg bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <img src={product.image} alt={product.name} className="mb-2 h-24 w-full rounded object-cover" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}