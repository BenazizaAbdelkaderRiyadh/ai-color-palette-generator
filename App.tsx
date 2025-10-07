import React, { useState, useEffect, useCallback } from 'react';
import { Palette } from './types';
import { generatePalette, generateVariations } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import useTheme from './hooks/useTheme';
import Header from './components/Header';
import PaletteGenerator from './components/PaletteGenerator';
import PaletteDisplay from './components/PaletteDisplay';
import UIPreview from './components/UIPreview';
import SavedPalettes from './components/SavedPalettes';
import PaletteVariations from './components/PaletteVariations';
import Notification from './components/Notification';
import { ShareIcon } from './components/Icons';

const SkeletonLoader = () => (
    <div className="mt-8">
      <div className="bg-gray-200 dark:bg-gray-800/50 p-4 rounded-xl animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="flex gap-4">
          <div className="flex-1 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1 h-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
);


export default function App() {
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPalettes, setSavedPalettes] = useLocalStorage<Palette[]>('savedPalettes', []);
  const [showSaved, setShowSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationId, setNotificationId] = useState(0);
  const [theme, toggleTheme] = useTheme();
  const [variations, setVariations] = useState<Palette[] | null>(null);
  const [isVariationsLoading, setIsVariationsLoading] = useState(false);

  const showNotification = (message: string) => {
    setNotification(message);
    setNotificationId(id => id + 1);
  };

  const handleGeneratePalette = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setVariations(null);
    setCurrentPalette(null);
    try {
      const newPalette = await generatePalette(prompt, theme);
      setCurrentPalette(newPalette);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [theme]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#palette=')) {
      try {
        const hexes = hash.substring(9).split(',');
        if (hexes.length > 0 && hexes.every(h => /^[0-9A-Fa-f]{6}$/.test(h))) {
          const colors = hexes.map((hex, i) => ({ hex: `#${hex}`, name: `Color ${i + 1}` }));
          setCurrentPalette({
            id: new Date().getTime().toString(),
            prompt: 'Shared Palette',
            colors: colors,
          });
          showNotification('Shared palette loaded!');
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }
      } catch (e) {
        console.error("Failed to parse palette from URL hash", e);
      }
    } else {
       handleGeneratePalette('Serene coastal sunrise');
    }

  }, []);

  const handleGenerateVariations = async () => {
    if (!currentPalette) return;
    setIsVariationsLoading(true);
    setError(null);
    try {
        const newVariations = await generateVariations(currentPalette, theme);
        setVariations(newVariations);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setVariations(null);
    } finally {
        setIsVariationsLoading(false);
    }
  };

  const handleSelectVariation = (palette: Palette) => {
    setCurrentPalette(palette);
    setVariations(null);
    showNotification('Variation applied!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveCurrentPalette = () => {
    if (currentPalette && !savedPalettes.some(p => p.id === currentPalette.id)) {
      setSavedPalettes([currentPalette, ...savedPalettes]);
      showNotification('Palette saved!');
    } else {
      showNotification('Palette already saved or no palette to save.');
    }
  };
  
  const deletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter(p => p.id !== id));
    showNotification('Palette deleted.');
  };

  const loadPalette = (palette: Palette) => {
    setCurrentPalette(palette);
    setShowSaved(false);
    setVariations(null);
    showNotification('Palette loaded!');
  };

  const sharePalette = () => {
    if (currentPalette) {
      const hexString = currentPalette.colors.map(c => c.hex.substring(1)).join(',');
      const url = `${window.location.origin}${window.location.pathname}#palette=${hexString}`;
      navigator.clipboard.writeText(url);
      showNotification('Share link copied to clipboard!');
    }
  };

  return (
    <div className="h-screen bg-[var(--bg)] text-[var(--fg)] font-sans flex flex-col">
       <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 shrink-0">
        <Header 
          onShowSaved={() => setShowSaved(true)} 
          savedCount={savedPalettes.length}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <PaletteGenerator onGenerate={handleGeneratePalette} isLoading={isLoading} />
          
          {error && <div className="text-center p-3 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}
          
          {isLoading && <SkeletonLoader />}
          
          {!isLoading && currentPalette && (
            <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold truncate pr-4">
                      <span className="font-normal text-gray-500 dark:text-gray-400">Theme: </span>{currentPalette.prompt}
                    </h2>
                    <button onClick={sharePalette} className="flex items-center gap-2 text-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-2 rounded-md transition-colors shrink-0">
                        <ShareIcon />
                        Share
                    </button>
                  </div>

                  <PaletteDisplay 
                      palette={currentPalette} 
                      onSave={saveCurrentPalette} 
                      onCopy={() => showNotification('Color copied!')}
                      onGenerateVariations={handleGenerateVariations}
                      isVariationsLoading={isVariationsLoading}
                  />
                </div>

                <PaletteVariations 
                    palettes={variations} 
                    onSelect={handleSelectVariation} 
                    isLoading={isVariationsLoading} 
                />

                <UIPreview palette={currentPalette} />
            </div>
          )}
        </div>
      </main>

      {showSaved && (
        <SavedPalettes
          palettes={savedPalettes}
          onClose={() => setShowSaved(false)}
          onLoad={loadPalette}
          onDelete={deletePalette}
        />
      )}

      {notification && (
        <Notification
          key={notificationId}
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}