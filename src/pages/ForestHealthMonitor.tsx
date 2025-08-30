import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trees, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Leaf, 
  Heart,
  TrendingUp,
  Users,
  Shield,
  Search,
  Info
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ForestHealth {
  location: string;
  healthScore: number;
  threats: string[];
  biodiversity: number;
  carbonStored: number;
  recommendations: string[];
  species: string[];
  status: 'Healthy' | 'At Risk' | 'Critical';
}

const SAMPLE_FORESTS: ForestHealth[] = [
  {
    location: "Amazon Rainforest, Brazil",
    healthScore: 65,
    threats: ["Deforestation", "Illegal logging", "Climate change", "Mining"],
    biodiversity: 85,
    carbonStored: 150000,
    recommendations: [
      "Support sustainable forestry practices",
      "Reduce paper consumption",
      "Support conservation organizations",
      "Choose certified wood products"
    ],
    species: ["Jaguar", "Toucan", "Poison Dart Frog", "Brazil Nut Tree", "Mahogany"],
    status: "At Risk"
  },
  {
    location: "Boreal Forest, Canada",
    healthScore: 78,
    threats: ["Climate change", "Insect outbreaks", "Wildfires"],
    biodiversity: 70,
    carbonStored: 89000,
    recommendations: [
      "Support fire prevention programs",
      "Reduce carbon emissions",
      "Support Indigenous land management",
      "Choose sustainable paper products"
    ],
    species: ["Black Bear", "Moose", "Lynx", "Spruce", "Fir"],
    status: "Healthy"
  },
  {
    location: "Congo Basin, Central Africa",
    healthScore: 58,
    threats: ["Illegal logging", "Mining", "Agricultural expansion", "Poaching"],
    biodiversity: 92,
    carbonStored: 120000,
    recommendations: [
      "Support anti-poaching efforts",
      "Choose conflict-free minerals",
      "Support local communities",
      "Reduce meat consumption"
    ],
    species: ["Mountain Gorilla", "Forest Elephant", "Okapi", "Ebony", "Iroko"],
    status: "Critical"
  }
];

const FOREST_ACTIONS = [
  {
    icon: Trees,
    title: "Plant Trees",
    description: "Support reforestation projects worldwide",
    impact: "1 tree = 48 lbs CO₂ absorbed annually"
  },
  {
    icon: Shield,
    title: "Protect Old Growth",
    description: "Advocate for ancient forest preservation",
    impact: "Old forests store 10x more carbon"
  },
  {
    icon: Users,
    title: "Support Communities",
    description: "Help indigenous forest guardians",
    impact: "Indigenous lands have 80% forest cover"
  },
  {
    icon: Leaf,
    title: "Sustainable Products",
    description: "Choose certified sustainable options",
    impact: "Reduces demand for illegal logging"
  }
];

export default function ForestHealthMonitor() {
  const [selectedForest, setSelectedForest] = useState<ForestHealth | null>(null);
  const [searchLocation, setSearchLocation] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Trees className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Forest Health Monitor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor forest health worldwide and learn how to protect these vital ecosystems. Discover threats, track biodiversity, and take action to preserve our forests.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for forest locations..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <EcoButton className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  Search
                </EcoButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forest Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {SAMPLE_FORESTS.map((forest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-300"
                onClick={() => setSelectedForest(forest)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                      <Trees className="h-5 w-5" />
                      {forest.location}
                    </CardTitle>
                    <Badge className={getStatusColor(forest.status)}>
                      {forest.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Health Score</span>
                      <span className={`text-lg font-bold ${getHealthColor(forest.healthScore)}`}>
                        {forest.healthScore}%
                      </span>
                    </div>
                    <Progress 
                      value={forest.healthScore} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Biodiversity</span>
                      <span className={`text-lg font-bold ${getHealthColor(forest.biodiversity)}`}>
                        {forest.biodiversity}%
                      </span>
                    </div>
                    <Progress 
                      value={forest.biodiversity} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Carbon Stored</span>
                      <p className="font-semibold text-green-700">
                        {(forest.carbonStored / 1000).toFixed(0)}K tons
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Species</span>
                      <p className="font-semibold text-green-700">
                        {forest.species.length}+ tracked
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Major Threats
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {forest.threats.slice(0, 2).map((threat, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-red-50 text-red-700">
                          {threat}
                        </Badge>
                      ))}
                      {forest.threats.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{forest.threats.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <EcoButton 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                    size="sm"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    View Details
                  </EcoButton>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Forest View */}
        {selectedForest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-green-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                    <Trees className="h-6 w-6" />
                    {selectedForest.location}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedForest.status)}>
                      {selectedForest.status}
                    </Badge>
                    <EcoButton
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedForest(null)}
                    >
                      Close
                    </EcoButton>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Forest Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Overall Health</span>
                          <span className={`font-bold ${getHealthColor(selectedForest.healthScore)}`}>
                            {selectedForest.healthScore}%
                          </span>
                        </div>
                        <Progress value={selectedForest.healthScore} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Biodiversity Index</span>
                          <span className={`font-bold ${getHealthColor(selectedForest.biodiversity)}`}>
                            {selectedForest.biodiversity}%
                          </span>
                        </div>
                        <Progress value={selectedForest.biodiversity} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-sm text-gray-600">Carbon Storage</span>
                        <span className="font-bold text-green-700">
                          {(selectedForest.carbonStored / 1000).toFixed(0)}K tons CO₂
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Active Threats
                    </h4>
                    <div className="space-y-2">
                      {selectedForest.threats.map((threat, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-800">{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Key Species</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedForest.species.map((species, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-500" />
                    How You Can Help
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedForest.recommendations.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {FOREST_ACTIONS.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <action.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                    {action.impact}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Global Forest Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Global Forest Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">31%</div>
                  <p className="text-green-100">of Earth's land covered by forests</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">1.6B</div>
                  <p className="text-green-100">people depend on forests for livelihoods</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">80%</div>
                  <p className="text-green-100">of terrestrial biodiversity lives in forests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
