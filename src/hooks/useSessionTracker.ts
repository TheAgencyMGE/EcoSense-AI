import { useState, useCallback, useEffect } from 'react';
import { EnvironmentalAnalysis, SessionTracker, Achievement } from '@/types/environmental';

export function useSessionTracker() {
  const [session, setSession] = useState<SessionTracker>(() => ({
    sessionId: Date.now().toString(36),
    startTime: new Date().toISOString(),
    analyses: [],
    totalImpactReduction: 0,
    achievements: [],
    overallScore: 0
  }));

  const addAnalysis = useCallback((analysis: EnvironmentalAnalysis) => {
    setSession(prev => {
      const newAnalyses = [...prev.analyses, analysis];
      const totalScore = newAnalyses.reduce((sum, a) => sum + a.sustainabilityScore.score, 0);
      const averageScore = totalScore / newAnalyses.length;
      
      const totalReduction = newAnalyses.reduce((sum, a) => {
        const bestAlternative = a.ecoAlternatives.reduce((best, alt) => 
          alt.impactReduction > best.impactReduction ? alt : best, 
          { impactReduction: 0 }
        );
        return sum + bestAlternative.impactReduction;
      }, 0);

      const newAchievements = checkForAchievements(newAnalyses, prev.achievements);

      return {
        ...prev,
        analyses: newAnalyses,
        totalImpactReduction: totalReduction,
        achievements: [...prev.achievements, ...newAchievements],
        overallScore: averageScore
      };
    });
  }, []);

  const checkForAchievements = (analyses: EnvironmentalAnalysis[], currentAchievements: Achievement[]): Achievement[] => {
    const newAchievements: Achievement[] = [];
    const achievementIds = currentAchievements.map(a => a.id);

    // First Analysis
    if (analyses.length === 1 && !achievementIds.includes('first_analysis')) {
      newAchievements.push({
        id: 'first_analysis',
        title: 'Eco Explorer',
        description: 'Completed your first environmental analysis!',
        type: 'analysis_count',
        unlockedAt: new Date().toISOString(),
        icon: '🌱'
      });
    }

    // Fifth Analysis
    if (analyses.length === 5 && !achievementIds.includes('fifth_analysis')) {
      newAchievements.push({
        id: 'fifth_analysis',
        title: 'Sustainability Enthusiast',
        description: 'Analyzed 5 environmental impacts!',
        type: 'analysis_count',
        unlockedAt: new Date().toISOString(),
        icon: '🌿'
      });
    }

    // High Sustainability Score
    const hasHighScore = analyses.some(a => a.sustainabilityScore.score >= 80);
    if (hasHighScore && !achievementIds.includes('high_score')) {
      newAchievements.push({
        id: 'high_score',
        title: 'Green Champion',
        description: 'Achieved 80+ sustainability score!',
        type: 'sustainability_improvement',
        unlockedAt: new Date().toISOString(),
        icon: '🏆'
      });
    }

    // Found Great Alternative
    const hasGreatAlternative = analyses.some(a => 
      a.ecoAlternatives.some(alt => alt.impactReduction >= 50)
    );
    if (hasGreatAlternative && !achievementIds.includes('great_alternative')) {
      newAchievements.push({
        id: 'great_alternative',
        title: 'Impact Reducer',
        description: 'Found an alternative with 50%+ impact reduction!',
        type: 'alternatives_found',
        unlockedAt: new Date().toISOString(),
        icon: '♻️'
      });
    }

    return newAchievements;
  };

  const getSessionSummary = useCallback(() => {
    const { analyses } = session;
    if (analyses.length === 0) return null;

    const totalScore = analyses.reduce((sum, a) => sum + a.sustainabilityScore.score, 0);
    const averageScore = totalScore / analyses.length;
    
    const totalCarbon = analyses.reduce((sum, a) => sum + a.carbonFootprint.amount, 0);
    
    const categoryCount = analyses.reduce((acc, a) => {
      a.environmentalImpacts.forEach(impact => {
        acc[impact.category] = (acc[impact.category] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    return {
      totalAnalyses: analyses.length,
      averageSustainabilityScore: Math.round(averageScore),
      totalCarbonImpact: Math.round(totalCarbon * 100) / 100,
      potentialReduction: Math.round(session.totalImpactReduction),
      topCategories,
      achievements: session.achievements.length,
      sessionDuration: Math.round((Date.now() - new Date(session.startTime).getTime()) / 1000 / 60) // minutes
    };
  }, [session]);

  const resetSession = useCallback(() => {
    setSession({
      sessionId: Date.now().toString(36),
      startTime: new Date().toISOString(),
      analyses: [],
      totalImpactReduction: 0,
      achievements: [],
      overallScore: 0
    });
  }, []);

  return {
    session,
    addAnalysis,
    getSessionSummary,
    resetSession,
    hasAnalyses: session.analyses.length > 0
  };
}