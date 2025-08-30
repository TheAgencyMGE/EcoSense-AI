import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Search, 
  Info, 
  MapPin, 
  AlertTriangle,
  Fish,
  Waves,
  Heart,
  Trash2
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { EnvironmentalAIService } from '@/services/environmentalAI';

interface MarineCreature {
  name: string;
  scientificName: string;
  type: string;
  conservationStatus: string;
  threats: string[];
  description: string;
  habitat: string;
  howToHelp: string[];
  facts: string[];
  environmentalRole: string;
  confidence: number;
}

export default function OceanScanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MarineCreature | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const aiService = new EnvironmentalAIService();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || !fileInputRef.current?.files?.[0]) return;
    
    setIsAnalyzing(true);
    
    try {
      const file = fileInputRef.current.files[0];
      const result = await aiService.identifyMarineLife(file);
      
      if (result.identified) {
        const marineCreature: MarineCreature = {
          name: result.species.name,
          scientificName: result.species.scientificName,
          type: result.species.type,
          conservationStatus: result.species.conservationStatus,
          threats: result.threats,
          description: result.description,
          habitat: result.habitat,
          howToHelp: result.howToHelp,
          facts: result.facts,
          environmentalRole: result.environmentalRole,
          confidence: result.species.confidence
        };
        
        setAnalysisResult(marineCreature);
        
        toast({
          title: "Marine creature identified!",
          description: `Found ${result.species.name} with ${result.species.confidence}% confidence`,
        });
      } else {
        toast({
          title: "No marine life detected",
          description: "Try uploading a clearer image of marine life or ocean creatures",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critically Threatened':
      case 'Critically Endangered':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Endangered':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Vulnerable':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
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
              <Waves className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Ocean Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify marine creatures and learn how to protect our oceans. Upload photos of sea life to get instant species identification and conservation insights.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
            <CardContent className="p-8">
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {!selectedImage ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="h-10 w-10 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Upload Marine Life Photo
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Take or upload a photo of marine life for AI-powered identification
                      </p>
                      <EcoButton
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </EcoButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={selectedImage}
                      alt="Uploaded marine life"
                      className="max-w-md max-h-64 mx-auto rounded-lg shadow-md object-cover"
                    />
                    <div className="flex gap-2 justify-center">
                      <EcoButton
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {isAnalyzing ? 'Analyzing...' : 'Identify Species'}
                      </EcoButton>
                      <EcoButton
                        variant="outline"
                        onClick={() => {
                          setSelectedImage(null);
                          setAnalysisResult(null);
                        }}
                      >
                        Upload New Image
                      </EcoButton>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-blue-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
                    <Fish className="h-6 w-6" />
                    {analysisResult.name}
                    {analysisResult.confidence && (
                      <Badge variant="outline" className="ml-2">
                        {analysisResult.confidence}% confidence
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge className={getStatusColor(analysisResult.conservationStatus)}>
                    {analysisResult.conservationStatus}
                  </Badge>
                </div>
                <p className="text-gray-600 italic">{analysisResult.scientificName}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Description
                  </h4>
                  <p className="text-gray-700">{analysisResult.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Habitat
                  </h4>
                  <p className="text-gray-700">{analysisResult.habitat}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Threats
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.threats.map((threat, index) => (
                      <Badge key={index} variant="secondary" className="bg-red-50 text-red-700">
                        {threat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-500" />
                    How You Can Help
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.howToHelp.map((action, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {analysisResult.facts && analysisResult.facts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Interesting Facts
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.facts.map((fact, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.environmentalRole && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Waves className="h-4 w-4 text-teal-500" />
                      Environmental Role
                    </h4>
                    <p className="text-gray-700">{analysisResult.environmentalRole}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Ocean Conservation Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Waves className="h-6 w-6" />
                Ocean Conservation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Reduce Ocean Pollution</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Avoid single-use plastics
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Participate in beach cleanups
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Properly dispose of chemicals
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Support Marine Life</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-center gap-2">
                      <Fish className="h-4 w-4" />
                      Choose sustainable seafood
                    </li>
                    <li className="flex items-center gap-2">
                      <Fish className="h-4 w-4" />
                      Support marine sanctuaries
                    </li>
                    <li className="flex items-center gap-2">
                      <Fish className="h-4 w-4" />
                      Reduce carbon footprint
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
