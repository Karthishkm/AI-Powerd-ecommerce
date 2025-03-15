import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price * 83); // Converting USD to INR (approximate rate)
}

export function getAIRecommendations(category: string, priceRange: number): string[] {
  const recommendations = [
    'Based on your browsing history',
    'Customers also bought',
    'Trending in this category',
    'Recommended for you',
    'Best sellers'
  ];
  return recommendations;
}