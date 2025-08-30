import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { ActivityInput } from '@/components/analysis/ActivityInput';
import { AnalysisResults } from '@/components/analysis/AnalysisResults';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent } from '@/components/ui/card';
import { useSessionTracker } from '@/hooks/useSessionTracker';
import { environmentalAI } from '@/services/environmentalAI';
import { EnvironmentalAnalysis } from '@/types/environmental';

export default function ActivityScanner() {
  const navigate = useNavigate();
  const { addAnalysis } = useSessionTracker();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EnvironmentalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (activity: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await environmentalAI.analyzeActivity(activity);
      setCurrentAnalysis(analysis);
      addAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewAlternatives = () => {
    if (currentAnalysis) {
      navigate('/recommendations', { 
        state: { 
          analysis: currentAnalysis,
          alternatives: currentAnalysis.ecoAlternatives 
        } 
      });
    }
  };

  const handleExploreMore = () => {
    setCurrentAnalysis(null);
    setError(null);
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
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </EcoButton>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-earth bg-clip-text text-transparent">
              Activity & Lifestyle Scanner
            </h1>
            <p className="text-muted-foreground">
              Describe any activity, product, or lifestyle choice to analyze its environmental impact
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentAnalysis ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AnalysisResults
                analysis={currentAnalysis}
                onViewAlternatives={handleViewAlternatives}
                onExploreMore={handleExploreMore}
              />
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Instructions */}
              <Card className="border-primary/20 bg-gradient-to-r from-background to-eco-light/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Search className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold mb-2">How Activity Analysis Works</h2>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Describe any activity, product purchase, or lifestyle choice in detail</li>
                        <li>• Our AI calculates environmental impacts including carbon footprint and resource usage</li>
                        <li>• Discover sustainable alternatives with quantified environmental benefits</li>
                        <li>• Get personalized action steps to reduce your environmental impact</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Input */}
              <ActivityInput
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                disabled={isAnalyzing}
              />

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-destructive font-medium mb-2">Analysis Error</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                        <EcoButton
                          variant="outline"
                          size="sm"
                          onClick={() => setError(null)}
                          className="mt-3"
                        >
                          Try Again
                        </EcoButton>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Examples */}
              <Card className="border-muted">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-center">💡 Example Activities to Analyze</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-success mb-2">🚗 Transportation</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>"Daily 25km commute by SUV"</li>
                        <li>"Weekend flight from NYC to Miami"</li>
                        <li>"Using public bus vs. driving"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-2">🍽️ Food & Diet</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>"Eating beef 3 times per week"</li>
                        <li>"Ordering takeout delivery daily"</li>
                        <li>"Buying organic vs conventional"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-warning mb-2">🏠 Home & Energy</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>"Running AC 8 hours daily"</li>
                        <li>"Using gas vs electric heating"</li>
                        <li>"LED vs incandescent bulbs"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-accent mb-2">🛍️ Shopping</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>"Fast fashion clothing haul"</li>
                        <li>"Amazon Prime weekly orders"</li>
                        <li>"Buying new vs used electronics"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-eco-dark mb-2">♻️ Lifestyle</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>"Using plastic water bottles"</li>
                        <li>"Throwing away food waste"</li>
                        <li>"Paper vs digital receipts"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-2">💻 Digital</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>"Streaming Netflix 4 hours daily"</li>
                        <li>"Video calls vs in-person meetings"</li>
                        <li>"Cloud storage usage"</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}