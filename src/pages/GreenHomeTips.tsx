import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Leaf, 
  Droplets, 
  Recycle, 
  Sun,
  TreePine,
  Lightbulb,
  ShoppingCart,
  Thermometer,
  Search,
  Star,
  CheckCircle
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface GreenTip {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'Low' | 'Medium' | 'High';
  cost: 'Free' | 'Low' | 'Medium' | 'High';
  steps: string[];
  benefits: string[];
  icon: any;
}

const GREEN_TIPS: GreenTip[] = [
  {
    id: '1',
    title: 'Switch to LED Light Bulbs',
    description: 'Replace incandescent bulbs with energy-efficient LEDs to reduce electricity consumption.',
    category: 'Energy',
    difficulty: 'Easy',
    impact: 'High',
    cost: 'Low',
    steps: [
      'Identify all incandescent and CFL bulbs in your home',
      'Purchase LED replacements with appropriate wattage',
      'Replace bulbs one room at a time',
      'Dispose of old bulbs properly at recycling centers'
    ],
    benefits: [
      'Save up to 80% on lighting energy costs',
      'LED bulbs last 25 times longer',
      'Reduce heat output in your home',
      'Available in various color temperatures'
    ],
    icon: Lightbulb
  },
  {
    id: '2',
    title: 'Install Water-Saving Fixtures',
    description: 'Reduce water consumption with low-flow showerheads, faucet aerators, and efficient toilets.',
    category: 'Water',
    difficulty: 'Medium',
    impact: 'High',
    cost: 'Medium',
    steps: [
      'Measure current water flow rates',
      'Purchase WaterSense certified fixtures',
      'Install low-flow showerheads and faucet aerators',
      'Consider upgrading to a dual-flush toilet'
    ],
    benefits: [
      'Reduce water usage by 30-50%',
      'Lower monthly water bills',
      'Maintain water pressure while saving',
      'Help conserve local water resources'
    ],
    icon: Droplets
  },
  {
    id: '3',
    title: 'Start Composting',
    description: 'Turn kitchen scraps and yard waste into nutrient-rich compost for your garden.',
    category: 'Waste',
    difficulty: 'Medium',
    impact: 'Medium',
    cost: 'Low',
    steps: [
      'Choose a composting method (bin, tumbler, or pile)',
      'Set up your compost area in a shaded spot',
      'Collect green materials (food scraps) and brown materials (leaves)',
      'Maintain proper moisture and turn regularly'
    ],
    benefits: [
      'Reduce household waste by 30%',
      'Create free fertilizer for plants',
      'Reduce methane emissions from landfills',
      'Improve soil health and water retention'
    ],
    icon: Recycle
  },
  {
    id: '4',
    title: 'Improve Home Insulation',
    description: 'Better insulation keeps your home comfortable while reducing heating and cooling costs.',
    category: 'Energy',
    difficulty: 'Hard',
    impact: 'High',
    cost: 'High',
    steps: [
      'Conduct an energy audit to identify air leaks',
      'Seal gaps around windows, doors, and outlets',
      'Add insulation to attic, walls, and basement',
      'Consider upgrading windows to double or triple-pane'
    ],
    benefits: [
      'Reduce energy bills by 15-50%',
      'Improve indoor comfort year-round',
      'Increase home value',
      'Reduce carbon footprint significantly'
    ],
    icon: Home
  },
  {
    id: '5',
    title: 'Create a Rain Garden',
    description: 'Design a garden that captures and filters rainwater runoff naturally.',
    category: 'Water',
    difficulty: 'Hard',
    impact: 'Medium',
    cost: 'Medium',
    steps: [
      'Identify the best location for water collection',
      'Dig a shallow depression 6-8 inches deep',
      'Choose native plants that tolerate wet and dry conditions',
      'Add mulch and create overflow areas for heavy rains'
    ],
    benefits: [
      'Reduce stormwater runoff',
      'Filter pollutants from rainwater',
      'Support local wildlife and pollinators',
      'Create beautiful landscaping feature'
    ],
    icon: TreePine
  },
  {
    id: '6',
    title: 'Install Solar Outdoor Lighting',
    description: 'Use solar-powered lights for pathways, gardens, and security lighting.',
    category: 'Energy',
    difficulty: 'Easy',
    impact: 'Low',
    cost: 'Low',
    steps: [
      'Choose high-quality solar lights with good reviews',
      'Install in areas that receive direct sunlight',
      'Position lights for maximum effectiveness',
      'Clean solar panels regularly for optimal performance'
    ],
    benefits: [
      'Zero electricity costs for outdoor lighting',
      'Easy installation with no wiring required',
      'Automatic operation with built-in sensors',
      'Enhance security and curb appeal'
    ],
    icon: Sun
  },
  {
    id: '7',
    title: 'Optimize Thermostat Settings',
    description: 'Program your thermostat for maximum comfort and energy efficiency.',
    category: 'Energy',
    difficulty: 'Easy',
    impact: 'High',
    cost: 'Free',
    steps: [
      'Set temperature 7-10°F lower when away or sleeping',
      'Program different settings for weekdays and weekends',
      'Use a programmable or smart thermostat',
      'Keep vents unblocked and change filters regularly'
    ],
    benefits: [
      'Save 10% on heating and cooling costs',
      'Maintain comfortable temperatures automatically',
      'Extend HVAC system lifespan',
      'Reduce energy consumption year-round'
    ],
    icon: Thermometer
  },
  {
    id: '8',
    title: 'Choose Eco-Friendly Cleaning Products',
    description: 'Replace harsh chemicals with natural, biodegradable cleaning solutions.',
    category: 'Health',
    difficulty: 'Easy',
    impact: 'Medium',
    cost: 'Low',
    steps: [
      'Read labels and choose certified eco-friendly products',
      'Make DIY cleaners with vinegar, baking soda, and lemon',
      'Use microfiber cloths to reduce need for chemicals',
      'Buy concentrated products to reduce packaging'
    ],
    benefits: [
      'Improve indoor air quality',
      'Reduce harmful chemical exposure',
      'Protect waterways from pollution',
      'Often more cost-effective than conventional products'
    ],
    icon: ShoppingCart
  }
];

const CATEGORIES = ['All', 'Energy', 'Water', 'Waste', 'Health'];

export default function GreenHomeTips() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());

  const filteredTips = GREEN_TIPS.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleCompleted = (tipId: string) => {
    const newCompleted = new Set(completedTips);
    if (newCompleted.has(tipId)) {
      newCompleted.delete(tipId);
    } else {
      newCompleted.add(tipId);
    }
    setCompletedTips(newCompleted);
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

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Free': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Green Home Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your home into an eco-friendly haven with practical tips that save money, conserve resources, and create a healthier living environment.
          </p>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your Green Home Progress</h3>
                  <p className="text-green-100">
                    You've completed {completedTips.size} out of {GREEN_TIPS.length} tips
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-300">
                    {Math.round((completedTips.size / GREEN_TIPS.length) * 100)}%
                  </div>
                  <div className="text-green-100">Complete</div>
                </div>
              </div>
              <div className="w-full bg-green-400 rounded-full h-2 mt-4">
                <div
                  className="bg-yellow-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTips.size / GREEN_TIPS.length) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search green home tips..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map((category) => (
                    <EcoButton
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? 
                        "bg-gradient-to-r from-green-500 to-blue-500" : ""
                      }
                    >
                      {category}
                    </EcoButton>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`h-full hover:shadow-lg transition-all relative ${
                completedTips.has(tip.id) ? 'ring-2 ring-green-500 bg-green-50' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        completedTips.has(tip.id) ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <tip.icon className={`h-5 w-5 ${
                          completedTips.has(tip.id) ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompleted(tip.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        completedTips.has(tip.id)
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {completedTips.has(tip.id) && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getDifficultyColor(tip.difficulty)} variant="secondary">
                      {tip.difficulty}
                    </Badge>
                    <Badge className={getImpactColor(tip.impact)} variant="secondary">
                      {tip.impact} Impact
                    </Badge>
                    <Badge className={getCostColor(tip.cost)} variant="secondary">
                      {tip.cost} Cost
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Steps:</h4>
                    <ul className="space-y-1">
                      {tip.steps.slice(0, 2).map((step, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {step}
                        </li>
                      ))}
                      {tip.steps.length > 2 && (
                        <li className="text-sm text-gray-500">
                          +{tip.steps.length - 2} more steps
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {tip.benefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <Leaf className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                      {tip.benefits.length > 2 && (
                        <li className="text-sm text-gray-500 ml-5">
                          +{tip.benefits.length - 2} more benefits
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="h-6 w-6" />
                Green Home Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">30%</div>
                  <p className="text-green-100">average energy savings possible</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">$1,200</div>
                  <p className="text-green-100">potential annual savings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">2 tons</div>
                  <p className="text-green-100">CO₂ reduction per household</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
