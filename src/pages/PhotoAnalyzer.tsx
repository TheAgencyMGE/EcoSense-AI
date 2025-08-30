import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { PhotoUploader } from '@/components/analysis/PhotoUploader';
import { AnalysisResults } from '@/components/analysis/AnalysisResults';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent } from '@/components/ui/card';
import { useSessionTracker } from '@/hooks/useSessionTracker';
import { environmentalAI } from '@/services/environmentalAI';
import { EnvironmentalAnalysis } from '@/types/environmental';

export default function PhotoAnalyzer() {
  const navigate = useNavigate();
  const { addAnalysis } = useSessionTracker();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EnvironmentalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await environmentalAI.analyzeImage(file);
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
            <h1 className="text-3xl font-bold bg-gradient-eco bg-clip-text text-transparent">
              AI Photo Analysis
            </h1>
            <p className="text-muted-foreground">
              Upload any image to analyze its environmental impact and discover sustainable alternatives
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
              key="uploader"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Instructions */}
              <Card className="border-primary/20 bg-gradient-to-r from-background to-eco-light/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold mb-2">How Photo Analysis Works</h2>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Upload photos of products, food, activities, or lifestyle choices</li>
                        <li>• Our AI analyzes environmental factors like carbon footprint, resource usage, and sustainability</li>
                        <li>• Get instant recommendations for eco-friendly alternatives and actionable steps</li>
                        <li>• Track your progress toward a more sustainable lifestyle</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photo Uploader */}
              <PhotoUploader
                onImageSelect={handleImageSelect}
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

              {/* Tips */}
              <Card className="border-muted">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 text-center">💡 Pro Tips for Better Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">📸 Best Photos Include:</h4>
                      <ul className="space-y-1">
                        <li>• Clear product labels and packaging</li>
                        <li>• Food items with ingredients visible</li>
                        <li>• Transportation methods</li>
                        <li>• Home appliances and electronics</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">🎯 Analysis Categories:</h4>
                      <ul className="space-y-1">
                        <li>• Carbon footprint calculation</li>
                        <li>• Water and energy usage</li>
                        <li>• Packaging sustainability</li>
                        <li>• Alternative recommendations</li>
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