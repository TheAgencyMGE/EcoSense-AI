import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Camera, 
  Search, 
  MapPin, 
  AlertTriangle, 
  Shield,
  TrendingDown,
  Users,
  Leaf,
  Info,
  Clock
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

interface EndangeredSpecies {
  id: string;
  name: string;
  scientificName: string;
  status: 'Critically Endangered' | 'Endangered' | 'Vulnerable' | 'Near Threatened';
  population: number;
  habitat: string;
  threats: string[];
  conservation: string[];
  region: string;
  image?: string;
  populationTrend: 'Increasing' | 'Stable' | 'Decreasing';
  lastSeen?: string;
}

const ENDANGERED_SPECIES: EndangeredSpecies[] = [
  {
    id: '1',
    name: 'Amur Leopard',
    scientificName: 'Panthera pardus orientalis',
    status: 'Critically Endangered',
    population: 130,
    habitat: 'Temperate forests',
    threats: ['Habitat loss', 'Poaching', 'Climate change', 'Human encroachment'],
    conservation: ['Protected reserves', 'Anti-poaching patrols', 'Breeding programs', 'Habitat restoration'],
    region: 'Far East Russia, Northeast China',
    populationTrend: 'Increasing',
    lastSeen: '2 weeks ago'
  },
  {
    id: '2',
    name: 'Vaquita Porpoise',
    scientificName: 'Phocoena sinus',
    status: 'Critically Endangered',
    population: 10,
    habitat: 'Marine waters',
    threats: ['Fishing nets', 'Illegal fishing', 'Boat traffic', 'Pollution'],
    conservation: ['Fishing restrictions', 'Net removal', 'Marine protected areas', 'Alternative livelihoods'],
    region: 'Gulf of California, Mexico',
    populationTrend: 'Decreasing',
    lastSeen: '1 month ago'
  },
  {
    id: '3',
    name: 'Mountain Gorilla',
    scientificName: 'Gorilla beringei beringei',
    status: 'Critically Endangered',
    population: 1000,
    habitat: 'Mountain forests',
    threats: ['Habitat loss', 'Poaching', 'Disease', 'Civil unrest'],
    conservation: ['Protected parks', 'Community programs', 'Veterinary care', 'Eco-tourism'],
    region: 'Central and East Africa',
    populationTrend: 'Increasing',
    lastSeen: '3 days ago'
  },
  {
    id: '4',
    name: 'Sumatran Orangutan',
    scientificName: 'Pongo abelii',
    status: 'Critically Endangered',
    population: 14000,
    habitat: 'Tropical rainforests',
    threats: ['Deforestation', 'Palm oil plantations', 'Illegal pet trade', 'Forest fires'],
    conservation: ['Forest protection', 'Sustainable palm oil', 'Rescue centers', 'Community education'],
    region: 'Sumatra, Indonesia',
    populationTrend: 'Decreasing',
    lastSeen: '1 week ago'
  },
  {
    id: '5',
    name: 'Black Rhino',
    scientificName: 'Diceros bicornis',
    status: 'Critically Endangered',
    population: 5500,
    habitat: 'Savannas, grasslands',
    threats: ['Poaching for horns', 'Habitat loss', 'Human-wildlife conflict'],
    conservation: ['Anti-poaching units', 'Translocation programs', 'Community conservancies', 'Horn devaluation'],
    region: 'Eastern and Southern Africa',
    populationTrend: 'Increasing',
    lastSeen: '5 days ago'
  },
  {
    id: '6',
    name: 'Hawksbill Turtle',
    scientificName: 'Eretmochelys imbricata',
    status: 'Critically Endangered',
    population: 8000,
    habitat: 'Coral reefs, coastal waters',
    threats: ['Illegal trade', 'Plastic pollution', 'Climate change', 'Coastal development'],
    conservation: ['Nesting site protection', 'Trade monitoring', 'Plastic reduction', 'Community involvement'],
    region: 'Tropical oceans worldwide',
    populationTrend: 'Stable',
    lastSeen: '2 weeks ago'
  }
];

const CONSERVATION_ACTIONS = [
  {
    icon: Shield,
    title: 'Protect Habitats',
    description: 'Support protected area expansion',
    impact: 'Preserves critical ecosystems'
  },
  {
    icon: Users,
    title: 'Support Communities',
    description: 'Help local conservation efforts',
    impact: 'Creates sustainable livelihoods'
  },
  {
    icon: Heart,
    title: 'Adopt a Species',
    description: 'Sponsor conservation programs',
    impact: 'Direct funding for protection'
  },
  {
    icon: Leaf,
    title: 'Sustainable Choices',
    description: 'Choose eco-friendly products',
    impact: 'Reduces demand for harmful practices'
  }
];

export default function EndangeredAnimals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSpecies, setSelectedSpecies] = useState<EndangeredSpecies | null>(null);

  const statusOptions = ['All', 'Critically Endangered', 'Endangered', 'Vulnerable', 'Near Threatened'];

  const filteredSpecies = ENDANGERED_SPECIES.filter(species => {
    const matchesSearch = species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         species.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || species.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critically Endangered': return 'bg-red-100 text-red-800 border-red-200';
      case 'Endangered': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Vulnerable': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Near Threatened': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Increasing': return 'text-green-600';
      case 'Stable': return 'text-yellow-600';
      case 'Decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Increasing': return '↗️';
      case 'Stable': return '➡️';
      case 'Decreasing': return '↘️';
      default: return '❓';
    }
  };

  const getPopulationSeverity = (population: number) => {
    if (population < 100) return { color: 'text-red-600', level: 'Critical' };
    if (population < 1000) return { color: 'text-orange-600', level: 'Severe' };
    if (population < 10000) return { color: 'text-yellow-600', level: 'Moderate' };
    return { color: 'text-green-600', level: 'Stable' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Endangered Animals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about endangered species around the world and discover how you can help protect them. Every action counts in preventing extinction.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                      placeholder="Search species or region..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((status) => (
                    <EcoButton
                      key={status}
                      variant={selectedStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(status)}
                      className={selectedStatus === status ? 
                        "bg-gradient-to-r from-red-500 to-orange-500" : ""
                      }
                    >
                      {status}
                    </EcoButton>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Species Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {filteredSpecies.map((species, index) => {
            const populationSeverity = getPopulationSeverity(species.population);
            
            return (
              <motion.div
                key={species.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-red-300"
                  onClick={() => setSelectedSpecies(species)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-red-800">{species.name}</CardTitle>
                        <p className="text-sm text-gray-600 italic">{species.scientificName}</p>
                      </div>
                      <Badge className={getStatusColor(species.status)}>
                        {species.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Population</span>
                        <p className={`text-lg font-bold ${populationSeverity.color}`}>
                          {species.population.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Trend</span>
                        <p className={`text-sm font-medium ${getTrendColor(species.populationTrend)}`}>
                          {getTrendIcon(species.populationTrend)} {species.populationTrend}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Habitat</span>
                      </div>
                      <p className="text-sm text-gray-600">{species.habitat}</p>
                      <p className="text-xs text-gray-500">{species.region}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Main Threats
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {species.threats.slice(0, 2).map((threat, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-red-50 text-red-700">
                            {threat}
                          </Badge>
                        ))}
                        {species.threats.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{species.threats.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {species.lastSeen && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Last spotted: {species.lastSeen}
                      </div>
                    )}

                    <EcoButton 
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500"
                      size="sm"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Learn More
                    </EcoButton>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Species View */}
        {selectedSpecies && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-red-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-red-800 flex items-center gap-2">
                      <Heart className="h-6 w-6" />
                      {selectedSpecies.name}
                    </CardTitle>
                    <p className="text-gray-600 italic">{selectedSpecies.scientificName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedSpecies.status)}>
                      {selectedSpecies.status}
                    </Badge>
                    <EcoButton
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSpecies(null)}
                    >
                      Close
                    </EcoButton>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Population Status</h4>
                      <div className="text-3xl font-bold text-red-600 mb-1">
                        {selectedSpecies.population.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${getTrendColor(selectedSpecies.populationTrend)}`}>
                        {getTrendIcon(selectedSpecies.populationTrend)} {selectedSpecies.populationTrend}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Habitat & Range</h4>
                      <p className="text-sm text-gray-600 mb-1">{selectedSpecies.habitat}</p>
                      <p className="text-xs text-gray-500">{selectedSpecies.region}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Major Threats
                    </h4>
                    <div className="space-y-2">
                      {selectedSpecies.threats.map((threat, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-800">{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      Conservation Efforts
                    </h4>
                    <div className="space-y-2">
                      {selectedSpecies.conservation.map((effort, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-800">{effort}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Conservation Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {CONSERVATION_ACTIONS.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <action.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <Badge variant="secondary" className="bg-red-50 text-red-700 text-xs">
                    {action.impact}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Extinction Crisis Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-600 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingDown className="h-6 w-6" />
                Extinction Crisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">1M</div>
                  <p className="text-red-100">species threatened with extinction</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">1000x</div>
                  <p className="text-red-100">faster extinction rate than natural</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">25%</div>
                  <p className="text-red-100">of plant and animal species at risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
