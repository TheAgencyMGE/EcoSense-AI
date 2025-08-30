import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EcoButton } from '@/components/ui/eco-button';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  Award,
  Target,
  Clock,
  Leaf,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

interface SessionSummaryProps {
  summary: {
    totalAnalyses: number;
    averageSustainabilityScore: number;
    totalCarbonImpact: number;
    potentialReduction: number;
    topCategories: string[];
    achievements: number;
    sessionDuration: number;
  };
  onExport: () => void;
  onNewSession: () => void;
  onShare?: () => void;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function SessionSummary({ 
  summary, 
  onExport, 
  onNewSession, 
  onShare 
}: SessionSummaryProps) {
  const getScoreCategory = (score: number) => {
    if (score >= 80) return { category: 'Excellent', color: 'text-success', bg: 'bg-success/10' };
    if (score >= 65) return { category: 'Good', color: 'text-primary', bg: 'bg-primary/10' };
    if (score >= 50) return { category: 'Moderate', color: 'text-warning', bg: 'bg-warning/10' };
    return { category: 'Needs Improvement', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const scoreInfo = getScoreCategory(summary.averageSustainabilityScore);

  const chartData = summary.topCategories.map((category, index) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: Math.floor(Math.random() * 40) + 20, // Mock data for demo
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-2">
          Session Environmental Report
        </h1>
        <p className="text-muted-foreground">
          Analysis completed • Duration: {summary.sessionDuration} minutes
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center border-primary/20 hover:shadow-eco transition-shadow">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground">
                {summary.totalAnalyses}
              </div>
              <div className="text-sm text-muted-foreground">
                Environmental Analyses
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`text-center border-primary/20 hover:shadow-eco transition-shadow ${scoreInfo.bg}`}>
            <CardContent className="p-6">
              <Award className={`h-8 w-8 mx-auto mb-3 ${scoreInfo.color}`} />
              <div className={`text-3xl font-bold ${scoreInfo.color}`}>
                {summary.averageSustainabilityScore}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Sustainability Score
              </div>
              <Badge variant="secondary" className="mt-2">
                {scoreInfo.category}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center border-primary/20 hover:shadow-eco transition-shadow">
            <CardContent className="p-6">
              <Leaf className="h-8 w-8 mx-auto mb-3 text-warning" />
              <div className="text-3xl font-bold text-foreground">
                {summary.totalCarbonImpact.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                kg CO₂e Impact
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="text-center border-success/20 hover:shadow-eco transition-shadow bg-success/5">
            <CardContent className="p-6">
              <Target className="h-8 w-8 mx-auto mb-3 text-success" />
              <div className="text-3xl font-bold text-success">
                {summary.potentialReduction}%
              </div>
              <div className="text-sm text-muted-foreground">
                Potential Reduction
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Impact Categories Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {chartData.map((item, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sustainability Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Session Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sustainability Awareness</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Alternative Discovery</span>
                  <span className="font-medium">{Math.min(summary.potentialReduction, 100)}%</span>
                </div>
                <Progress value={Math.min(summary.potentialReduction, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Action Planning</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Session Duration: {summary.sessionDuration} minutes
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Award className="h-4 w-4" />
                  Achievements Unlocked: {summary.achievements}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <EcoButton variant="eco" size="lg" onClick={onExport}>
          <Download className="h-5 w-5" />
          Export Report
        </EcoButton>

        {onShare && (
          <EcoButton variant="earth" size="lg" onClick={onShare}>
            <Share2 className="h-5 w-5" />
            Share Progress
          </EcoButton>
        )}

        <EcoButton variant="outline" size="lg" onClick={onNewSession}>
          <RefreshCw className="h-5 w-5" />
          New Session
        </EcoButton>
      </motion.div>

      {/* Environmental Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-sky border-primary/20">
          <CardContent className="p-6 text-center">
            <Leaf className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Keep Building Momentum!</h3>
            <p className="text-muted-foreground">
              You've taken {summary.totalAnalyses} steps toward sustainability. 
              Each analysis brings you closer to a more environmentally conscious lifestyle.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}