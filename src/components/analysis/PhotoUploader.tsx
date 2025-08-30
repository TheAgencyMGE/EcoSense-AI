import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploaderProps {
  onImageSelect: (file: File) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

export function PhotoUploader({ onImageSelect, isAnalyzing, disabled }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <Card className="overflow-hidden border-2 border-primary/20 shadow-eco">
              <CardContent className="p-0 relative">
                <img 
                  src={preview} 
                  alt="Selected for analysis"
                  className="w-full h-64 object-cover"
                />
                {!isAnalyzing && (
                  <EcoButton
                    variant="destructive"
                    size="icon"
                    onClick={clearPreview}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </EcoButton>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-pulse-glow bg-white/90 rounded-lg p-4">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-sm font-medium text-eco-dark">Analyzing environmental impact...</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card
              className={`border-2 border-dashed transition-all duration-300 ${
                dragOver 
                  ? 'border-primary bg-eco-light shadow-glow' 
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-eco-light/50'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <CardContent className="p-8 text-center">
                <motion.div
                  animate={dragOver ? { scale: 1.05 } : { scale: 1 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-eco rounded-full flex items-center justify-center shadow-glow">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Upload Image for Analysis
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop an image here, or click to select a file
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, WebP • Max size: 10MB
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <EcoButton
                variant="eco"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex-1 max-w-xs"
              >
                <Upload className="h-5 w-5" />
                Choose File
              </EcoButton>

              <EcoButton
                variant="earth"
                size="lg"
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled}
                className="flex-1 max-w-xs"
              >
                <Camera className="h-5 w-5" />
                Take Photo
              </EcoButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}