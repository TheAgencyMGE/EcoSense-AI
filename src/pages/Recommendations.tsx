
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Recycle, Star, ShoppingCart, MapPin, TrendingUp, Lightbulb } from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnvironmentalAnalysis, EcoAlternative, ActionableStep } from '@/types/environmental';

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAlternative, setSelectedAlternative] = useState<EcoAlternative | null>(null);

  // Get analysis data from navigation state or provide defaults
  const analysis = location.state?.analysis as EnvironmentalAnalysis;
  const alternatives = location.state?.alternatives as EcoAlternative[] || [];

  // Default alternatives if none provided
  const defaultAlternatives: EcoAlternative[] = [
    {
      name: "Solar-Powered Alternative",
      description: "Harness renewable solar energy for sustainable power generation with minimal environmental impact.",
      impactReduction: 85,
      accessibility: "medium",
      costComparison: "Higher upfront, 60% savings long-term",
      availabilityScore: 8,
      environmentalBenefit: "Reduces carbon emissions by 85% and eliminates fossil fuel dependency"
    },
    {
      name: "Recycled Material Option",
      description: "Choose products made from 90% recycled materials, supporting circular economy principles.",
      impactReduction: 65,
      accessibility: "high",
      costComparison: "20% cost savings with same quality",
      availabilityScore: 9,
      environmentalBenefit: "Diverts waste from landfills and reduces raw material extraction"
    },
    {
      name: "Local Sustainable Source",
      description: "Source from local producers within 50km radius to minimize transportation emissions.",
      impactReduction: 45,
      accessibility: "high",
      costComparison: "Comparable pricing with fresher quality",
      availabilityScore: 7,
      environmentalBenefit: "Reduces transportation emissions and supports local economy"
    }
  ];

  const displayAlternatives = alternatives.length > 0 ? alternatives : defaultAlternatives;

  const defaultActionSteps: ActionableStep[] = [
    {
      step: "Switch to renewable energy provider",
      impact: "Reduce household carbon footprint by 40%",
      difficulty: "easy",
      timeframe: "immediate",
      resources: ["Local utility comparison tools", "Green energy provider directory"]
    },
    {
      step: "Implement weekly meal planning",
      impact: "Reduce food waste by 30%",
      difficulty: "medium",
      timeframe: "short-term",
      resources: ["Meal planning apps", "Zero-waste cooking guides"]
    },
    {
      step: "Create home composting system",
      impact: "Divert 25% of household waste from landfills",
      difficulty: "medium",
      timeframe: "short-term",
      resources: ["Composting guides", "Local composting workshops"]
    }
  ];

  const actionSteps = analysis?.actionableSteps || defaultActionSteps;

  const getAccessibilityColor = (accessibility: string) => {
    switch (accessibility) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <EcoButton
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </EcoButton>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              Sustainable Recommendations
            </h1>
            <p className="text-muted-foreground">
              Discover eco-friendly alternatives and actionable steps for positive environmental impact
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="alternatives" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alternatives" className="flex items-center gap-2">
              <Recycle className="h-4 w-4" />
              Eco Alternatives
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Action Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alternatives" className="space-y-6">
            {/* Summary Card */}
            {analysis && (
              <Card className="border-primary/20 bg-gradient-to-r from-background to-success/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Current Analysis</h3>
                      <p className="text-muted-foreground">{analysis.inputDescription}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">
                        {Math.max(...displayAlternatives.map(a => a.impactReduction))}%
                      </div>
                      <div className="text-sm text-muted-foreground">Max Reduction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternatives Grid */}
            <div className="grid gap-6">
              <AnimatePresence>
                {displayAlternatives.map((alternative, index) => (
                  <motion.div
                    key={alternative.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-success/20 hover:shadow-eco transition-all duration-300 cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-success rounded-full flex items-center justify-center">
                              <Recycle className="h-5 w-5 text-white" />
                            </div>
                            <span>{alternative.name}</span>
                          </div>
                          <Badge variant="secondary" className="bg-success/20 text-success">
                            -{alternative.impactReduction}% impact
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          {alternative.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Impact Reduction</span>
                            <span className="text-sm text-success font-bold">
                              {alternative.impactReduction}%
                            </span>
                          </div>
                          <Progress value={alternative.impactReduction} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Accessibility: </span>
                            <span className={`capitalize ${getAccessibilityColor(alternative.accessibility)}`}>
                              {alternative.accessibility}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Availability: </span>
                            <span className="text-primary">{alternative.availabilityScore}/10</span>
                          </div>
                        </div>

                        <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                          <div className="text-sm font-medium text-success mb-1">Environmental Benefit</div>
                          <div className="text-sm text-muted-foreground">
                            {alternative.environmentalBenefit}
                          </div>
                        </div>

                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium mb-1">Cost Comparison</div>
                          <div className="text-sm text-muted-foreground">
                            {alternative.costComparison}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <EcoButton variant="eco" size="sm" className="flex-1">
                            <ShoppingCart className="h-4 w-4" />
                            Find Local Options
                          </EcoButton>
                          <EcoButton variant="outline" size="sm">
                            <MapPin className="h-4 w-4" />
                            Locate
                          </EcoButton>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="grid gap-4">
              {actionSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-primary/20 hover:shadow-eco transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{step.step}</h3>
                          <p className="text-muted-foreground mb-3">{step.impact}</p>
                          
                          <div className="flex gap-4 mb-3">
                            <Badge variant="outline" className={getDifficultyColor(step.difficulty)}>
                              {step.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {step.timeframe}
                            </Badge>
                          </div>

                          {step.resources && step.resources.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-1">Helpful Resources:</div>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {step.resources.map((resource, idx) => (
                                  <li key={idx}>• {resource}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <EcoButton variant="eco" size="lg" onClick={() => navigate('/dashboard')}>
            <Star className="h-5 w-5" />
            View Full Dashboard
          </EcoButton>
        </motion.div>
      </div>
    </div>
  );
}
