import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Bike, 
  Bus, 
  Train, 
  Plane,
  MapPin,
  Route,
  Leaf,
  Calculator,
  TrendingDown,
  Clock,
  DollarSign
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransportOption {
  mode: string;
  icon: any;
  time: number;
  cost: number;
  co2: number;
  description: string;
  benefits: string[];
}

interface RouteComparison {
  distance: number;
  options: TransportOption[];
}

const TRANSPORT_FACTORS = {
  car_gas: 0.21, // kg CO2 per km
  car_electric: 0.05,
  bus: 0.089,
  train: 0.041,
  bike: 0,
  walking: 0,
  plane: 0.255 // short haul
};

const TRANSPORT_MODES = [
  {
    mode: 'Personal Car (Gas)',
    icon: Car,
    factor: TRANSPORT_FACTORS.car_gas,
    baseTime: 1, // relative to car time
    baseCost: 0.15, // per km
    benefits: ['Door-to-door convenience', 'Weather protection', 'Cargo space']
  },
  {
    mode: 'Electric Car',
    icon: Car,
    factor: TRANSPORT_FACTORS.car_electric,
    baseTime: 1,
    baseCost: 0.08,
    benefits: ['Lower emissions', 'Quiet operation', 'Lower running costs']
  },
  {
    mode: 'Public Bus',
    icon: Bus,
    factor: TRANSPORT_FACTORS.bus,
    baseTime: 1.5,
    baseCost: 0.05,
    benefits: ['Very low cost', 'Reduces traffic', 'Social interaction']
  },
  {
    mode: 'Train/Metro',
    icon: Train,
    factor: TRANSPORT_FACTORS.train,
    baseTime: 1.2,
    baseCost: 0.08,
    benefits: ['Fast for long distances', 'Weather independent', 'Can work while traveling']
  },
  {
    mode: 'Bicycle',
    icon: Bike,
    factor: TRANSPORT_FACTORS.bike,
    baseTime: 3,
    baseCost: 0.01,
    benefits: ['Zero emissions', 'Great exercise', 'No traffic delays']
  }
];

const SUSTAINABILITY_TIPS = [
  {
    category: 'Short Trips (<5km)',
    icon: Bike,
    recommendations: [
      'Walk or cycle whenever possible',
      'Use electric scooters or e-bikes',
      'Combine multiple errands into one trip',
      'Consider car-sharing for occasional needs'
    ]
  },
  {
    category: 'Medium Trips (5-50km)',
    icon: Bus,
    recommendations: [
      'Use public transportation',
      'Carpool with colleagues or friends',
      'Choose electric or hybrid vehicles',
      'Plan routes to avoid peak traffic'
    ]
  },
  {
    category: 'Long Trips (>50km)',
    icon: Train,
    recommendations: [
      'Take trains instead of flights when possible',
      'Choose direct routes to reduce emissions',
      'Consider overnight trains for very long distances',
      'Offset emissions when flying is necessary'
    ]
  }
];

export default function SustainableTransportOptimizer() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [results, setResults] = useState<RouteComparison | null>(null);

  const calculateRouteOptions = () => {
    const dist = parseFloat(distance);
    if (!dist || dist <= 0) return;

    const options = TRANSPORT_MODES.map(transport => {
      const time = dist / 30 * transport.baseTime; // Assuming 30km/h base speed
      const cost = dist * transport.baseCost;
      const co2 = dist * transport.factor;

      return {
        mode: transport.mode,
        icon: transport.icon,
        time: Math.max(time, 0.1), // Minimum 6 minutes
        cost: Math.max(cost, 0),
        co2: co2,
        description: `${dist}km via ${transport.mode.toLowerCase()}`,
        benefits: transport.benefits
      };
    });

    // Sort by CO2 emissions (lowest first)
    options.sort((a, b) => a.co2 - b.co2);

    setResults({
      distance: dist,
      options
    });
  };

  const getBestOption = () => {
    if (!results) return null;
    return results.options[0]; // Lowest CO2
  };

  const getEmissionColor = (co2: number) => {
    if (co2 === 0) return 'text-green-600';
    if (co2 < 2) return 'text-yellow-600';
    if (co2 < 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    return `${hours.toFixed(1)} hrs`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Route className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Sustainable Transport Optimizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the most eco-friendly way to travel. Compare emissions, costs, and time for different transportation options.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Route Planner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Plan Your Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      placeholder="Enter starting location"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      placeholder="Enter destination"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      placeholder="e.g., 15"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                </div>

                <EcoButton 
                  onClick={calculateRouteOptions}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500"
                  size="lg"
                  disabled={!distance}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Compare Transport Options
                </EcoButton>
              </CardContent>
            </Card>
          </motion.div>

          {/* Best Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {results && getBestOption() ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Leaf className="h-5 w-5" />
                    Recommended Option
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {React.createElement(getBestOption()!.icon, { className: "h-8 w-8 text-green-600" })}
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      {getBestOption()!.mode}
                    </h3>
                    <p className="text-gray-700">{getBestOption()!.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getBestOption()!.co2.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">kg CO₂</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatTime(getBestOption()!.time)}
                      </div>
                      <div className="text-sm text-gray-600">duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ${getBestOption()!.cost.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">estimated cost</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {getBestOption()!.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Route className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Plan Your Journey
                  </h3>
                  <p className="text-gray-600">
                    Enter your route details to see sustainable transport recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* All Options Comparison */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>All Transport Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.options.map((option, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        {React.createElement(option.icon, { className: "h-6 w-6 text-gray-600" })}
                        <h3 className="font-semibold">{option.mode}</h3>
                        {index === 0 && (
                          <Badge className="bg-green-100 text-green-800">Best</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <div className={`font-bold ${getEmissionColor(option.co2)}`}>
                            {option.co2.toFixed(1)}
                          </div>
                          <div className="text-gray-500">kg CO₂</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">
                            {formatTime(option.time)}
                          </div>
                          <div className="text-gray-500">time</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-purple-600">
                            ${option.cost.toFixed(2)}
                          </div>
                          <div className="text-gray-500">cost</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sustainability Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          {SUSTAINABILITY_TIPS.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <section.icon className="h-5 w-5 text-green-500" />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.recommendations.map((tip, tipIndex) => (
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

        {/* Transport Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingDown className="h-6 w-6" />
                Transportation Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">24%</div>
                  <p className="text-green-100">of global CO₂ from transport</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">50%</div>
                  <p className="text-green-100">reduction with public transport</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">100%</div>
                  <p className="text-green-100">emission reduction with cycling</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
