import { motion } from 'motion/react';
import { ArrowLeft, Leaf, Sprout, Info } from 'lucide-react';

const labels = {
  English: {
    soilType: 'Soil Type',
    why: 'Why this soil?',
    crops: 'Recommended Crops',
    back: 'Check another soil',
  },
  Hindi: {
    soilType: 'मिट्टी का प्रकार',
    why: 'यह मिट्टी क्यों?',
    crops: 'अनुशंसित फसलें',
    back: 'दूसरी मिट्टी जांचें',
  },
  Odia: {
    soilType: 'ମୃତ୍ତିକା ପ୍ରକାର',
    why: 'ଏହି ମୃତ୍ତିକା କାହିଁକି?',
    crops: 'ସୁପାରିଶ କରାଯାଇଥିବା ଫସଲଗୁଡ଼ିକ',
    back: 'ଅନ୍ୟ ମୃତ୍ତିକା ଯାଞ୍ଚ କରନ୍ତୁ |',
  }
};

export default function ResultsView({ image, result, onReset, language }) {
  const currentLabels = labels[language];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pb-20"
    >
      <button 
        onClick={onReset}
        className="flex items-center space-x-2 text-sm font-semibold text-neutral-400 hover:text-white transition-colors bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{currentLabels.back}</span>
      </button>

      <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video md:aspect-[21/9] bg-black relative ring-1 ring-white/5">
        <img 
          src={image} 
          alt="Analyzed Soil" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Info className="w-4 h-4" />
            <span>{currentLabels.soilType}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight leading-none drop-shadow-lg">
            {result.soilType}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-center space-x-4 text-white">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-orange-500/20">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-semibold tracking-tight">{currentLabels.why}</h3>
          </div>
          <p className="text-neutral-300 font-medium leading-relaxed text-lg">
            {result.explanation}
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-center space-x-4 text-white">
            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-green-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-semibold tracking-tight">{currentLabels.crops}</h3>
          </div>
          <ul className="space-y-3">
            {result.recommendedCrops.map((crop, index) => (
              <li 
                key={index}
                className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/5 font-medium text-neutral-200 hover:bg-white/10 transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                <span className="text-lg">{crop}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </motion.div>
  );
}
