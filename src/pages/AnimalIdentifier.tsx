import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Search, 
  MapPin, 
  Info,
  Heart,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { EnvironmentalAIService } from '@/services/environmentalAI';

interface Animal {
  name: string;
  scientificName: string;
  type: string;
  habitat: string;
  conservationStatus: string;
  facts: string[];
  threats: string[];
  howToHelp: string[];
  diet: string;
  size: string;
  confidence: number;
}

export default function AnimalIdentifier() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Animal | null>(null);
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
      const result = await aiService.identifyAnimal(file);
      
      if (result.identified) {
        const animal: Animal = {
          name: result.species.name,
          scientificName: result.species.scientificName,
          type: result.species.type,
          habitat: result.habitat,
          conservationStatus: result.species.conservationStatus,
          facts: result.facts,
          threats: result.threats,
          howToHelp: result.howToHelp,
          diet: result.diet,
          size: result.size,
          confidence: result.species.confidence
        };
        
        setAnalysisResult(animal);
        
        toast({
          title: "Animal identified!",
          description: `Found ${result.species.name} with ${result.species.confidence}% confidence`,
        });
      } else {
        toast({
          title: "No animal detected",
          description: "Try uploading a clearer image of an animal or wildlife",
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
      case 'Critically Endangered':
      case 'Endangered':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Vulnerable':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Near Threatened':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
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
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Animal Identifier
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload photos of wildlife to instantly identify species and learn about their conservation status, habitat, and how you can help protect them.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-dashed border-green-200 bg-green-50/50">
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
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="h-10 w-10 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Upload Animal Photo
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Take or upload a photo of any animal for instant AI identification
                      </p>
                      <EcoButton
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
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
                      alt="Uploaded animal"
                      className="max-w-md max-h-64 mx-auto rounded-lg shadow-md object-cover"
                    />
                    <div className="flex gap-2 justify-center">
                      <EcoButton
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {isAnalyzing ? 'Analyzing...' : 'Identify Animal'}
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
            <Card className="border-green-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
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
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="italic">{analysisResult.scientificName}</span>
                  <Badge variant="outline">{analysisResult.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Habitat
                  </h4>
                  <p className="text-gray-700">{analysisResult.habitat}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Interesting Facts
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.facts.map((fact, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Current Threats
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.threats.map((threat, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-50 text-orange-700">
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

                {analysisResult.diet && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-orange-500" />
                      Diet
                    </h4>
                    <p className="text-gray-700">{analysisResult.diet}</p>
                  </div>
                )}

                {analysisResult.size && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-purple-500" />
                      Size
                    </h4>
                    <p className="text-gray-700">{analysisResult.size}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Wildlife Conservation Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="h-6 w-6" />
                Wildlife Conservation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Protect Habitats</h4>
                  <ul className="space-y-2 text-green-100">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                      Support protected areas and parks
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                      Create wildlife-friendly gardens
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                      Avoid using pesticides
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Responsible Wildlife Viewing</h4>
                  <ul className="space-y-2 text-green-100">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                      Observe from a safe distance
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                      Don't feed wild animals
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                      Report injured or distressed wildlife
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
