import React from 'react';
import { EnvironmentalAnalysis } from '@/types/environmental';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EcoButton } from '@/components/ui/eco-button';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Zap, 
  Droplets, 
  TreePine, 
  Recycle, 
  AlertTriangle, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Award
} from 'lucide-react';

interface AnalysisResultsProps {
  analysis: EnvironmentalAnalysis;
  onViewAlternatives: () => void;
  onExploreMore: () => void;
}

const IMPACT_ICONS = {
  carbon: Zap,
  water: Droplets,
  land: TreePine,
  biodiversity: Leaf,
  pollution: AlertTriangle,
  energy: Zap,
};

const SCORE_COLORS = {
  excellent: 'text-success',
  good: 'text-primary',
  moderate: 'text-warning',
  poor: 'text-warning',
  critical: 'text-destructive'
};

const SCORE_GRADIENTS = {
  excellent: 'from-green-500 to-emerald-500',
  good: 'from-emerald-500 to-teal-500',
  moderate: 'from-yellow-500 to-orange-500',
  poor: 'from-orange-500 to-red-500',
  critical: 'from-red-500 to-red-700'
};

export function AnalysisResults({ analysis, onViewAlternatives, onExploreMore }: AnalysisResultsProps) {
  const { carbonFootprint, sustainabilityScore, environmentalImpacts, ecoAlternatives, educationalInsights } = analysis;

  const topImpacts = environmentalImpacts
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);

  const bestAlternative = ecoAlternatives
    .sort((a, b) => b.impactReduction - a.impactReduction)[0];

  const getScoreIcon = () => {
    if (sustainabilityScore.score >= 80) return <Award className="h-5 w-5 text-success" />;
    if (sustainabilityScore.score >= 60) return <TrendingUp className="h-5 w-5 text-primary" />;
    return <TrendingDown className="h-5 w-5 text-warning" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Main Score Card */}
      <Card className="border-2 border-primary/20 shadow-eco bg-gradient-to-br from-background to-eco-light/30">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            {getScoreIcon()}
            Environmental Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sustainability Score */}
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 bg-gradient-to-r ${SCORE_GRADIENTS[sustainabilityScore.category]} bg-clip-text text-transparent`}>
              {sustainabilityScore.score}
            </div>
            <div className="text-lg text-muted-foreground mb-2">Sustainability Score</div>
            <Badge variant="secondary" className={`${SCORE_COLORS[sustainabilityScore.category]} capitalize`}>
              {sustainabilityScore.category} Impact
            </Badge>
            <Progress 
              value={sustainabilityScore.score} 
              className="w-full mt-4 h-3"
            />
          </div>

          {/* Carbon Footprint */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-muted">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  {carbonFootprint.amount} {carbonFootprint.unit}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {carbonFootprint.comparison}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-muted">
              <CardContent className="p-4 text-center">
                <Recycle className="h-8 w-8 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-success">
                  {bestAlternative?.impactReduction || 0}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Potential Reduction Available
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Environmental Impact Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {topImpacts.map((impact, index) => {
              const Icon = IMPACT_ICONS[impact.category] || Leaf;
              return (
                <motion.div
                  key={impact.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium capitalize">{impact.category} Impact</h3>
                      <Badge variant="outline" className="text-xs">
                        Severity: {impact.severity}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{impact.description}</p>
                    <div className="mt-2">
                      <Progress value={impact.severity * 10} className="h-2" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Educational Insights */}
      <Card className="bg-gradient-sky border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Environmental Science Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{educationalInsights}</p>
        </CardContent>
      </Card>

      {/* Top Alternatives Preview */}
      {ecoAlternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-success" />
                Sustainable Alternatives
              </div>
              <EcoButton variant="outline" size="sm" onClick={onViewAlternatives}>
                View All <ChevronRight className="h-4 w-4" />
              </EcoButton>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {ecoAlternatives.slice(0, 2).map((alternative, index) => (
                <motion.div
                  key={alternative.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-success/20 bg-success/5 hover:bg-success/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-foreground">{alternative.name}</h3>
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      -{alternative.impactReduction}% impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alternative.description}</p>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline">
                      Accessibility: {alternative.accessibility}
                    </Badge>
                    <Badge variant="outline">
                      {alternative.costComparison}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <EcoButton variant="eco" size="lg" onClick={onViewAlternatives}>
          <Recycle className="h-5 w-5" />
          Explore Alternatives
        </EcoButton>
        <EcoButton variant="earth" size="lg" onClick={onExploreMore}>
          <Leaf className="h-5 w-5" />
          Continue Analysis
        </EcoButton>
      </div>
    </motion.div>
  );
}