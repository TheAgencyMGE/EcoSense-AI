import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Bath, 
  Car, 
  Home, 
  TreePine,
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  Calendar
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WaterUsage {
  shower: number;
  toilet: number;
  washing: number;
  dishwashing: number;
  garden: number;
  other: number;
  total: number;
  dailyTotal: number;
}

const WATER_USAGE_RATES = {
  shower: 10, // liters per minute
  toilet: 6, // liters per flush
  washingMachine: 50, // liters per load
  dishwasher: 15, // liters per cycle
  handWashing: 6, // liters per minute
  garden: 20, // liters per minute
  drinking: 2, // liters per day
  cooking: 5 // liters per day
};

const WATER_SAVING_TIPS = [
  {
    category: 'Bathroom',
    icon: Bath,
    tips: [
      'Take shorter showers (4-5 minutes)',
      'Fix leaky faucets and toilets',
      'Install low-flow showerheads',
      'Turn off tap while brushing teeth'
    ],
    potential: '150L/day'
  },
  {
    category: 'Kitchen',
    icon: Home,
    tips: [
      'Only run dishwasher when full',
      'Wash vegetables in a bowl, not running water',
      'Keep drinking water in the fridge',
      'Fix any dripping faucets'
    ],
    potential: '50L/day'
  },
  {
    category: 'Laundry',
    icon: Car,
    tips: [
      'Wash full loads only',
      'Use cold water when possible',
      'Choose efficient washing machines',
      'Reuse towels multiple times'
    ],
    potential: '100L/day'
  },
  {
    category: 'Garden',
    icon: TreePine,
    tips: [
      'Water early morning or evening',
      'Use drip irrigation systems',
      'Collect rainwater',
      'Choose drought-resistant plants'
    ],
    potential: '200L/day'
  }
];

export default function WaterUsageTracker() {
  const [formData, setFormData] = useState({
    showerTime: '',
    showerFreq: '',
    toiletFlushes: '',
    washingLoads: '',
    dishwasherUse: '',
    handWashing: '',
    gardenTime: '',
    gardenFreq: ''
  });

  const [results, setResults] = useState<WaterUsage | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateWaterUsage = () => {
    // Daily calculations
    const shower = (parseFloat(formData.showerTime) || 0) * 
                  (parseFloat(formData.showerFreq) || 0) * 
                  WATER_USAGE_RATES.shower;
    
    const toilet = (parseFloat(formData.toiletFlushes) || 0) * WATER_USAGE_RATES.toilet;
    
    const washing = (parseFloat(formData.washingLoads) || 0) * WATER_USAGE_RATES.washingMachine;
    
    const dishwashing = (parseFloat(formData.dishwasherUse) || 0) * WATER_USAGE_RATES.dishwasher +
                       (parseFloat(formData.handWashing) || 0) * WATER_USAGE_RATES.handWashing;
    
    const garden = (parseFloat(formData.gardenTime) || 0) * 
                  (parseFloat(formData.gardenFreq) || 0) * 
                  WATER_USAGE_RATES.garden;
    
    const other = WATER_USAGE_RATES.drinking + WATER_USAGE_RATES.cooking;
    
    const dailyTotal = shower + toilet + washing + dishwashing + garden + other;
    const total = dailyTotal * 365; // Annual total

    setResults({
      shower,
      toilet,
      washing,
      dishwashing,
      garden,
      other,
      total,
      dailyTotal
    });
  };

  const getUsageLevel = (daily: number) => {
    if (daily < 150) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (daily < 250) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (daily < 350) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Droplets className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Water Usage Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your daily water consumption and discover ways to conserve this precious resource for future generations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Usage Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Water Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shower */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-blue-500" />
                    <Label className="text-base font-semibold">Shower & Bath</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="showerTime">Average shower time (minutes)</Label>
                      <Input
                        id="showerTime"
                        type="number"
                        placeholder="e.g., 8"
                        value={formData.showerTime}
                        onChange={(e) => handleInputChange('showerTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="showerFreq">Showers per day</Label>
                      <Input
                        id="showerFreq"
                        type="number"
                        placeholder="e.g., 1"
                        value={formData.showerFreq}
                        onChange={(e) => handleInputChange('showerFreq', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Toilet */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-cyan-500" />
                    <Label className="text-base font-semibold">Toilet</Label>
                  </div>
                  <div>
                    <Label htmlFor="toiletFlushes">Number of flushes per day</Label>
                    <Input
                      id="toiletFlushes"
                      type="number"
                      placeholder="e.g., 6"
                      value={formData.toiletFlushes}
                      onChange={(e) => handleInputChange('toiletFlushes', e.target.value)}
                    />
                  </div>
                </div>

                {/* Laundry */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-purple-500" />
                    <Label className="text-base font-semibold">Laundry</Label>
                  </div>
                  <div>
                    <Label htmlFor="washingLoads">Washing machine loads per week</Label>
                    <Input
                      id="washingLoads"
                      type="number"
                      placeholder="e.g., 4"
                      value={formData.washingLoads}
                      onChange={(e) => handleInputChange('washingLoads', e.target.value)}
                    />
                  </div>
                </div>

                {/* Dishwashing */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-green-500" />
                    <Label className="text-base font-semibold">Dishwashing</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="dishwasherUse">Dishwasher cycles per week</Label>
                      <Input
                        id="dishwasherUse"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.dishwasherUse}
                        onChange={(e) => handleInputChange('dishwasherUse', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="handWashing">Hand washing (minutes/day)</Label>
                      <Input
                        id="handWashing"
                        type="number"
                        placeholder="e.g., 10"
                        value={formData.handWashing}
                        onChange={(e) => handleInputChange('handWashing', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Garden */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-emerald-500" />
                    <Label className="text-base font-semibold">Garden & Outdoor</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="gardenTime">Watering time (minutes)</Label>
                      <Input
                        id="gardenTime"
                        type="number"
                        placeholder="e.g., 30"
                        value={formData.gardenTime}
                        onChange={(e) => handleInputChange('gardenTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gardenFreq">Times per week</Label>
                      <Input
                        id="gardenFreq"
                        type="number"
                        placeholder="e.g., 3"
                        value={formData.gardenFreq}
                        onChange={(e) => handleInputChange('gardenFreq', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <EcoButton 
                  onClick={calculateWaterUsage}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  size="lg"
                >
                  <Droplets className="h-4 w-4 mr-2" />
                  Calculate Usage
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
                      Your Water Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {results.dailyTotal.toFixed(1)}L
                      </div>
                      <div className="text-lg text-gray-600 mb-2">per day</div>
                      <div className="text-2xl font-semibold text-gray-700 mb-4">
                        {(results.total / 1000).toFixed(1)}k L/year
                      </div>
                      <Badge className={`${getUsageLevel(results.dailyTotal).bgColor} ${getUsageLevel(results.dailyTotal).color}`}>
                        {getUsageLevel(results.dailyTotal).level} Usage
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-blue-500" />
                        <span>Shower</span>
                      </div>
                      <span className="font-semibold">{results.shower.toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-cyan-500" />
                        <span>Toilet</span>
                      </div>
                      <span className="font-semibold">{results.toilet.toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-purple-500" />
                        <span>Laundry</span>
                      </div>
                      <span className="font-semibold">{(results.washing / 7).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-green-500" />
                        <span>Dishes</span>
                      </div>
                      <span className="font-semibold">{results.dishwashing.toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TreePine className="h-4 w-4 text-emerald-500" />
                        <span>Garden</span>
                      </div>
                      <span className="font-semibold">{(results.garden / 7).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-gray-500" />
                        <span>Other</span>
                      </div>
                      <span className="font-semibold">{results.other.toFixed(1)}L</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Track Your Usage
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form to see your daily water consumption and get conservation tips.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Water Saving Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {WATER_SAVING_TIPS.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <section.icon className="h-5 w-5 text-blue-500" />
                  {section.category}
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  Save up to {section.potential}
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Global Water Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Water Conservation Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">300L</div>
                  <p className="text-blue-100">average daily use per person</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">2B</div>
                  <p className="text-blue-100">people lack safely managed water</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">30%</div>
                  <p className="text-blue-100">potential water savings at home</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
