import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Share2, RotateCcw } from 'lucide-react';
import { SessionSummary } from '@/components/dashboard/SessionSummary';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionTracker } from '@/hooks/useSessionTracker';
import { ReportExporter } from '@/utils/reportExporter';

export default function SessionOverview() {
  const navigate = useNavigate();
  const { session, addAnalysis, getSessionSummary, resetSession, hasAnalyses } = useSessionTracker();
  const [isExporting, setIsExporting] = useState(false);

  const summary = getSessionSummary();

  const handleExport = async (format: 'pdf' | 'json' | 'csv') => {
    setIsExporting(true);
    try {
      switch (format) {
        case 'pdf':
          ReportExporter.exportAsPDF(session);
          break;
        case 'json':
          ReportExporter.exportAsJSON(session);
          break;
        case 'csv':
          ReportExporter.exportAsCSV(session);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleNewSession = () => {
    resetSession();
    navigate('/');
  };

  const handleShare = () => {
    if (navigator.share && summary) {
      navigator.share({
        title: 'My EcoSense AI Environmental Report',
        text: `I analyzed ${summary.totalAnalyses} environmental impacts with an average sustainability score of ${summary.averageSustainabilityScore}! 🌍`,
        url: window.location.origin
      });
    }
  };

  if (!hasAnalyses) {
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
              Current Session Overview
            </h1>
            <p className="text-muted-foreground">
              Review your environmental impact analysis from this session
            </p>
            </div>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-br from-background to-eco-light/30">
              <CardContent className="p-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-eco rounded-full flex items-center justify-center shadow-glow">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Start Your Environmental Journey</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  No analyses yet! Upload photos or describe activities to begin tracking 
                  your environmental impact and discover sustainable alternatives.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <EcoButton 
                    variant="eco" 
                    size="lg"
                    onClick={() => navigate('/photo-analyzer')}
                  >
                    Analyze Photo
                  </EcoButton>
                  <EcoButton 
                    variant="earth" 
                    size="lg"
                    onClick={() => navigate('/activity-scanner')}
                  >
                    Scan Activity
                  </EcoButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sky">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <EcoButton
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </EcoButton>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-eco bg-clip-text text-transparent">
                Current Session Overview
              </h1>
              <p className="text-muted-foreground">
                Review your environmental impact analysis from this session
              </p>
            </div>
          </div>

          {/* Export Options */}
          <div className="hidden md:flex gap-2">
            <EcoButton
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              PDF Report
            </EcoButton>
            <EcoButton
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              <FileText className="h-4 w-4" />
              CSV Data
            </EcoButton>
            {navigator.share && (
              <EcoButton
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </EcoButton>
            )}
          </div>
        </motion.div>

        {/* Session Summary */}
        {summary && (
          <SessionSummary
            summary={summary}
            onExport={() => handleExport('pdf')}
            onNewSession={handleNewSession}
            onShare={navigator.share ? handleShare : undefined}
          />
        )}

        {/* Mobile Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <EcoButton
                  variant="eco"
                  size="lg"
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="w-full"
                >
                  <Download className="h-5 w-5" />
                  Download PDF Report
                </EcoButton>
                <EcoButton
                  variant="earth"
                  size="lg"
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="w-full"
                >
                  <FileText className="h-5 w-5" />
                  Export CSV Data
                </EcoButton>
                {navigator.share && (
                  <EcoButton
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="w-full"
                  >
                    <Share2 className="h-5 w-5" />
                    Share Progress
                  </EcoButton>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}