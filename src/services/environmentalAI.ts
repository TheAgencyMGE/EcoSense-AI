import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnvironmentalAnalysis, UserContext, EcoAlternative, ActionableStep } from '@/types/environmental';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const VISION_API_KEY = import.meta.env.VITE_VISION_API_KEY;
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export class EnvironmentalAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    });
  }

  async analyzeImage(imageFile: File, userContext?: UserContext): Promise<EnvironmentalAnalysis> {
    try {
      const startTime = Date.now();
      const imageBase64 = await this.fileToBase64(imageFile);
      
      // First, use Vision API to identify objects in the image
      const visionLabels = await this.getVisionLabels(imageBase64);
      
      // Create enhanced prompt with Vision API insights
      const prompt = this.createImageAnalysisPrompt(userContext, visionLabels);
      
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageFile.type
          }
        }
      ]);

      const response = await result.response;
      const analysis = this.parseAIResponse(response.text(), 'photo', 'Image upload', Date.now() - startTime);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  async analyzeActivity(activityDescription: string, userContext?: UserContext): Promise<EnvironmentalAnalysis> {
    try {
      const startTime = Date.now();
      const prompt = this.createActivityAnalysisPrompt(activityDescription, userContext);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = this.parseAIResponse(response.text(), 'activity', activityDescription, Date.now() - startTime);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing activity:', error);
      throw new Error('Failed to analyze activity. Please try again.');
    }
  }

  async generateEcoAlternatives(currentItem: string, userContext?: UserContext): Promise<EcoAlternative[]> {
    try {
      const prompt = this.createAlternativesPrompt(currentItem, userContext);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return this.parseAlternatives(response.text());
    } catch (error) {
      console.error('Error generating alternatives:', error);
      return [];
    }
  }

  async generatePersonalizedPlan(analyses: EnvironmentalAnalysis[], userContext?: UserContext): Promise<ActionableStep[]> {
    try {
      const prompt = this.createPersonalizedPlanPrompt(analyses, userContext);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return this.parseActionSteps(response.text());
    } catch (error) {
      console.error('Error generating plan:', error);
      return [];
    }
  }

  private async getVisionLabels(imageBase64: string): Promise<string[]> {
    try {
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: imageBase64
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
            ]
          }]
        })
      });

      const data = await response.json();
      const labels: string[] = [];

      if (data.responses && data.responses[0]) {
        // Extract labels
        if (data.responses[0].labelAnnotations) {
          labels.push(...data.responses[0].labelAnnotations.map((label: any) => label.description));
        }
        
        // Extract objects
        if (data.responses[0].localizedObjectAnnotations) {
          labels.push(...data.responses[0].localizedObjectAnnotations.map((obj: any) => obj.name));
        }
      }

      return labels;
    } catch (error) {
      console.error('Vision API error:', error);
      return []; // Return empty array if Vision API fails, Gemini will still work
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  private createImageAnalysisPrompt(userContext?: UserContext, visionLabels?: string[]): string {
    const visionInsights = visionLabels && visionLabels.length > 0 
      ? `\n\nDetected objects/labels in image: ${visionLabels.join(', ')}\nUse these insights to provide more accurate environmental analysis.\n` 
      : '';

    return `
As an expert environmental scientist and sustainability analyst, analyze this image for its environmental impact and provide actionable sustainability insights.

User Context: ${JSON.stringify(userContext || {})}${visionInsights}

Analyze the image and provide a comprehensive environmental assessment in the following JSON format:

{
  "carbonFootprint": {
    "amount": number,
    "unit": "kg CO2e" | "g CO2e" | "tonnes CO2e",
    "comparison": "descriptive comparison to everyday items",
    "annualEquivalent": number
  },
  "environmentalImpacts": [
    {
      "category": "carbon" | "water" | "land" | "biodiversity" | "pollution" | "energy",
      "impact": "specific impact description",
      "severity": number (1-10),
      "description": "detailed explanation"
    }
  ],
  "sustainabilityScore": {
    "score": number (0-100),
    "category": "excellent" | "good" | "moderate" | "poor" | "critical",
    "reasoning": "explanation of score",
    "improvements": ["improvement suggestions"]
  },
  "ecoAlternatives": [
    {
      "name": "alternative name",
      "description": "detailed description",
      "impactReduction": number (percentage),
      "accessibility": "high" | "medium" | "low",
      "costComparison": "cost comparison explanation",
      "availabilityScore": number (1-10),
      "environmentalBenefit": "specific environmental benefit"
    }
  ],
  "actionableSteps": [
    {
      "step": "specific action to take",
      "impact": "expected environmental impact",
      "difficulty": "easy" | "medium" | "hard",
      "timeframe": "immediate" | "short-term" | "long-term",
      "resources": ["helpful resources"]
    }
  ],
  "regionalConsiderations": ["location-specific factors"],
  "educationalInsights": "environmental science explanation"
}

Focus on practical, achievable recommendations with measurable environmental benefits.
`;
  }

  private createActivityAnalysisPrompt(activity: string, userContext?: UserContext): string {
    return `
As an expert environmental scientist, analyze this activity/product for environmental impact: "${activity}"

User Context: ${JSON.stringify(userContext || {})}

Provide comprehensive environmental analysis in the same JSON format as image analysis, focusing on:
- Carbon footprint calculation based on scientific data
- Resource consumption (water, energy, materials)
- Environmental impact across lifecycle
- Practical sustainable alternatives
- Actionable improvement steps
- Regional considerations for sustainability

Be specific with numbers and provide scientific reasoning for all assessments.
`;
  }

  private createAlternativesPrompt(item: string, userContext?: UserContext): string {
    return `
Generate 3-5 sustainable alternatives for: "${item}"

User Context: ${JSON.stringify(userContext || {})}

Provide alternatives in JSON array format with focus on:
- Significant environmental impact reduction
- Practical accessibility and availability
- Cost-effectiveness
- Regional availability
- Specific environmental benefits

Include both immediate substitutes and long-term sustainable options.
`;
  }

  private createPersonalizedPlanPrompt(analyses: EnvironmentalAnalysis[], userContext?: UserContext): string {
    const summary = analyses.map(a => ({
      type: a.inputType,
      score: a.sustainabilityScore.score,
      impacts: a.environmentalImpacts.map(i => i.category)
    }));

    return `
Based on these environmental analyses, create a personalized sustainability improvement plan:

Analyses Summary: ${JSON.stringify(summary)}
User Context: ${JSON.stringify(userContext || {})}

Generate 5-8 prioritized action steps focusing on:
- Highest impact improvements first
- User's specific context and constraints
- Mix of easy wins and long-term changes
- Measurable environmental benefits
- Resource links and tools

Provide in JSON array format with actionable steps.
`;
  }

  private parseAIResponse(text: string, inputType: string, description: string, processingTime: number): EnvironmentalAnalysis {
    try {
      // Clean the response text and extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        inputType: inputType as any,
        inputDescription: description,
        carbonFootprint: parsed.carbonFootprint || this.getDefaultCarbonFootprint(),
        environmentalImpacts: parsed.environmentalImpacts || [],
        sustainabilityScore: parsed.sustainabilityScore || this.getDefaultScore(),
        ecoAlternatives: parsed.ecoAlternatives || [],
        actionableSteps: parsed.actionableSteps || [],
        regionalConsiderations: parsed.regionalConsiderations || [],
        educationalInsights: parsed.educationalInsights || 'Environmental impact analysis completed.',
        processingTime
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackAnalysis(inputType, description, processingTime);
    }
  }

  private parseAlternatives(text: string): EcoAlternative[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Error parsing alternatives:', error);
      return [];
    }
  }

  private parseActionSteps(text: string): ActionableStep[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Error parsing action steps:', error);
      return [];
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDefaultCarbonFootprint() {
    return {
      amount: 2.5,
      unit: 'kg CO2e',
      comparison: 'Similar to driving 10 km in a standard car',
      annualEquivalent: 912.5
    };
  }

  private getDefaultScore() {
    return {
      score: 65,
      maxScore: 100,
      category: 'moderate' as const,
      reasoning: 'Moderate environmental impact with room for improvement',
      improvements: ['Consider sustainable alternatives', 'Reduce frequency of use']
    };
  }

  private getFallbackAnalysis(inputType: string, description: string, processingTime: number): EnvironmentalAnalysis {
    return {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      inputType: inputType as any,
      inputDescription: description,
      carbonFootprint: this.getDefaultCarbonFootprint(),
      environmentalImpacts: [
        {
          category: 'carbon',
          impact: 'Moderate carbon emissions',
          severity: 5,
          description: 'This item/activity has a moderate carbon footprint'
        }
      ],
      sustainabilityScore: this.getDefaultScore(),
      ecoAlternatives: [
        {
          name: 'Sustainable Alternative',
          description: 'Consider eco-friendly options available in your area',
          impactReduction: 30,
          accessibility: 'medium',
          costComparison: 'Similar cost with long-term savings',
          availabilityScore: 7,
          environmentalBenefit: 'Reduced carbon footprint and resource consumption'
        }
      ],
      actionableSteps: [
        {
          step: 'Research sustainable alternatives',
          impact: 'Potential 20-30% reduction in environmental impact',
          difficulty: 'easy',
          timeframe: 'immediate',
          resources: ['Local sustainability guides', 'Eco-friendly product directories']
        }
      ],
      regionalConsiderations: ['Check local availability of sustainable options'],
      educationalInsights: 'Every choice has an environmental impact. Small changes can lead to significant improvements over time.',
      processingTime
    };
  }

  // Weather and Climate Data Methods
  async getWeatherData(lat: number, lon: number): Promise<any> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getAirQualityData(lat: number, lon: number): Promise<any> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Air quality API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      throw error;
    }
  }

  async getWeatherForecast(lat: number, lon: number): Promise<any> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather forecast API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }

  // Marine Life and Animal Identification Methods
  async identifyMarineLife(imageFile: File): Promise<any> {
    try {
      const imageBase64 = await this.fileToBase64(imageFile);
      
      // Use Vision API to detect objects/labels
      const visionLabels = await this.getVisionLabels(imageBase64);
      
      // Create specialized prompt for marine life identification
      const prompt = `Analyze this image for marine life identification. Based on the image and these detected elements: ${visionLabels.join(', ')}, identify any marine creatures, coral, or ocean-related objects. Provide detailed information about:

      1. Species identification (common and scientific name)
      2. Conservation status
      3. Habitat information
      4. Current threats
      5. How users can help protect this species
      6. Interesting facts about the creature/ecosystem

      Format the response as JSON with the following structure:
      {
        "identified": true/false,
        "species": {
          "name": "Common name",
          "scientificName": "Scientific name",
          "type": "Fish/Coral/Mammal/etc",
          "conservationStatus": "Status",
          "confidence": 0-100
        },
        "description": "Detailed description",
        "habitat": "Habitat information",
        "threats": ["List of threats"],
        "howToHelp": ["Ways to help protect this species"],
        "facts": ["Interesting facts"],
        "environmentalRole": "Role in ecosystem"
      }`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageFile.type
          }
        }
      ]);

      const response = await result.response;
      return this.parseMarineLifeResponse(response.text());
    } catch (error) {
      console.error('Error identifying marine life:', error);
      throw error;
    }
  }

  async identifyAnimal(imageFile: File): Promise<any> {
    try {
      const imageBase64 = await this.fileToBase64(imageFile);
      
      // Use Vision API to detect objects/labels
      const visionLabels = await this.getVisionLabels(imageBase64);
      
      // Create specialized prompt for animal identification
      const prompt = `Analyze this image for animal identification. Based on the image and these detected elements: ${visionLabels.join(', ')}, identify any animals, birds, insects, or wildlife. Provide detailed information about:

      1. Species identification (common and scientific name)
      2. Animal type (mammal, bird, reptile, etc.)
      3. Habitat information
      4. Conservation status
      5. Current threats
      6. How users can help protect this species
      7. Interesting behavioral facts

      Format the response as JSON with the following structure:
      {
        "identified": true/false,
        "species": {
          "name": "Common name",
          "scientificName": "Scientific name",
          "type": "Mammal/Bird/Reptile/etc",
          "conservationStatus": "Status",
          "confidence": 0-100
        },
        "description": "Detailed description",
        "habitat": "Habitat information",
        "threats": ["List of threats"],
        "howToHelp": ["Ways to help protect this species"],
        "facts": ["Interesting behavioral facts"],
        "diet": "Diet information",
        "size": "Size information"
      }`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageFile.type
          }
        }
      ]);

      const response = await result.response;
      return this.parseAnimalResponse(response.text());
    } catch (error) {
      console.error('Error identifying animal:', error);
      throw error;
    }
  }

  private parseMarineLifeResponse(responseText: string): any {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing marine life response:', error);
      // Return a fallback response
      return {
        identified: false,
        species: {
          name: "Unidentified Marine Life",
          scientificName: "Unknown",
          type: "Unknown",
          conservationStatus: "Unknown",
          confidence: 0
        },
        description: "Unable to identify the marine life in this image.",
        habitat: "Unknown",
        threats: ["Pollution", "Climate change", "Overfishing"],
        howToHelp: ["Reduce plastic use", "Support marine conservation"],
        facts: ["Please try another image with better lighting and clarity"],
        environmentalRole: "All marine life plays important roles in ocean ecosystems"
      };
    }
  }

  private parseAnimalResponse(responseText: string): any {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing animal response:', error);
      // Return a fallback response
      return {
        identified: false,
        species: {
          name: "Unidentified Animal",
          scientificName: "Unknown",
          type: "Unknown",
          conservationStatus: "Unknown",
          confidence: 0
        },
        description: "Unable to identify the animal in this image.",
        habitat: "Unknown",
        threats: ["Habitat loss", "Climate change", "Human interference"],
        howToHelp: ["Protect natural habitats", "Support wildlife conservation"],
        facts: ["Please try another image with better lighting and clarity"],
        diet: "Unknown",
        size: "Unknown"
      };
    }
  }
}

export const environmentalAI = new EnvironmentalAIService();