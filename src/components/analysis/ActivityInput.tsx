import React, { useState } from 'react';
import { Search, Lightbulb } from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ActivityInputProps {
  onAnalyze: (activity: string) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

const SUGGESTED_ACTIVITIES = [
  "Daily commute by car (30 km)",
  "Online shopping order from Amazon",
  "Eating beef burger for lunch", 
  "Using air conditioning for 8 hours",
  "Fast fashion clothing purchase",
  "Throwing away food waste",
  "Using single-use plastic water bottles",
  "International flight for vacation",
  "Streaming video for 3 hours",
  "Electric vehicle charging"
];

const ACTIVITY_CATEGORIES = [
  { title: "Transportation", icon: "🚗", examples: ["Car trip", "Flight", "Public transport", "Bike ride"] },
  { title: "Food & Dining", icon: "🍽️", examples: ["Meat consumption", "Food delivery", "Restaurant meal", "Grocery shopping"] },
  { title: "Energy Usage", icon: "⚡", examples: ["Home heating", "Air conditioning", "Electronics usage", "Lighting"] },
  { title: "Consumption", icon: "🛍️", examples: ["Online shopping", "Clothing purchase", "Electronics", "Home goods"] }
];

export function ActivityInput({ onAnalyze, isAnalyzing, disabled }: ActivityInputProps) {
  const [activity, setActivity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity.trim() && !isAnalyzing) {
      onAnalyze(activity.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setActivity(suggestion);
  };

  const isValid = activity.trim().length > 5;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20 shadow-eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center">
            <Lightbulb className="h-5 w-5 text-primary" />
            Describe Your Activity or Product
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Describe the activity, product, or lifestyle choice you want to analyze for environmental impact..."
              className="min-h-[120px] resize-none border-primary/20 focus:border-primary/40 focus:ring-primary/20"
              disabled={disabled || isAnalyzing}
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Be specific for better analysis</span>
              <span className={activity.length > 200 ? 'text-warning' : ''}>
                {activity.length}/500
              </span>
            </div>

            <EcoButton
              type="submit"
              variant="eco"
              size="lg"
              disabled={!isValid || disabled || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing Environmental Impact...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Analyze Environmental Impact
                </>
              )}
            </EcoButton>
          </form>
        </CardContent>
      </Card>

      {/* Activity Categories */}
      <Card className="border border-muted">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Quick Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {ACTIVITY_CATEGORIES.map((category) => (
              <motion.div
                key={category.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-eco hover:border-primary/30 ${
                    selectedCategory === category.title ? 'border-primary bg-eco-light' : ''
                  }`}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.title ? null : category.title
                  )}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-sm font-medium">{category.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-muted"
            >
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_CATEGORIES.find(c => c.title === selectedCategory)?.examples.map((example) => (
                  <Badge
                    key={example}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/20 hover:border-primary/30"
                    onClick={() => handleSuggestionClick(`${example} - `)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Activities */}
      <Card className="border border-muted">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Popular Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_ACTIVITIES.slice(0, 6).map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-eco-light hover:border-primary/50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}