import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Home, 
  Thermometer, 
  Lightbulb, 
  Monitor,
  Wind,
  Sun,
  Battery,
  TrendingDown,
  Calculator,
  Target,
  Settings
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EnergyUsage {
  heating: number;
  cooling: number;
  lighting: number;
  appliances: number;
  electronics: number;
  total: number;
  monthlyBill: number;
  co2Emissions: number;
}

interface OptimizationTip {
  category: string;
  action: string;
  savings: number;
  cost: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'Low' | 'Medium' | 'High';
}

const ENERGY_FACTORS = {
  heating_gas: 0.185, // kg CO2 per kWh
  heating_electric: 0.45,
  cooling: 0.45,
  lighting: 0.45,
  appliances: 0.45,
  electronics: 0.45,
  cost_per_kwh: 0.12 // dollars per kWh
};

const OPTIMIZATION_TIPS: OptimizationTip[] = [
  {
    category: 'Heating',
    action: 'Lower thermostat by 2°C',
    savings: 10,
    cost: 'Free',
    difficulty: 'Easy',
    impact: 'Medium'
  },
  {
    category: 'Heating',
    action: 'Install programmable thermostat',
    savings: 8,
    cost: '$50-150',
    difficulty: 'Easy',
    impact: 'Medium'
  },
  {
    category: 'Heating',
    action: 'Improve insulation',
    savings: 30,
    cost: '$500-2000',
    difficulty: 'Hard',
    impact: 'High'
  },
  {
    category: 'Lighting',
    action: 'Switch to LED bulbs',
    savings: 75,
    cost: '$20-100',
    difficulty: 'Easy',
    impact: 'High'
  },
  {
    category: 'Appliances',
    action: 'Use cold water for washing',
    savings: 5,
    cost: 'Free',
    difficulty: 'Easy',
    impact: 'Low'
  },
  {
    category: 'Electronics',
    action: 'Unplug devices when not in use',
    savings: 10,
    cost: 'Free',
    difficulty: 'Easy',
    impact: 'Medium'
  },
  {
    category: 'Cooling',
    action: 'Use fans instead of AC',
    savings: 15,
    cost: '$50-200',
    difficulty: 'Easy',
    impact: 'Medium'
  },
  {
    category: 'General',
    action: 'Install solar panels',
    savings: 50,
    cost: '$10000-20000',
    difficulty: 'Hard',
    impact: 'High'
  }
];

export default function EnergyOptimizer() {
  const [formData, setFormData] = useState({
    homeSize: '',
    heatingType: 'gas',
    monthlyBill: '',
    heatingTemp: '22',
    coolingTemp: '24',
    lightingHours: '6',
    applianceUsage: 'medium',
    electronicsHours: '8'
  });

  const [results, setResults] = useState<EnergyUsage | null>(null);
  const [showOptimizations, setShowOptimizations] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEnergyUsage = () => {
    const homeSize = parseFloat(formData.homeSize) || 100;
    const monthlyBill = parseFloat(formData.monthlyBill) || 150;
    
    // Estimate usage based on home size and bill
    const totalKwh = monthlyBill / ENERGY_FACTORS.cost_per_kwh;
    
    // Typical breakdown percentages
    const heating = totalKwh * 0.45; // 45% for heating/cooling
    const cooling = totalKwh * 0.15;
    const lighting = totalKwh * 0.12;
    const appliances = totalKwh * 0.20;
    const electronics = totalKwh * 0.08;
    
    const co2Factor = formData.heatingType === 'gas' 
      ? ENERGY_FACTORS.heating_gas 
      : ENERGY_FACTORS.heating_electric;
    
    const co2Emissions = totalKwh * co2Factor;

    setResults({
      heating,
      cooling,
      lighting,
      appliances,
      electronics,
      total: totalKwh,
      monthlyBill,
      co2Emissions
    });
  };

  const getUsageLevel = (kwh: number) => {
    if (kwh < 500) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (kwh < 1000) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (kwh < 1500) return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Very High', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-purple-100 text-purple-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Energy Optimizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze your home energy usage and discover personalized ways to reduce consumption, save money, and lower your carbon footprint.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Energy Assessment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Home Energy Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="homeSize">Home Size (m²)</Label>
                    <Input
                      id="homeSize"
                      type="number"
                      placeholder="e.g., 120"
                      value={formData.homeSize}
                      onChange={(e) => handleInputChange('homeSize', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyBill">Monthly Bill ($)</Label>
                    <Input
                      id="monthlyBill"
                      type="number"
                      placeholder="e.g., 150"
                      value={formData.monthlyBill}
                      onChange={(e) => handleInputChange('monthlyBill', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="heatingType">Primary Heating</Label>
                  <select
                    id="heatingType"
                    value={formData.heatingType}
                    onChange={(e) => handleInputChange('heatingType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="gas">Natural Gas</option>
                    <option value="electric">Electric</option>
                    <option value="heat_pump">Heat Pump</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heatingTemp">Heating Temp (°C)</Label>
                    <Input
                      id="heatingTemp"
                      type="number"
                      value={formData.heatingTemp}
                      onChange={(e) => handleInputChange('heatingTemp', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coolingTemp">Cooling Temp (°C)</Label>
                    <Input
                      id="coolingTemp"
                      type="number"
                      value={formData.coolingTemp}
                      onChange={(e) => handleInputChange('coolingTemp', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lightingHours">Lighting (hrs/day)</Label>
                    <Input
                      id="lightingHours"
                      type="number"
                      value={formData.lightingHours}
                      onChange={(e) => handleInputChange('lightingHours', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="electronicsHours">Electronics (hrs/day)</Label>
                    <Input
                      id="electronicsHours"
                      type="number"
                      value={formData.electronicsHours}
                      onChange={(e) => handleInputChange('electronicsHours', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="applianceUsage">Appliance Usage</Label>
                  <select
                    id="applianceUsage"
                    value={formData.applianceUsage}
                    onChange={(e) => handleInputChange('applianceUsage', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low (Minimal use)</option>
                    <option value="medium">Medium (Average use)</option>
                    <option value="high">High (Heavy use)</option>
                  </select>
                </div>

                <EcoButton 
                  onClick={calculateEnergyUsage}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  size="lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Analyze Energy Usage
                </EcoButton>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {results ? (
              <>
                {/* Total Usage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Your Energy Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">
                        {results.total.toFixed(0)} kWh
                      </div>
                      <div className="text-lg text-gray-600 mb-2">per month</div>
                      <div className="text-xl font-semibold text-gray-700 mb-4">
                        ${results.monthlyBill.toFixed(0)}/month
                      </div>
                      <Badge className={`${getUsageLevel(results.total).bgColor} ${getUsageLevel(results.total).color}`}>
                        {getUsageLevel(results.total).level} Usage
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span>Heating</span>
                      </div>
                      <span className="font-semibold">{results.heating.toFixed(0)} kWh</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-500" />
                        <span>Cooling</span>
                      </div>
                      <span className="font-semibold">{results.cooling.toFixed(0)} kWh</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span>Lighting</span>
                      </div>
                      <span className="font-semibold">{results.lighting.toFixed(0)} kWh</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-green-500" />
                        <span>Appliances</span>
                      </div>
                      <span className="font-semibold">{results.appliances.toFixed(0)} kWh</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-purple-500" />
                        <span>Electronics</span>
                      </div>
                      <span className="font-semibold">{results.electronics.toFixed(0)} kWh</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization Button */}
                <EcoButton
                  onClick={() => setShowOptimizations(!showOptimizations)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500"
                  size="lg"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {showOptimizations ? 'Hide' : 'Show'} Optimization Tips
                </EcoButton>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Analyze Your Energy Use
                  </h3>
                  <p className="text-gray-600">
                    Complete the assessment to see your energy profile and get optimization recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Optimization Tips */}
        {results && showOptimizations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Energy Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {OPTIMIZATION_TIPS.map((tip, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{tip.action}</h4>
                        <Badge variant="outline" className="text-xs">
                          {tip.category}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        Save up to {tip.savings}% • Cost: {tip.cost}
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(tip.difficulty)} variant="secondary">
                          {tip.difficulty}
                        </Badge>
                        <Badge className={getImpactColor(tip.impact)} variant="secondary">
                          {tip.impact} Impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Energy Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingDown className="h-6 w-6" />
                Energy Conservation Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">30%</div>
                  <p className="text-orange-100">typical energy savings possible</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">25%</div>
                  <p className="text-orange-100">of global energy used by buildings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">$500</div>
                  <p className="text-orange-100">average annual savings with optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
