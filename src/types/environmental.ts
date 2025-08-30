export interface EnvironmentalAnalysis {
  id: string;
  timestamp: string;
  inputType: 'photo' | 'activity' | 'product';
  inputDescription: string;
  carbonFootprint: CarbonFootprint;
  environmentalImpacts: EnvironmentalImpact[];
  sustainabilityScore: SustainabilityScore;
  ecoAlternatives: EcoAlternative[];
  actionableSteps: ActionableStep[];
  regionalConsiderations: string[];
  educationalInsights: string;
  processingTime: number;
}

export interface CarbonFootprint {
  amount: number;
  unit: string;
  comparison: string;
  annualEquivalent?: number;
}

export interface EnvironmentalImpact {
  category: 'carbon' | 'water' | 'land' | 'biodiversity' | 'pollution' | 'energy';
  impact: string;
  severity: number; // 1-10 scale
  description: string;
}

export interface SustainabilityScore {
  score: number;
  maxScore: number;
  category: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
  reasoning: string;
  improvements: string[];
}

export interface EcoAlternative {
  name: string;
  description: string;
  impactReduction: number;
  accessibility: 'high' | 'medium' | 'low';
  costComparison: string;
  availabilityScore: number;
  environmentalBenefit: string;
}

export interface ActionableStep {
  step: string;
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  resources?: string[];
}

export interface UserContext {
  location?: string;
  lifestyle?: 'urban' | 'suburban' | 'rural';
  priorities?: EcoPriority[];
  constraints?: string[];
}

export interface EcoPriority {
  type: 'cost' | 'convenience' | 'impact' | 'availability';
  importance: number; // 1-5 scale
}

export interface SessionTracker {
  sessionId: string;
  startTime: string;
  analyses: EnvironmentalAnalysis[];
  totalImpactReduction: number;
  achievements: Achievement[];
  overallScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'analysis_count' | 'impact_reduction' | 'alternatives_found' | 'sustainability_improvement';
  unlockedAt: string;
  icon: string;
}

export interface ExportReport {
  sessionSummary: SessionSummary;
  analyses: EnvironmentalAnalysis[];
  recommendations: PersonalizedRecommendations;
  actionPlan: ActionPlan;
  generatedAt: string;
}

export interface SessionSummary {
  totalAnalyses: number;
  averageSustainabilityScore: number;
  totalCarbonImpact: number;
  potentialReduction: number;
  topCategories: string[];
}

export interface PersonalizedRecommendations {
  immediate: ActionableStep[];
  shortTerm: ActionableStep[];
  longTerm: ActionableStep[];
  priorityAlternatives: EcoAlternative[];
}

export interface ActionPlan {
  weeklyGoals: string[];
  monthlyTargets: string[];
  resourceLinks: ResourceLink[];
  trackingMetrics: string[];
}

export interface ResourceLink {
  title: string;
  url: string;
  category: string;
  description: string;
}