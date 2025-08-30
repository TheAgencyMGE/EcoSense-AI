import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/types/environmental';
import { Trophy, Award, Target, Recycle, Sparkles } from 'lucide-react';

interface AchievementsDisplayProps {
  achievements: Achievement[];
  totalAnalyses: number;
  averageScore: number;
}

const ACHIEVEMENT_ICONS = {
  analysis_count: Trophy,
  impact_reduction: Target,
  alternatives_found: Recycle,
  sustainability_improvement: Award
};

const MILESTONE_ACHIEVEMENTS = [
  {
    id: 'eco_warrior',
    title: 'Eco Warrior',
    description: 'Complete 10 environmental analyses',
    requiredAnalyses: 10,
    icon: '🌟',
    color: 'text-yellow-600'
  },
  {
    id: 'sustainability_master',
    title: 'Sustainability Master',
    description: 'Maintain 80+ average score',
    requiredScore: 80,
    icon: '🏆',
    color: 'text-amber-600'
  },
  {
    id: 'carbon_reducer',
    title: 'Carbon Reducer',
    description: 'Find alternatives with 100%+ total reduction',
    requiredReduction: 100,
    icon: '♻️',
    color: 'text-green-600'
  }
];

export function AchievementsDisplay({ achievements, totalAnalyses, averageScore }: AchievementsDisplayProps) {
  const getProgressToNext = () => {
    const nextMilestones = [];
    
    // Analysis count milestone
    const nextAnalysisGoal = Math.ceil(totalAnalyses / 5) * 5 + 5;
    if (nextAnalysisGoal <= 50) {
      nextMilestones.push({
        title: `${nextAnalysisGoal} Analyses`,
        current: totalAnalyses,
        target: nextAnalysisGoal,
        progress: (totalAnalyses / nextAnalysisGoal) * 100,
        type: 'analyses'
      });
    }

    // Score improvement
    if (averageScore < 90) {
      const nextScoreGoal = Math.ceil(averageScore / 10) * 10;
      nextMilestones.push({
        title: `${nextScoreGoal}% Avg Score`,
        current: averageScore,
        target: nextScoreGoal,
        progress: (averageScore / nextScoreGoal) * 100,
        type: 'score'
      });
    }

    return nextMilestones;
  };

  const getRecentAchievements = () => {
    return achievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, 6);
  };

  const progressMilestones = getProgressToNext();
  const recentAchievements = getRecentAchievements();

  return (
    <div className="space-y-6">
      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-r from-background to-eco-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <AnimatePresence>
                {recentAchievements.map((achievement, index) => {
                  const Icon = ACHIEVEMENT_ICONS[achievement.type] || Award;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="h-full border-success/20 bg-success/5 hover:bg-success/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2 group-hover:animate-bounce">
                            {achievement.icon}
                          </div>
                          <h3 className="text-sm font-semibold text-foreground mb-1">
                            {achievement.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress to Next Milestones */}
      {progressMilestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-warning" />
              Progress to Next Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{milestone.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {milestone.current}/{milestone.target}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="bg-gradient-eco h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(milestone.progress, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-lg font-bold text-primary">
                      {Math.round(milestone.progress)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-primary/20 hover:shadow-eco transition-shadow">
          <CardContent className="p-4">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{achievements.length}</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </CardContent>
        </Card>

        <Card className="text-center border-success/20 hover:shadow-eco transition-shadow">
          <CardContent className="p-4">
            <Target className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-foreground">{totalAnalyses}</div>
            <div className="text-xs text-muted-foreground">Analyses Done</div>
          </CardContent>
        </Card>

        <Card className="text-center border-warning/20 hover:shadow-eco transition-shadow">
          <CardContent className="p-4">
            <Award className="h-8 w-8 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-foreground">{averageScore}</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>

        <Card className="text-center border-eco-dark/20 hover:shadow-eco transition-shadow">
          <CardContent className="p-4">
            <Recycle className="h-8 w-8 mx-auto mb-2 text-eco-dark" />
            <div className="text-2xl font-bold text-foreground">
              {achievements.filter(a => a.type === 'alternatives_found').length}
            </div>
            <div className="text-xs text-muted-foreground">Alternatives Found</div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      {achievements.length === 0 && (
        <Card className="text-center border-muted bg-gradient-sky">
          <CardContent className="p-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse-glow" />
            <h3 className="text-lg font-semibold mb-2">Start Your Achievement Journey!</h3>
            <p className="text-muted-foreground">
              Complete environmental analyses to unlock achievements and track your sustainability progress.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}