import React, { useState } from 'react';
import { Palette } from '../types';
import { getContrastColor } from '../utils/colorUtils';
import { CopyIcon, CheckIcon, SaveIcon, WandIcon } from './Icons';

interface PaletteDisplayProps {
  palette: Palette;
  onSave: () => void;
  onCopy: () => void;
  onGenerateVariations: () => void;
  isVariationsLoading: boolean;
}

const ColorSwatch: React.FC<{ name: string; hex: string; onCopy: () => void }> = ({ name, hex, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const contrastColor = getContrastColor(hex);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="relative flex-1 min-w-[80px] h-40 rounded-lg overflow-hidden group transition-all duration-300 ease-in-out flex flex-col justify-end p-4" 
      style={{ backgroundColor: hex, color: contrastColor }}
    >
      <div className="font-semibold text-lg">{name}</div>
      <div className="font-mono text-sm uppercase opacity-75">{hex}</div>
       <button 
          onClick={handleCopy} 
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Copy ${hex}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
    </div>
  );
};

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette, onSave, onCopy, onGenerateVariations, isVariationsLoading }) => {
  return (
    <div className="bg-white dark:bg-[var(--card)] p-4 rounded-xl border border-[var(--border)]">
       <div className="flex flex-col sm:flex-row items-center justify-between mb-4 px-2">
         <p className="text-gray-600 dark:text-gray-400 text-sm">Hover over a color to copy its hex code</p>
         <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button 
                onClick={onGenerateVariations} 
                disabled={isVariationsLoading}
                className="flex items-center justify-center gap-2 text-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                {isVariationsLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Generating...
                    </>
                ) : (
                    <>
                        <WandIcon />
                        Variations
                    </>
                )}
            </button>
            <button onClick={onSave} className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
              <SaveIcon />
              Save Palette
            </button>
         </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {palette.colors.map((color, index) => (
          <ColorSwatch key={index} name={color.name} hex={color.hex} onCopy={onCopy} />
        ))}
      </div>
    </div>
  );
};

export default PaletteDisplay;