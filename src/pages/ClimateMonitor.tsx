import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Cloud, 
  Wind, 
  Droplets, 
  Sun,
  CloudRain,
  AlertTriangle,
  TrendingUp,
  Globe,
  Activity,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { EnvironmentalAIService } from '@/services/environmentalAI';

interface ClimateData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  airQuality: number;
  uvIndex: number;
  pressure: number;
  visibility: number;
}

interface ClimateAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

const MOCK_CLIMATE_DATA: ClimateData = {
  temperature: 24.5,
  humidity: 65,
  windSpeed: 12.3,
  precipitation: 2.1,
  airQuality: 78,
  uvIndex: 6,
  pressure: 1013.2,
  visibility: 8.5
};

const MOCK_ALERTS: ClimateAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Heat Wave Warning',
    description: 'Temperatures expected to reach 35°C+ for the next 3 days. Stay hydrated and avoid prolonged sun exposure.',
    severity: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'watch',
    title: 'Air Quality Watch',
    description: 'Moderate air quality due to increased particulate matter. Sensitive individuals should limit outdoor activities.',
    severity: 'medium',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: '3',
    type: 'advisory',
    title: 'UV Index Advisory',
    description: 'High UV levels expected today. Use SPF 30+ sunscreen and seek shade during peak hours.',
    severity: 'medium',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
];

export default function ClimateMonitor() {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [location, setLocation] = useState<{lat: number, lon: number, name: string} | null>(null);
  const { toast } = useToast();
  const aiService = new EnvironmentalAIService();

  useEffect(() => {
    // Get user's location and fetch weather data
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude, name: 'Your Location' });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default location (London)
          const defaultLat = 51.5074;
          const defaultLon = -0.1278;
          setLocation({ lat: defaultLat, lon: defaultLon, name: 'London, UK' });
          fetchWeatherData(defaultLat, defaultLon);
          toast({
            title: "Location access denied",
            description: "Using default location. Grant location access for local weather data.",
            variant: "destructive"
          });
        }
      );
    } else {
      // Fallback to default location
      const defaultLat = 51.5074;
      const defaultLon = -0.1278;
      setLocation({ lat: defaultLat, lon: defaultLon, name: 'London, UK' });
      fetchWeatherData(defaultLat, defaultLon);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      // Fetch weather data
      const weatherData = await aiService.getWeatherData(lat, lon);
      
      // Fetch air quality data
      const airQualityData = await aiService.getAirQualityData(lat, lon);
      
      // Process and set the data
      const processedData: ClimateData = {
        temperature: Math.round(weatherData.main.temp * 10) / 10,
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6 * 10) / 10, // Convert m/s to km/h
        precipitation: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
        airQuality: airQualityData.list[0].main.aqi * 20, // Convert to 0-100 scale
        uvIndex: 0, // UV index not available in free tier, set to 0
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility / 1000 // Convert to km
      };

      setClimateData(processedData);
      
      // Generate climate alerts based on weather conditions
      const generatedAlerts = generateWeatherAlerts(weatherData, airQualityData);
      setAlerts(generatedAlerts);
      
      setLastUpdated(new Date());
      
      toast({
        title: "Weather data updated",
        description: `Data refreshed for ${location?.name || 'your location'}`,
      });
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Failed to fetch weather data",
        description: "Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateWeatherAlerts = (weatherData: any, airQualityData: any): ClimateAlert[] => {
    const alerts: ClimateAlert[] = [];
    
    // Temperature alerts
    if (weatherData.main.temp > 30) {
      alerts.push({
        id: 'temp-high',
        type: 'warning',
        title: 'High Temperature Alert',
        description: `Temperature is ${Math.round(weatherData.main.temp)}°C. Stay hydrated and avoid prolonged sun exposure.`,
        severity: weatherData.main.temp > 35 ? 'high' : 'medium',
        timestamp: new Date()
      });
    } else if (weatherData.main.temp < 0) {
      alerts.push({
        id: 'temp-low',
        type: 'warning',
        title: 'Freezing Temperature Alert',
        description: `Temperature is ${Math.round(weatherData.main.temp)}°C. Dress warmly and be cautious of icy conditions.`,
        severity: 'medium',
        timestamp: new Date()
      });
    }

    // Air quality alerts
    const aqi = airQualityData.list[0].main.aqi;
    if (aqi >= 4) {
      alerts.push({
        id: 'air-quality',
        type: 'warning',
        title: 'Poor Air Quality Alert',
        description: 'Air quality is poor. Limit outdoor activities and consider wearing a mask.',
        severity: 'high',
        timestamp: new Date()
      });
    } else if (aqi >= 3) {
      alerts.push({
        id: 'air-quality',
        type: 'advisory',
        title: 'Moderate Air Quality Advisory',
        description: 'Air quality is moderate. Sensitive individuals should limit prolonged outdoor exertion.',
        severity: 'medium',
        timestamp: new Date()
      });
    }

    // Wind alerts
    if (weatherData.wind.speed > 10) {
      alerts.push({
        id: 'wind',
        type: 'advisory',
        title: 'High Wind Advisory',
        description: `Wind speed is ${Math.round(weatherData.wind.speed * 3.6)} km/h. Be cautious when driving or walking outdoors.`,
        severity: 'medium',
        timestamp: new Date()
      });
    }

    return alerts;
  };

  const refreshData = async () => {
    if (location) {
      await fetchWeatherData(location.lat, location.lon);
    }
  };

  const getAirQualityStatus = (aqi: number) => {
    if (aqi >= 80) return { status: 'Good', color: 'text-green-600', bg: 'bg-green-100' };
    if (aqi >= 60) return { status: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (aqi >= 40) return { status: 'Unhealthy for Sensitive', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getUVStatus = (uvIndex: number) => {
    if (uvIndex <= 2) return { status: 'Low', color: 'text-green-600' };
    if (uvIndex <= 5) return { status: 'Moderate', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { status: 'High', color: 'text-orange-600' };
    if (uvIndex <= 10) return { status: 'Very High', color: 'text-red-600' };
    return { status: 'Extreme', color: 'text-purple-600' };
  };

  const getAlertColor = (type: string, severity: string) => {
    if (severity === 'high') return 'border-red-500 bg-red-50';
    if (severity === 'medium') return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  const airQuality = climateData ? getAirQualityStatus(climateData.airQuality) : null;
  const uvStatus = climateData ? getUVStatus(climateData.uvIndex) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Climate Monitor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time climate data monitoring with environmental alerts and trend analysis to help you stay informed about local conditions.
          </p>
          {location && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              {location.name}
            </div>
          )}
        </motion.div>

        {/* Current Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Current Conditions
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Local Area
                  </div>
                  <EcoButton
                    onClick={refreshData}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </EcoButton>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </CardHeader>
            <CardContent>
              {!climateData && isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading weather data...</span>
                </div>
              ) : climateData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Thermometer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {climateData.temperature.toFixed(1)}°C
                    </div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>

                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <Droplets className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-cyan-600">
                      {climateData.humidity}%
                    </div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Wind className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-600">
                      {climateData.windSpeed.toFixed(1)} km/h
                    </div>
                    <div className="text-sm text-gray-600">Wind Speed</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <CloudRain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {climateData.precipitation.toFixed(1)} mm
                    </div>
                    <div className="text-sm text-gray-600">Precipitation</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <span className="ml-2 text-gray-600">Unable to load weather data</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Air Quality & UV Index */}
        {climateData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Air Quality Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{climateData.airQuality}</span>
                    {airQuality && (
                      <Badge className={`${airQuality.bg} ${airQuality.color}`}>
                        {airQuality.status}
                      </Badge>
                    )}
                  </div>
                  <Progress value={climateData.airQuality} className="h-3" />
                  <div className="text-sm text-gray-600">
                    Air quality is measured on a scale of 0-100, where higher values indicate better air quality.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  UV Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{climateData.uvIndex}</span>
                    {uvStatus && (
                      <Badge className={`${uvStatus.color}`} variant="secondary">
                        {uvStatus.status}
                      </Badge>
                    )}
                  </div>
                  <Progress value={(climateData.uvIndex / 11) * 100} className="h-3" />
                  <div className="text-sm text-gray-600">
                    UV Index ranges from 0-11+. Higher values require more sun protection.
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Climate Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Climate Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type, alert.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {alert.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {alert.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Metrics */}
        {climateData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle>Additional Environmental Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100 mb-1">
                      {climateData.pressure.toFixed(1)} hPa
                    </div>
                    <div className="text-blue-200 text-sm">Atmospheric Pressure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100 mb-1">
                      {climateData.visibility.toFixed(1)} km
                    </div>
                    <div className="text-blue-200 text-sm">Visibility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100 mb-1">
                      {Math.round(climateData.windSpeed * 0.621371)} mph
                    </div>
                    <div className="text-blue-200 text-sm">Wind Speed (mph)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-100 mb-1">
                      {Math.round(climateData.temperature * 9/5 + 32)}°F
                    </div>
                    <div className="text-blue-200 text-sm">Temperature (°F)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
