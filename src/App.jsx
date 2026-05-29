/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import ImageUploader from './components/ImageUploader';
import ResultsView from './components/ResultsView';
import LoadingOverlay from './components/LoadingOverlay';
import { Sprout } from 'lucide-react';

const titleTranslation = {
  English: 'Soil & Crop Classifier',
  Hindi: 'मिट्टी और फसल क्लासिफायर',
  Odia: 'ମୃତ୍ତିକା ଏବଂ ଫସଲ କ୍ଲାସିଫାୟର୍'
};

const subtitleTranslation = {
  English: 'Take a photo of your land to discover its soil type and get the best crop recommendations.',
  Hindi: 'अपनी भूमि की मिट्टी का प्रकार जानने और सर्वोत्तम फसल सिफारिशें प्राप्त करने के लिए उसकी एक तस्वीर लें।',
  Odia: 'ଆପଣଙ୍କ ଜମିର ମୃତ୍ତିକା ପ୍ରକାର ଜାଣିବାକୁ ଏବଂ ସର୍ବୋତ୍ତମ ଫସଲ ସୁପାରିଶ ପାଇବାକୁ ଏହାର ଏକ ଚିତ୍ର ନିଅନ୍ତୁ |'
};

export default function App() {
  const [language, setLanguage] = useState('English');
  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelected = async (base64) => {
    setImageBase64(base64);
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify soil type.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImageBase64(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans text-neutral-100 selection:bg-green-500/30 selection:text-green-200 relative z-0">
      {/* Background Image with overlay */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2832&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-[4px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-green-400">
            <Sprout className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-display font-bold text-lg tracking-wide truncate hidden sm:block text-white">AgriTech</span>
          </div>
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {!result && !isAnalyzing && (
          <div className="text-center max-w-2xl mx-auto space-y-6 mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
              {titleTranslation[language]}
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 font-medium leading-relaxed max-w-xl mx-auto">
              {subtitleTranslation[language]}
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm font-medium">
              Error: {error}. Please try again.
            </div>
          )}

          {!imageBase64 && (
            <ImageUploader onImageSelected={handleImageSelected} />
          )}

          {imageBase64 && result && (
            <ResultsView 
              image={imageBase64} 
              result={result} 
              onReset={handleReset}
              language={language}
            />
          )}
        </div>
      </main>

      {isAnalyzing && (
        <LoadingOverlay message={language === 'English' ? 'Analyzing soil...' : (language === 'Hindi' ? 'मिट्टी का विश्लेषण...' : 'ମୃତ୍ତିକା ବିଶ୍ଳେଷଣ କରୁଛି...')} />
      )}
    </div>
  );
}
