import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Clock, 
  Users, 
  Leaf, 
  Search,
  BookOpen,
  Apple,
  Utensils,
  Timer,
  Lightbulb
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  wasteReduction: string[];
  category: string;
  image?: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Vegetable Scraps Broth',
    description: 'Transform vegetable peels and scraps into a flavorful, nutritious broth',
    ingredients: [
      'Onion peels and ends',
      'Carrot peels and tops',
      'Celery leaves and ends',
      'Herb stems',
      'Mushroom stems',
      'Garlic skins',
      'Water',
      'Salt and pepper'
    ],
    instructions: [
      'Collect vegetable scraps in a large pot',
      'Add enough water to cover scraps by 2 inches',
      'Bring to a boil, then simmer for 45 minutes',
      'Strain the broth and season with salt and pepper',
      'Store in refrigerator for up to 5 days or freeze'
    ],
    cookTime: 45,
    servings: 8,
    difficulty: 'Easy',
    wasteReduction: ['Uses vegetable scraps', 'Reduces food waste by 80%', 'Creates nutrient-rich base'],
    category: 'Broth & Stocks'
  },
  {
    id: '2',
    title: 'Bread Heel French Toast',
    description: 'Give bread ends new life with this delicious breakfast',
    ingredients: [
      'Bread heels/ends (4-6 pieces)',
      'Eggs (2 large)',
      'Milk (1/4 cup)',
      'Vanilla extract (1 tsp)',
      'Cinnamon (1/2 tsp)',
      'Butter for cooking',
      'Maple syrup to serve'
    ],
    instructions: [
      'Whisk eggs, milk, vanilla, and cinnamon in a shallow bowl',
      'Dip bread heels in mixture, coating both sides',
      'Heat butter in a skillet over medium heat',
      'Cook bread 2-3 minutes per side until golden',
      'Serve hot with maple syrup'
    ],
    cookTime: 15,
    servings: 2,
    difficulty: 'Easy',
    wasteReduction: ['Uses bread ends', 'Prevents bread waste', 'Creates gourmet breakfast'],
    category: 'Breakfast'
  },
  {
    id: '3',
    title: 'Overripe Banana Bread',
    description: 'Perfect way to use spotted bananas that are past their prime',
    ingredients: [
      'Overripe bananas (3-4 large)',
      'All-purpose flour (1.5 cups)',
      'Sugar (3/4 cup)',
      'Butter (1/3 cup, melted)',
      'Egg (1 large)',
      'Vanilla (1 tsp)',
      'Baking soda (1 tsp)',
      'Salt (pinch)'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C)',
      'Mash bananas in a large bowl',
      'Mix in melted butter, sugar, egg, and vanilla',
      'Add flour, baking soda, and salt',
      'Pour into greased loaf pan',
      'Bake 60-65 minutes until golden'
    ],
    cookTime: 65,
    servings: 8,
    difficulty: 'Easy',
    wasteReduction: ['Uses overripe bananas', 'Extends fruit lifespan', 'Reduces kitchen waste'],
    category: 'Baking'
  },
  {
    id: '4',
    title: 'Leftover Rice Fried Rice',
    description: 'Transform day-old rice into a delicious new meal',
    ingredients: [
      'Day-old cooked rice (2 cups)',
      'Mixed vegetables (1 cup)',
      'Eggs (2 large)',
      'Soy sauce (2 tbsp)',
      'Sesame oil (1 tsp)',
      'Garlic (2 cloves)',
      'Green onions (2 stalks)',
      'Oil for cooking'
    ],
    instructions: [
      'Heat oil in a large pan or wok',
      'Scramble eggs and set aside',
      'Sauté garlic and vegetables',
      'Add rice, breaking up clumps',
      'Stir in soy sauce and sesame oil',
      'Add eggs back in and mix',
      'Garnish with green onions'
    ],
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    wasteReduction: ['Uses leftover rice', 'Incorporates aging vegetables', 'Creates complete meal'],
    category: 'Main Dishes'
  }
];

const FOOD_WASTE_TIPS = [
  {
    icon: Apple,
    title: 'Smart Storage',
    tips: [
      'Store fruits and vegetables properly',
      'Keep herbs in water like flowers',
      'Freeze items before they spoil'
    ]
  },
  {
    icon: ChefHat,
    title: 'Creative Cooking',
    tips: [
      'Use vegetable scraps for broth',
      'Turn stale bread into croutons',
      'Blend overripe fruits into smoothies'
    ]
  },
  {
    icon: Clock,
    title: 'Meal Planning',
    tips: [
      'Plan meals around what you have',
      'Cook in batches and freeze portions',
      'Track expiration dates'
    ]
  }
];

export default function FoodWasteReducer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Breakfast', 'Main Dishes', 'Broth & Stocks', 'Baking'];

  const filteredRecipes = SAMPLE_RECIPES.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Food Waste Reducer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform food scraps and leftovers into delicious meals. Discover recipes that reduce waste and save money while creating amazing dishes.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search recipes or ingredients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <EcoButton
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? 
                        "bg-gradient-to-r from-green-500 to-yellow-500" : ""
                      }
                    >
                      {category}
                    </EcoButton>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recipes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-green-800">{recipe.title}</CardTitle>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{recipe.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Timer className="h-4 w-4" />
                      {recipe.cookTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings} servings
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Key Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {ingredient.split('(')[0].trim()}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.ingredients.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-green-500" />
                      Waste Reduction:
                    </h4>
                    <ul className="space-y-1">
                      {recipe.wasteReduction.map((benefit, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <EcoButton 
                    className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600"
                    size="sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Recipe
                  </EcoButton>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Food Waste Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-600 to-yellow-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lightbulb className="h-6 w-6" />
                Food Waste Reduction Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {FOOD_WASTE_TIPS.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5" />
                      <h4 className="font-semibold text-lg">{section.title}</h4>
                    </div>
                    <ul className="space-y-2 text-green-100">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
