import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { parseSmartSearch } from '../services/geminiService';
import { AISearchResult } from '../types';

interface AISearchBarProps {
  onSearch: (result: AISearchResult) => void;
}

const AISearchBar: React.FC<AISearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await parseSmartSearch(query);
      onSearch(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-30 group-hover:opacity-100 transition duration-500 blur-md"></div>
        
        {/* Main container */}
        <div className="relative bg-white rounded-full flex items-center p-1.5 shadow-xl border border-white/20">
          <div className="pl-3 pr-2">
             {loading ? <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /> : <Sparkles className="w-5 h-5 text-indigo-600" />}
          </div>
          
          <input
            type="text"
            className="flex-1 py-2 px-2 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base focus:ring-0 appearance-none"
            placeholder="Describe what you need... 'Cheap room near engineering with AC'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-105 flex-shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 text-center">
            <p className="text-xs text-indigo-100/80 font-medium tracking-wide">
                Powered by Gemini • Try natural language
            </p>
        </div>
      </form>
    </div>
  );
};

export default AISearchBar;