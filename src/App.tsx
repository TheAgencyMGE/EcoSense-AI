import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Home from "./pages/Home.tsx";
import PhotoAnalyzer from "./pages/PhotoAnalyzer.tsx";
import ActivityScanner from "./pages/ActivityScanner.tsx";
import SessionOverview from "./pages/SessionOverview.tsx";
import Recommendations from "./pages/Recommendations.tsx";
import NotFound from "./pages/NotFound.tsx";
import OceanScanner from "./pages/OceanScanner.tsx";
import FoodWasteReducer from "./pages/FoodWasteReducer.tsx";
import ForestHealthMonitor from "./pages/ForestHealthMonitor.tsx";
import EndangeredAnimals from "./pages/EndangeredAnimals.tsx";
import AnimalIdentifier from "./pages/AnimalIdentifier.tsx";
import CarbonFootprintCalculator from "./pages/CarbonFootprintCalculator.tsx";
import WaterUsageTracker from "./pages/WaterUsageTracker.tsx";
import SustainableTransportOptimizer from "./pages/SustainableTransportOptimizer.tsx";
import EnergyOptimizer from "./pages/EnergyOptimizer.tsx";
import GreenHomeTips from "./pages/GreenHomeTips.tsx";
import ClimateMonitor from "./pages/ClimateMonitor.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  // Auto-scroll to top on route change
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gradient-sky">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Ocean Protection */}
        <Route path="/ocean-scanner" element={<OceanScanner />} />
        
        {/* Wildlife Conservation */}
        <Route path="/endangered-animals" element={<EndangeredAnimals />} />
        <Route path="/animal-identifier" element={<AnimalIdentifier />} />
        
        {/* Forest Conservation */}
        <Route path="/forest-health-monitor" element={<ForestHealthMonitor />} />
        
        {/* Sustainable Living */}
        <Route path="/food-waste-reducer" element={<FoodWasteReducer />} />
        <Route path="/carbon-footprint-calculator" element={<CarbonFootprintCalculator />} />
        <Route path="/water-usage-tracker" element={<WaterUsageTracker />} />
        <Route path="/sustainable-transport-optimizer" element={<SustainableTransportOptimizer />} />
        <Route path="/energy-optimizer" element={<EnergyOptimizer />} />
        <Route path="/green-home-tips" element={<GreenHomeTips />} />
      
        
        {/* Analysis Tools */}
        <Route path="/photo-analyzer" element={<PhotoAnalyzer />} />
        <Route path="/activity-scanner" element={<ActivityScanner />} />
        <Route path="/climate-monitor" element={<ClimateMonitor />} />
        <Route path="/session-overview" element={<SessionOverview />} />
        <Route path="/recommendations" element={<Recommendations />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
