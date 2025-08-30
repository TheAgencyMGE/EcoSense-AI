import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Car, 
  Home, 
  Plane, 
  Zap, 
  Trash2,
  TrendingUp,
  TrendingDown,
  Leaf,
  Target
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CarbonData {
  transportation: number;
  energy: number;
  flights: number;
  waste: number;
  total: number;
}

const CARBON_FACTORS = {
  car_gas: 0.404, // kg CO2 per km
  car_electric: 0.05,
  electricity: 0.45, // kg CO2 per kWh
  gas: 2.204, // kg CO2 per m³
  flight_domestic: 0.255, // kg CO2 per km
  flight_international: 0.195,
  waste: 0.5 // kg CO2 per kg waste
};

const RECOMMENDATIONS = [
  {
    category: 'Transportation',
    tips: [
      'Use public transport or bike when possible',
      'Consider electric or hybrid vehicles',
      'Combine errands into one trip',
      'Work from home when possible'
    ]
  },
  {
    category: 'Energy',
    tips: [
      'Switch to LED bulbs',
      'Improve home insulation',
      'Use renewable energy sources',
      'Unplug devices when not in use'
    ]
  },
  {
    category: 'Flights',
    tips: [
      'Choose direct flights when possible',
      'Offset your flight emissions',
      'Consider virtual meetings',
      'Vacation closer to home'
    ]
  },
  {
    category: 'Waste',
    tips: [
      'Reduce, reuse, recycle',
      'Compost organic waste',
      'Buy products with less packaging',
      'Choose durable goods'
    ]
  }
];

export default function CarbonFootprintCalculator() {
  const [formData, setFormData] = useState({
    carKm: '',
    carType: 'gas',
    electricity: '',
    gas: '',
    flights: '',
    flightType: 'domestic',
    waste: ''
  });

  const [results, setResults] = useState<CarbonData | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateFootprint = () => {
    const carEmissions = (parseFloat(formData.carKm) || 0) * 
      (formData.carType === 'gas' ? CARBON_FACTORS.car_gas : CARBON_FACTORS.car_electric);
    
    const electricityEmissions = (parseFloat(formData.electricity) || 0) * CARBON_FACTORS.electricity;
    const gasEmissions = (parseFloat(formData.gas) || 0) * CARBON_FACTORS.gas;
    const energyEmissions = electricityEmissions + gasEmissions;
    
    const flightEmissions = (parseFloat(formData.flights) || 0) * 
      (formData.flightType === 'domestic' ? CARBON_FACTORS.flight_domestic : CARBON_FACTORS.flight_international);
    
    const wasteEmissions = (parseFloat(formData.waste) || 0) * CARBON_FACTORS.waste;
    
    const total = carEmissions + energyEmissions + flightEmissions + wasteEmissions;

    setResults({
      transportation: carEmissions,
      energy: energyEmissions,
      flights: flightEmissions,
      waste: wasteEmissions,
      total: total
    });
  };

  const getEmissionLevel = (total: number) => {
    if (total < 2000) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (total < 5000) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (total < 10000) return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Very High', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Carbon Footprint Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your annual carbon footprint and discover personalized ways to reduce your environmental impact.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Footprint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transportation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-500" />
                    <Label className="text-base font-semibold">Transportation</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="carKm">Annual Car Travel (km)</Label>
                      <Input
                        id="carKm"
                        type="number"
                        placeholder="e.g., 15000"
                        value={formData.carKm}
                        onChange={(e) => handleInputChange('carKm', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carType">Car Type</Label>
                      <select
                        id="carType"
                        value={formData.carType}
                        onChange={(e) => handleInputChange('carType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="gas">Gasoline</option>
                        <option value="electric">Electric</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Energy */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <Label className="text-base font-semibold">Home Energy</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="electricity">Annual Electricity (kWh)</Label>
                      <Input
                        id="electricity"
                        type="number"
                        placeholder="e.g., 3000"
                        value={formData.electricity}
                        onChange={(e) => handleInputChange('electricity', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gas">Annual Gas (m³)</Label>
                      <Input
                        id="gas"
                        type="number"
                        placeholder="e.g., 1000"
                        value={formData.gas}
                        onChange={(e) => handleInputChange('gas', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Flights */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-purple-500" />
                    <Label className="text-base font-semibold">Air Travel</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="flights">Annual Flight Distance (km)</Label>
                      <Input
                        id="flights"
                        type="number"
                        placeholder="e.g., 5000"
                        value={formData.flights}
                        onChange={(e) => handleInputChange('flights', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="flightType">Flight Type</Label>
                      <select
                        id="flightType"
                        value={formData.flightType}
                        onChange={(e) => handleInputChange('flightType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="domestic">Domestic</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Waste */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <Label className="text-base font-semibold">Waste</Label>
                  </div>
                  <div>
                    <Label htmlFor="waste">Annual Waste Generated (kg)</Label>
                    <Input
                      id="waste"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.waste}
                      onChange={(e) => handleInputChange('waste', e.target.value)}
                    />
                  </div>
                </div>

                <EcoButton 
                  onClick={calculateFootprint}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500"
                  size="lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Footprint
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
                {/* Total Footprint */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Your Carbon Footprint
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {results.total.toFixed(1)} kg CO₂
                      </div>
                      <div className="text-lg text-gray-600 mb-4">per year</div>
                      <Badge className={`${getEmissionLevel(results.total).bgColor} ${getEmissionLevel(results.total).color}`}>
                        {getEmissionLevel(results.total).level} Impact
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emissions Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-500" />
                        <span>Transportation</span>
                      </div>
                      <span className="font-semibold">{results.transportation.toFixed(1)} kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span>Energy</span>
                      </div>
                      <span className="font-semibold">{results.energy.toFixed(1)} kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-purple-500" />
                        <span>Flights</span>
                      </div>
                      <span className="font-semibold">{results.flights.toFixed(1)} kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span>Waste</span>
                      </div>
                      <span className="font-semibold">{results.waste.toFixed(1)} kg</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Calculate Your Impact
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form to see your carbon footprint and get personalized recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Recommendations */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {RECOMMENDATIONS.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm">
                        <Leaf className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Global Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Global Carbon Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">4.6T</div>
                  <p className="text-blue-100">global average CO₂ per person</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">2T</div>
                  <p className="text-blue-100">target to limit warming to 1.5°C</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">16T</div>
                  <p className="text-blue-100">average in developed countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
