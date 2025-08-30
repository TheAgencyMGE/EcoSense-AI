
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Leaf } from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="border-2 border-primary/20 shadow-eco bg-gradient-to-br from-background to-eco-light/30">
            <CardContent className="p-12">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-eco rounded-full flex items-center justify-center shadow-glow"
              >
                <Leaf className="h-12 w-12 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-6xl font-bold bg-gradient-eco bg-clip-text text-transparent mb-4">
                  404
                </h1>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Lost in the Digital Forest
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Looks like you've wandered off the sustainable path! 
                  This page doesn't exist, but our environmental mission continues.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <EcoButton 
                  variant="eco" 
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  <Home className="h-5 w-5" />
                  Return Home
                </EcoButton>
                <EcoButton 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go Back
                </EcoButton>
              </motion.div>
            </CardContent>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Continue your eco-journey with AI-powered environmental analysis
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
