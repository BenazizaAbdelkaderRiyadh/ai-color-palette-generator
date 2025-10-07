import React from 'react';
import { Palette } from '../types';
import { CheckIcon } from './Icons';

interface PaletteVariationsProps {
  palettes: Palette[] | null;
  onSelect: (palette: Palette) => void;
  isLoading: boolean;
}

const PaletteVariation: React.FC<{ palette: Palette; onSelect: () => void; }> = ({ palette, onSelect }) => {
    return (
        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-center group transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10">
            <div className="flex gap-3">
                {palette.colors.map(color => (
                    <div 
                        key={color.hex} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/50 dark:border-black/50 shadow-md" 
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                    ></div>
                ))}
            </div>
            <button 
                onClick={onSelect} 
                className="mt-3 sm:mt-0 sm:ml-4 flex items-center justify-center gap-2 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-all"
            >
                <CheckIcon />
                Use this Palette
            </button>
        </div>
    );
};

const PaletteVariations: React.FC<PaletteVariationsProps> = ({ palettes, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
        <p className="mt-3 text-gray-500 dark:text-gray-400">Brewing up some variations...</p>
      </div>
    );
  }

  if (!palettes || palettes.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in">
        <h3 className="text-xl font-semibold text-center mb-4">
            Color Variations
        </h3>
        <div className="max-w-3xl mx-auto space-y-4">
            {palettes.map(p => (
                <PaletteVariation key={p.id} palette={p} onSelect={() => onSelect(p)} />
            ))}
        </div>
    </div>
  );
};

export default PaletteVariations;