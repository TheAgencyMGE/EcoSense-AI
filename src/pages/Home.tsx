import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Search, 
  BarChart3, 
  Sparkles, 
  Leaf, 
  Globe, 
  ArrowRight,
  Zap,
  Users,
  Target,
  Heart,
  Trees,
  Waves,
  Calculator,
  Droplets,
  ChefHat,
  Home as HomeIcon,
  Lightbulb,
  Car
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FEATURE_CATEGORIES = [
  {
    title: 'Conservation Tools',
    icon: Heart,
    description: 'Protect wildlife and ecosystems',
    color: 'from-red-500 to-pink-500',
    features: [
      { name: 'Ocean Scanner', icon: Waves, path: '/ocean-scanner' },
      { name: 'Wildlife Protection', icon: Heart, path: '/endangered-animals' },
      { name: 'Forest Monitor', icon: Trees, path: '/forest-health-monitor' }
    ]
  },
  {
    title: 'Sustainable Living',
    icon: Leaf,
    description: 'Make your lifestyle more eco-friendly',
    color: 'from-green-500 to-emerald-500',
    features: [
      { name: 'Food Waste Reducer', icon: ChefHat, path: '/food-waste-reducer' },
      { name: 'Green Home Tips', icon: HomeIcon, path: '/green-home-tips' },
      { name: 'Energy Optimizer', icon: Lightbulb, path: '/energy-optimizer' }
    ]
  },
  {
    title: 'Environmental Calculators',
    icon: Calculator,
    description: 'Measure and track your impact',
    color: 'from-blue-500 to-cyan-500',
    features: [
      { name: 'Carbon Footprint', icon: BarChart3, path: '/carbon-footprint-calculator' },
      { name: 'Water Usage', icon: Droplets, path: '/water-usage-tracker' },
      { name: 'Eco Transport', icon: Car, path: '/sustainable-transport-optimizer' }
    ]
  },
  {
    title: 'AI Analysis Tools',
    icon: Sparkles,
    description: 'Powered by advanced AI technology',
    color: 'from-purple-500 to-indigo-500',
    features: [
      { name: 'Photo Analysis', icon: Camera, path: '/photo-analyzer' },
      { name: 'Animal Identifier', icon: Search, path: '/animal-identifier' },
      { name: 'Climate Monitor', icon: BarChart3, path: '/climate-monitor' }
    ]
  }
];

const STATS = [
  { label: 'Environmental Features', value: '12+', icon: Zap },
  { label: 'Species Tracked', value: '500+', icon: Heart },
  { label: 'Eco Tips Available', value: '100+', icon: Leaf },
  { label: 'Conservation Actions', value: '50+', icon: Target }
];

const QUICK_ACTIONS = [
  {
    title: 'Ocean Scanner',
    description: 'Identify marine life and learn conservation',
    icon: Waves,
    to: '/ocean-scanner',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Food Waste Reducer',
    description: 'Transform leftovers into delicious meals',
    icon: ChefHat,
    to: '/food-waste-reducer',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'Carbon Calculator',
    description: 'Calculate your environmental footprint',
    icon: Calculator,
    to: '/carbon-footprint-calculator',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Photo Analyzer',
    description: 'AI-powered environmental analysis',
    icon: Camera,
    to: '/photo-analyzer',
    gradient: 'from-purple-500 to-indigo-500'
  }
];

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <Badge 
              variant="secondary" 
              className="mb-4 bg-green-100 text-green-700 border-green-200 animate-pulse"
            >
              🌍 Complete Environmental Platform
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-eco bg-clip-text text-transparent">
              EcoSense AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive environmental platform with 12+ tools for conservation, sustainability, and climate action. 
            Powered by AI to help you make informed decisions for our planet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/ocean-scanner">
              <EcoButton size="xl" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 group">
                <Waves className="h-6 w-6" />
                Explore Ocean Scanner
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </EcoButton>
            </Link>
            
            <Link to="/carbon-footprint-calculator">
              <EcoButton variant="outline" size="xl" className="border-green-300 text-green-700 hover:bg-green-50">
                <Calculator className="h-6 w-6" />
                Calculate Impact
              </EcoButton>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <Card className="border-primary/20 hover:shadow-eco transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Start Your Eco Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose how you'd like to analyze your environmental impact and discover sustainable alternatives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {QUICK_ACTIONS.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Link to={action.to}>
                <Card className="h-full border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:scale-105 group cursor-pointer">
                  <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                    <div>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-glow`}>
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{action.title}</h3>
                      <p className="text-muted-foreground mb-6">{action.description}</p>
                    </div>
                    <EcoButton 
                      size="lg" 
                      className="w-full group-hover:scale-105 transition-transform"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </EcoButton>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Categories */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Complete Environmental Toolkit</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore our comprehensive suite of tools designed to help you make a positive environmental impact
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {FEATURE_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              onHoverStart={() => setHoveredCategory(index)}
              onHoverEnd={() => setHoveredCategory(null)}
            >
              <Card className={`h-full transition-all duration-300 ${
                hoveredCategory === index ? 'shadow-xl scale-105' : 'hover:shadow-lg'
              }`}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.features.map((feature) => (
                      <Link key={feature.name} to={feature.path}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                          <feature.icon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                          <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                            {feature.name}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12">
              <Globe className="h-16 w-16 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl font-bold mb-4">
                Join the Environmental Revolution
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Every action counts. Use our comprehensive platform to make informed environmental decisions, 
                protect wildlife, reduce waste, and create a sustainable future for generations to come.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/ocean-scanner">
                  <EcoButton variant="eco" size="xl" className="text-white">
                    <Waves className="h-5 w-5" />
                    Start Ocean Conservation
                  </EcoButton>
                </Link>
                <Link to="/carbon-footprint-calculator">
                  <EcoButton variant="earth" size="xl" className="text-white">
                    <Calculator className="h-5 w-5" />
                    Calculate Your Impact
                  </EcoButton>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}