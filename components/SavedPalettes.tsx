import React from 'react';
import { Palette } from '../types';
import { TrashIcon, LoadIcon } from './Icons';

interface SavedPalettesProps {
  palettes: Palette[];
  onClose: () => void;
  onLoad: (palette: Palette) => void;
  onDelete: (id: string) => void;
}

const SavedPalettes: React.FC<SavedPalettesProps> = ({ palettes, onClose, onLoad, onDelete }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-xl font-semibold">Saved Palettes</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div className="overflow-y-auto p-5">
          {palettes.length === 0 ? (
            <p className="text-gray-500 text-center py-10">You have no saved palettes yet.</p>
          ) : (
            <div className="space-y-4">
              {palettes.map(palette => (
                <div key={palette.id} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg flex justify-between items-center group">
                  <div>
                    <p className="font-medium truncate max-w-xs sm:max-w-md">{palette.prompt}</p>
                    <div className="flex gap-2 mt-2">
                      {palette.colors.map(color => (
                        <div key={color.hex} className="w-6 h-6 rounded-full border-2 border-white/50 dark:border-black/50" style={{ backgroundColor: color.hex }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onLoad(palette)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white bg-black/10 dark:bg-white/10 rounded-md" aria-label="Load palette"><LoadIcon /></button>
                    <button onClick={() => onDelete(palette.id)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 bg-black/10 dark:bg-white/10 rounded-md" aria-label="Delete palette"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPalettes;