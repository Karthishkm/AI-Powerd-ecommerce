import { faker } from '@faker-js/faker';

// Predefined image URLs for each category to ensure they exist
const categoryImages = {
  Electronics: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12'
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f'
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    'https://images.unsplash.com/photo-1608042314453-ae338d80c427',
    'https://images.unsplash.com/photo-1626497764746-6dc36546b388',
    'https://images.unsplash.com/photo-1611923134239-b9be5816e23c'
  ],
  'Home Decor': [
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126',
    'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'
  ],
  Sports: [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b',
    'https://images.unsplash.com/photo-1526676338756-d708c015c91f'
  ],
  Beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348'
  ]
};

// Enhanced keywords for better search
const categoryKeywords = {
  Electronics: ['gadget', 'tech', 'digital', 'smart', 'wireless', 'electronic', 'device', 'power', 'battery', 'charger', 'screen', 'display'],
  Clothing: ['wear', 'fashion', 'apparel', 'dress', 'outfit', 'style', 'garment', 'cloth', 'textile', 'fabric', 'seasonal'],
  Accessories: ['add-on', 'complement', 'enhancement', 'addition', 'extra', 'supplementary', 'decorative', 'ornamental'],
  'Home Decor': ['interior', 'decoration', 'furnishing', 'ornament', 'household', 'domestic', 'living space', 'home improvement'],
  Sports: ['athletic', 'fitness', 'exercise', 'game', 'training', 'workout', 'sports gear', 'equipment', 'outdoor'],
  Beauty: ['cosmetic', 'makeup', 'skincare', 'grooming', 'personal care', 'beauty product', 'treatment', 'aesthetic']
};

let currentId = 1;

function getRandomImage(category: string): string {
  const images = categoryImages[category as keyof typeof categoryImages] || categoryImages.Electronics;
  const randomIndex = Math.floor(Math.random() * images.length);
  return `${images[randomIndex]}?auto=format&fit=crop&w=800&q=80`;
}

// Enhanced product generation with more detailed keywords
function generateProducts(count: number, category: string) {
  const categorySpecificKeywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
  
  return Array.from({ length: count }, () => {
    const name = faker.commerce.productName();
    const material = faker.commerce.productMaterial();
    const adjective = faker.commerce.productAdjective();
    const description = faker.commerce.productDescription();
    
    // Generate comprehensive keywords
    const baseKeywords = [
      category.toLowerCase(),
      name.toLowerCase(),
      adjective.toLowerCase(),
      material.toLowerCase()
    ];
    
    // Add category-specific keywords
    const specificKeywords = categorySpecificKeywords.map(keyword => 
      Math.random() > 0.5 ? `${adjective} ${keyword}` : keyword
    );
    
    // Add descriptive phrases
    const descriptiveKeywords = description
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5);
    
    // Combine all keywords and remove duplicates
    const allKeywords = [...new Set([
      ...baseKeywords,
      ...specificKeywords,
      ...descriptiveKeywords
    ])];

    return {
      id: currentId++,
      name,
      price: parseFloat(faker.commerce.price({ min: 10, max: 2000 })),
      category,
      image: getRandomImage(category),
      description,
      rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
      reviews: faker.number.int({ min: 5, max: 500 }),
      features: Array.from(
        { length: faker.number.int({ min: 3, max: 6 }) },
        () => `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}`
      ),
      keywords: allKeywords,
      searchableText: `${name} ${category} ${description} ${allKeywords.join(' ')}`.toLowerCase()
    };
  });
}

// Generate products for each category
const electronics = generateProducts(50, 'Electronics');
const clothing = generateProducts(40, 'Clothing');
const accessories = generateProducts(35, 'Accessories');
const homeDecor = generateProducts(30, 'Home Decor');
const sports = generateProducts(25, 'Sports');
const beauty = generateProducts(20, 'Beauty');

// Combine all products
const products = [
  ...electronics,
  ...clothing,
  ...accessories,
  ...homeDecor,
  ...sports,
  ...beauty,
];

const categories = ["All", "Electronics", "Clothing", "Accessories", "Home Decor", "Sports", "Beauty"];

const aiSuggestions = {
  // Electronics
  "phone": ["Smartphone Pro Max", "5G Mobile Device", "Foldable Phone"],
  "laptop": ["Gaming Laptop", "Ultrabook Pro", "Business Notebook"],
  "headphone": ["Noise Cancelling Headphones", "Wireless Earbuds", "Gaming Headset"],
  "camera": ["Mirrorless Camera", "Action Camera", "Security Camera"],
  "tv": ["OLED Smart TV", "Gaming Monitor", "4K Display"],
  "gaming": ["Gaming Console", "Gaming PC", "Gaming Accessories"],
  
  // Clothing
  "shirt": ["Casual Shirt", "Formal Shirt", "Designer T-Shirt"],
  "pants": ["Jeans", "Chinos", "Track Pants"],
  "jacket": ["Leather Jacket", "Denim Jacket", "Winter Coat"],
  "dress": ["Evening Dress", "Summer Dress", "Casual Dress"],
  "shoes": ["Running Shoes", "Formal Shoes", "Sneakers"],
  
  // Accessories
  "watch": ["Smart Watch", "Luxury Watch", "Fitness Tracker"],
  "bag": ["Laptop Bag", "Travel Backpack", "Designer Handbag"],
  "wallet": ["Leather Wallet", "Card Holder", "Smart Wallet"],
  "sunglasses": ["Designer Sunglasses", "Sports Sunglasses", "Premium Eyewear"],
  "jewelry": ["Gold Necklace", "Diamond Ring", "Silver Bracelet"],
  
  // Home Decor
  "furniture": ["Modern Sofa", "Dining Table", "Office Chair"],
  "lighting": ["Smart Lights", "Ceiling Lamp", "Table Lamp"],
  "decor": ["Wall Art", "Vase", "Mirror"],
  "kitchen": ["Coffee Maker", "Air Fryer", "Blender"],
  
  // Sports
  "fitness": ["Yoga Mat", "Dumbbells", "Exercise Bike"],
  "outdoor": ["Camping Tent", "Hiking Backpack", "Sports Equipment"],
  "sports": ["Basketball", "Tennis Racket", "Golf Clubs"],

  // Beauty
  "skincare": ["Face Cream", "Serum", "Moisturizer"],
  "makeup": ["Foundation", "Lipstick", "Eyeshadow"],
  "haircare": ["Shampoo", "Conditioner", "Hair Styling"]
};

const aiTrends = {
  "Electronics": [
    "Foldable Phones",
    "AI-Powered Gadgets",
    "Gaming Hardware",
    "Smart Home Tech",
    "Wireless Audio",
    "VR Equipment"
  ],
  "Clothing": [
    "Sustainable Fashion",
    "Athleisure Wear",
    "Designer Collaborations",
    "Vintage Revival",
    "Smart Clothing",
    "Eco-Friendly Materials"
  ],
  "Accessories": [
    "Smart Accessories",
    "Luxury Items",
    "Sustainable Materials",
    "Tech Integration",
    "Personalized Items",
    "Limited Editions"
  ],
  "Home Decor": [
    "Smart Furniture",
    "Minimalist Design",
    "Sustainable Decor",
    "Multi-functional Items",
    "Natural Materials",
    "Tech Integration"
  ],
  "Sports": [
    "Smart Equipment",
    "Home Fitness",
    "Outdoor Adventure",
    "Recovery Tools",
    "Performance Wear",
    "Virtual Training"
  ],
  "Beauty": [
    "Clean Beauty",
    "K-Beauty Trends",
    "Natural Ingredients",
    "Sustainable Packaging",
    "Personalized Skincare",
    "Beauty Tech"
  ]
};

const aiPersonalization = {
  "morning": [
    "Coffee Maker",
    "Fitness Equipment",
    "Breakfast Essentials",
    "Smart Watch",
    "Running Shoes",
    "Yoga Mat"
  ],
  "afternoon": [
    "Laptop Accessories",
    "Office Gadgets",
    "Productivity Tools",
    "Desk Organization",
    "Work Essentials",
    "Tech Upgrades"
  ],
  "evening": [
    "Gaming Gear",
    "Entertainment Systems",
    "Smart Lighting",
    "Comfort Wear",
    "Home Theater",
    "Relaxation Items"
  ],
  "weekend": [
    "Outdoor Equipment",
    "Travel Gear",
    "Sports Equipment",
    "Casual Wear",
    "Entertainment Devices",
    "Hobby Supplies"
  ],
  "seasonal": {
    "summer": [
      "Beach Essentials",
      "Outdoor Furniture",
      "Cooling Devices",
      "Summer Fashion",
      "Sports Equipment"
    ],
    "winter": [
      "Winter Wear",
      "Home Heating",
      "Indoor Activities",
      "Comfort Items",
      "Holiday Decor"
    ]
  }
};

const aiRecommendations = {
  "based_on_history": [
    "Similar items you might like",
    "Frequently bought together",
    "Recommended accessories",
    "Complete your collection",
    "Popular in your area"
  ],
  "price_range": {
    "budget": ["Best value", "Deals & Steals", "Budget-friendly alternatives"],
    "mid_range": ["Popular choices", "Best sellers", "Trending items"],
    "premium": ["Luxury options", "Premium selection", "Exclusive items"]
  },
  "user_preferences": {
    "tech_savvy": ["Latest gadgets", "Smart devices", "Tech accessories"],
    "fashion_forward": ["Designer items", "Latest trends", "Fashion essentials"],
    "eco_conscious": ["Sustainable products", "Eco-friendly options", "Ethical choices"],
    "fitness_enthusiast": ["Fitness gear", "Health products", "Sports equipment"],
    "beauty_lover": ["Skincare essentials", "Makeup must-haves", "Beauty tools"]
  }
};

export {
  products,
  categories,
  aiSuggestions,
  aiTrends,
  aiPersonalization,
  aiRecommendations
};