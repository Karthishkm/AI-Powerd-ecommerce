import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatPrice } from '../lib/utils';
import { useStore } from '../store/useStore';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  features: string[];
}

export function ProductCard({ id, name, price, image, category, description, rating, reviews, features }: ProductCardProps) {
  const { addToCart, addToWishlist, wishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = wishlist.some((item) => item.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/90 hover:dark:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <motion.img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 p-4"
          >
            <div className="flex h-full flex-col justify-end text-white">
              <p className="text-sm font-medium">{description}</p>
              <ul className="mt-2 space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="text-xs">• {feature}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{category}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">({reviews})</p>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatPrice(price)}
          </p>
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart({ id, name, price, image, category })}
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToWishlist({ id, name, price, image, category })}
          className={cn(
            "rounded-full p-2 transition-colors",
            isWishlisted
              ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800/50"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
          )}
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </motion.button>
      </div>
    </motion.div>
  );
}