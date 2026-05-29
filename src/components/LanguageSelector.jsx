import { Globe } from 'lucide-react';
const LANGUAGES = ['English', 'Hindi', 'Odia'];

export default function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 shadow-sm border border-white/10">
      <Globe className="w-4 h-4 text-neutral-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-transparent text-sm font-medium text-neutral-200 outline-none cursor-pointer appearance-none pr-4 [&>option]:text-black"
        style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%)', backgroundPosition: 'calc(100% - 2px) center, calc(100% - 6px) center', backgroundSize: '4px 4px, 4px 4px', backgroundRepeat: 'no-repeat' }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
}
