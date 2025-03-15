import Fuse from 'fuse.js';
import { products } from '../data/products';

// Enhanced Fuse.js configuration for better search results
const fuse = new Fuse(products, {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'category', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'keywords', weight: 2.5 },
    { name: 'searchableText', weight: 2 }
  ],
  includeScore: true,
  threshold: 0.4, // Slightly more lenient threshold
  minMatchCharLength: 2,
  shouldSort: true,
  distance: 100,
  useExtendedSearch: true
});

export const searchProducts = (query: string) => {
  if (!query) return [];
  
  // Split query into words for better matching
  const words = query.toLowerCase().split(' ').filter(word => word.length > 1);
  
  // Search with Fuse.js
  const results = fuse.search({
    $or: [
      { name: query },
      { keywords: query },
      { searchableText: query },
      // Search for each word individually
      ...words.map(word => ({
        $or: [
          { name: word },
          { keywords: word },
          { searchableText: word }
        ]
      }))
    ]
  });

  // Remove duplicates and sort by score
  const uniqueResults = Array.from(
    new Map(results.map(item => [item.item.id, item.item])).values()
  );

  return uniqueResults;
};

export const getRecommendations = (category: string, priceRange: [number, number]) => {
  // Filter products by category and price range
  const categoryProducts = products.filter(product => 
    product.category === category && 
    product.price >= priceRange[0] && 
    product.price <= priceRange[1]
  );

  // Sort by rating and number of reviews
  return categoryProducts
    .sort((a, b) => {
      const scoreA = a.rating * Math.log10(a.reviews + 1);
      const scoreB = b.rating * Math.log10(b.reviews + 1);
      return scoreB - scoreA;
    })
    .slice(0, 5);
};

export const getTrendingProducts = () => {
  // Get products with high ratings and reviews
  return products
    .sort((a, b) => {
      const scoreA = a.rating * Math.log10(a.reviews + 1);
      const scoreB = b.rating * Math.log10(b.reviews + 1);
      return scoreB - scoreA;
    })
    .slice(0, 6);
};

// New function for personalized recommendations
export const getPersonalizedRecommendations = (
  userPreferences: {
    categories: string[];
    priceRange: [number, number];
    recentSearches: string[];
  }
) => {
  const { categories, priceRange, recentSearches } = userPreferences;
  
  // Score each product based on user preferences
  const scoredProducts = products.map(product => {
    let score = 0;
    
    // Category match
    if (categories.includes(product.category)) {
      score += 2;
    }
    
    // Price range match
    if (product.price >= priceRange[0] && product.price <= priceRange[1]) {
      score += 1;
    }
    
    // Recent searches match
    const searchMatchScore = recentSearches.reduce((acc, search) => {
      if (product.searchableText.includes(search.toLowerCase())) {
        return acc + 1;
      }
      return acc;
    }, 0);
    score += searchMatchScore;
    
    return { product, score };
  });
  
  // Sort by score and return top results
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
    .slice(0, 10);
};