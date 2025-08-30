import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Camera, 
  Search, 
  BarChart3, 
  Menu, 
  X,
  Sparkles,
  Waves,
  Trees,
  Heart,
  ChefHat,
  Calculator,
  Droplets,
  Car,
  Lightbulb,
  ChevronDown,
  Home
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useSessionTracker } from '@/hooks/useSessionTracker';

const NAVIGATION_CATEGORIES = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
    description: 'EcoSense AI Dashboard'
  },
  {
    label: 'Conservation',
    icon: Heart,
    items: [
      {
        path: '/ocean-scanner',
        label: 'Ocean Scanner',
        icon: Waves,
        description: 'Marine life identification'
      },
      {
        path: '/endangered-animals',
        label: 'Wildlife Protection',
        icon: Heart,
        description: 'Protect endangered species'
      },
      {
        path: '/forest-health-monitor',
        label: 'Forest Monitor',
        icon: Trees,
        description: 'Track forest health'
      }
    ]
  },
  {
    label: 'Sustainable Living',
    icon: Leaf,
    items: [
      {
        path: '/food-waste-reducer',
        label: 'Food Waste',
        icon: ChefHat,
        description: 'Reduce food waste'
      },
      {
        path: '/green-home-tips',
        label: 'Green Home',
        icon: Home,
        description: 'Eco-friendly home tips'
      },
      {
        path: '/energy-optimizer',
        label: 'Energy Optimizer',
        icon: Lightbulb,
        description: 'Optimize energy usage'
      }
    ]
  },
  {
    label: 'Calculators',
    icon: Calculator,
    items: [
      {
        path: '/carbon-footprint-calculator',
        label: 'Carbon Footprint',
        icon: BarChart3,
        description: 'Calculate emissions'
      },
      {
        path: '/water-usage-tracker',
        label: 'Water Usage',
        icon: Droplets,
        description: 'Track water consumption'
      },
      {
        path: '/sustainable-transport-optimizer',
        label: 'Transport',
        icon: Car,
        description: 'Eco-friendly travel'
      }
    ]
  },
  {
    label: 'AI Tools',
    icon: Sparkles,
    items: [
      {
        path: '/photo-analyzer',
        label: 'Photo Analysis',
        icon: Camera,
        description: 'Analyze environmental images'
      },
      {
        path: '/animal-identifier',
        label: 'Animal ID',
        icon: Search,
        description: 'Identify wildlife'
      },
      {
        path: '/climate-monitor',
        label: 'Climate Data',
        icon: BarChart3,
        description: 'Real-time climate info'
      }
    ]
  }
];

export function NavigationBar() {
  const location = useLocation();
  const { hasAnalyses, session } = useSessionTracker();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isActiveCategory = (category: any) => {
    if (category.path) {
      return isActivePath(category.path);
    }
    if (category.items) {
      return category.items.some((item: any) => isActivePath(item.path));
    }
    return false;
  };

  // Flatten navigation items for search
  const getAllNavigationItems = () => {
    const items: Array<{
      path: string;
      label: string;
      icon: any;
      description: string;
      category: string;
    }> = [];

    NAVIGATION_CATEGORIES.forEach(category => {
      if (category.path) {
        items.push({
          path: category.path,
          label: category.label,
          icon: category.icon,
          description: category.description,
          category: category.label
        });
      } else if (category.items) {
        category.items.forEach(item => {
          items.push({
            path: item.path,
            label: item.label,
            icon: item.icon,
            description: item.description,
            category: category.label
          });
        });
      }
    });

    return items;
  };

  const filteredItems = getAllNavigationItems().filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:block sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-eco rounded-xl flex items-center justify-center shadow-glow">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-eco bg-clip-text text-transparent">
                  EcoSense AI
                </h1>
                <p className="text-xs text-muted-foreground">Environmental Intelligence</p>
              </div>
            </Link>

            {/* Navigation Links with Dropdowns */}
            <div className="flex items-center gap-1">
              {NAVIGATION_CATEGORIES.map((category) => (
                <div key={category.label} className="relative group">
                  {category.path ? (
                    <Link to={category.path}>
                      <EcoButton
                        variant={isActivePath(category.path) ? "eco" : "ghost"}
                        size="sm"
                        className={`transition-all duration-300 ${
                          isActivePath(category.path) 
                            ? 'shadow-eco' 
                            : 'hover:bg-eco-light hover:text-eco-dark'
                        }`}
                      >
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </EcoButton>
                    </Link>
                  ) : (
                    <>
                      <EcoButton
                        variant={isActiveCategory(category) ? "eco" : "ghost"}
                        size="sm"
                        className={`transition-all duration-300 ${
                          isActiveCategory(category) 
                            ? 'shadow-eco' 
                            : 'hover:bg-eco-light hover:text-eco-dark'
                        }`}
                        onClick={() => handleDropdownToggle(category.label)}
                      >
                        <category.icon className="h-4 w-4" />
                        {category.label}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </EcoButton>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === category.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        >
                          {category.items?.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setOpenDropdown(null)}
                              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                                isActivePath(item.path) ? 'bg-eco-light' : ''
                              }`}
                            >
                              <item.icon className="h-5 w-5 text-gray-600" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
                {searchQuery && filteredItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {filteredItems.slice(0, 5).map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <item.icon className="h-4 w-4 text-gray-600" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.category} • {item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Session Status */}
              {hasAnalyses && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Session: {session.analyses.length} analyses</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-eco rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-eco bg-clip-text text-transparent">
                EcoSense AI
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Session Counter */}
              {hasAnalyses && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{session.analyses.length}</span>
                </div>
              )}

              {/* Mobile Menu Button */}
              <EcoButton
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </EcoButton>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/40 bg-background/95 backdrop-blur"
            >
              <div className="py-4 space-y-2">
                {/* Mobile Search */}
                <div className="px-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Mobile Navigation Items */}
                {NAVIGATION_CATEGORIES.map((category) => (
                  <div key={category.label}>
                    {category.path ? (
                      <Link to={category.path} onClick={closeMobileMenu}>
                        <div className={`flex items-center gap-3 p-3 mx-4 rounded-lg transition-all duration-300 ${
                          isActivePath(category.path) 
                            ? 'bg-gradient-eco text-white shadow-eco' 
                            : 'hover:bg-eco-light'
                        }`}>
                          <category.icon className="h-5 w-5" />
                          <div className="flex-1">
                            <div className="font-medium">{category.label}</div>
                            <div className={`text-xs ${
                              isActivePath(category.path) ? 'text-white/80' : 'text-muted-foreground'
                            }`}>
                              {category.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <>
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <category.icon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </div>
                        {category.items?.map((item) => (
                          <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                            <div className={`flex items-center gap-3 p-3 mx-4 ml-8 rounded-lg transition-all duration-300 ${
                              isActivePath(item.path) 
                                ? 'bg-gradient-eco text-white shadow-eco' 
                                : 'hover:bg-eco-light'
                            }`}>
                              <item.icon className="h-4 w-4" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className={`text-xs ${
                                  isActivePath(item.path) ? 'text-white/80' : 'text-muted-foreground'
                                }`}>
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </>
  );
}