import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoadingOverlay({ message = "Analyzing soil composition..." }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-neutral-900/90 border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full mx-4 text-center">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        <h3 className="text-lg font-semibold text-white">{message}</h3>
        <p className="text-sm text-neutral-400">
          Our AI model is processing the visual characteristics of your land. This may take a few seconds.
        </p>
      </div>
    </motion.div>
  );
}
