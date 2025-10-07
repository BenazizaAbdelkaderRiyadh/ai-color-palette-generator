import React, { useState } from 'react';
import { SparklesIcon } from './Icons';

interface PaletteGeneratorProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('Serene coastal sunrise');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        Generate Your Color Story
      </h2>
      <p className="mt-3 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
        Describe a mood, a theme, or a concept. Our AI will craft a unique, harmonious color palette just for you.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'a playful brand for kids'"
          className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon />
              Generate
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaletteGenerator;