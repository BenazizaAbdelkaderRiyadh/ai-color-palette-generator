import React, { useState, useId } from 'react';
import { Palette } from '../types';
import { getContrastColor, shadeColor } from '../utils/colorUtils';
import { SunIcon, MoonIcon } from './Icons';

interface UIPreviewProps {
  palette: Palette;
}

const UIPreview: React.FC<UIPreviewProps> = ({ palette }) => {
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [toggleOn, setToggleOn] = useState(true);
  const toggleId = useId();

  if (palette.colors.length < 5) {
    return null; 
  }

  const [bg, text, subtle, interactive, primary] = palette.colors.map(c => c.hex);
  
  const primaryHover = shadeColor(primary, -10);
  const interactiveHover = shadeColor(interactive, -10);
  
  const dynamicStyles = `
    .btn-primary:hover { background-color: ${primaryHover}; }
    .btn-secondary:hover { background-color: ${interactiveHover}; }
    .btn-outline:hover { background-color: ${primary}; color: ${getContrastColor(primary)}; }
    .form-input:focus { border-color: ${primary}; box-shadow: 0 0 0 3px ${primary}40; }
  `;

  return (
    <div>
      <style>{dynamicStyles}</style>
      <div className="flex justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold">UI Preview</h3>
        <button
          onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
          role="switch"
          aria-checked={previewTheme === 'dark'}
          aria-label={`Switch to ${previewTheme === 'light' ? 'dark' : 'light'} preview`}
          className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--card)] focus:ring-blue-500 ${
              previewTheme === 'dark' ? 'bg-gray-700' : 'bg-yellow-400'
          }`}
        >
          <span className="sr-only">Use {previewTheme === 'light' ? 'dark' : 'light'} preview theme</span>
          <span
              className={`pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                  previewTheme === 'dark' ? 'translate-x-8' : 'translate-x-0'
              }`}
          >
              <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-in ${
                      previewTheme === 'dark' ? 'opacity-0' : 'opacity-100'
                  }`}
                  aria-hidden="true"
              >
                  <SunIcon className="h-5 w-5 text-yellow-500" />
              </span>
              <span
                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-out ${
                      previewTheme === 'dark' ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
              >
                  <MoonIcon className="h-5 w-5 text-gray-700" />
              </span>
          </span>
        </button>
      </div>
      
      <div className="rounded-xl border border-[var(--border)] shadow-lg overflow-hidden">
        {}
        <div className="h-10 bg-gray-100 dark:bg-gray-800/80 backdrop-blur-sm border-b border-[var(--border)] flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        
        {}
        <div 
          className="p-4 sm:p-6 transition-colors duration-500"
          style={{ 
            backgroundColor: previewTheme === 'light' ? bg : shadeColor(bg, -80), 
            color: text 
          }}
        >
          <div className="space-y-6">
            {}
            <div>
              <h1 className="text-3xl font-bold" style={{color: text}}>The Quick Brown Fox</h1>
              <p style={{ color: text, opacity: 0.7 }} className="mt-2 max-w-prose">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {}
              <div className="p-6 rounded-lg shadow-lg" style={{backgroundColor: subtle, color: getContrastColor(subtle)}}>
                <h3 className="font-bold text-lg mb-2">Card Title</h3>
                <p className="opacity-80 text-sm">This is a card component. It's useful for displaying grouped content and creating visual hierarchy on a page.</p>
              </div>

              {}
              <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Enter your name..."
                    className="form-input w-full px-4 py-2 text-inherit border-2 rounded-md focus:outline-none transition-all"
                    style={{ backgroundColor: bg, borderColor: subtle, color: text }}
                />
                <div className="flex items-center gap-3">
                  <label htmlFor={toggleId} className="font-medium" style={{ color: text, opacity: 0.9 }}>Enable Notifications</label>
                  <button
                    role="switch"
                    aria-checked={toggleOn}
                    id={toggleId}
                    onClick={() => setToggleOn(!toggleOn)}
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    style={{ backgroundColor: toggleOn ? interactive : subtle }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      style={{ transform: toggleOn ? 'translateX(1.25rem)' : 'translateX(0rem)' }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {}
            <div>
              <div className="flex flex-wrap gap-3">
                 <button className="btn-primary font-semibold py-2 px-5 rounded-lg shadow-md transform hover:-translate-y-0.5 transition-all" style={{ backgroundColor: primary, color: getContrastColor(primary) }}>
                    Primary Action
                </button>
                <button className="btn-secondary font-semibold py-2 px-5 rounded-lg shadow-md transform hover:-translate-y-0.5 transition-all" style={{ backgroundColor: interactive, color: getContrastColor(interactive) }}>
                    Secondary
                </button>
                 <button className="btn-outline font-semibold py-2 px-5 rounded-lg shadow-md transform hover:-translate-y-0.5 transition-all" style={{ borderColor: primary, color: primary, borderWidth: '2px' }}>
                    Outline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIPreview;