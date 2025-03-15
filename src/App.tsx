import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Moon, Sun, ShoppingCart, Settings } from 'lucide-react';
import { useStore } from './store/useStore';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { products, categories } from './data/products';
import { useState } from 'react';

function App() {
  const { darkMode, toggleDarkMode, cart, searchResults } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const displayProducts = searchResults.length > 0 ? searchResults : products;
  
  const filteredProducts = displayProducts
    .filter((product) =>
      selectedCategory === 'All' ? true : product.category === selectedCategory
    )
    .sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                AI Store
              </h1>
              <div className="flex items-center gap-6">
                <SearchBar />
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setShowCart(true)}
                  className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
                  <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <button
                        onClick={toggleDarkMode}
                        className="rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                      >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="mt-6 w-full rounded-full bg-indigo-600 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Cart Modal */}
          <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-8">
            {/* Filters */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 dark:bg-indigo-500'
                        : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;