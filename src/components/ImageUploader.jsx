import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { motion } from 'motion/react';

export default function ImageUploader({ onImageSelected }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 flex flex-col items-center justify-center space-y-8"
    >
      <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center ring-1 ring-green-500/30">
        <UploadCloud className="w-10 h-10" />
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-display font-semibold text-white tracking-tight">Upload Soil Photo</h3>
        <p className="text-sm md:text-base text-neutral-400 max-w-[280px] leading-relaxed">
          Take a clear picture of the land to get perfectly tailored crop recommendations.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-400 text-black py-4 px-6 rounded-2xl font-semibold transition-all active:scale-[0.98] shadow-lg shadow-green-500/20"
        >
          <Camera className="w-5 h-5" />
          <span>Open Camera</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 text-white py-4 px-6 rounded-2xl font-semibold transition-all active:scale-[0.98] border border-white/10"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Choose File</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        capture="environment"
        className="hidden"
      />
    </motion.div>
  );
}
