import { GoogleGenAI, Type } from "@google/genai";
import { Palette, Color } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. This app will not function without it.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePalette = async (description: string, theme: 'light' | 'dark'): Promise<Palette> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `You are an expert color palette generator for designers. Based on the following description, create a beautiful and cohesive color palette suitable for a ${theme} theme. The palette must consist of exactly 5 colors. Assign a semantic name to each color (e.g., "Background", "Text", "Subtle", "Interactive", "Primary").

Description: "${description}"

Provide the response in the specified JSON format. The hex codes must be valid and start with '#'. The names should be concise and descriptive.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      colors: {
        type: Type.ARRAY,
        description: 'An array of 5 color objects, each with a hex code and a semantic name.',
        items: {
          type: Type.OBJECT,
          properties: {
            hex: {
              type: Type.STRING,
              description: 'The hex code of the color, e.g., "#RRGGBB".',
            },
            name: {
              type: Type.STRING,
              description: 'A semantic name for the color (e.g., "Background").'
            }
          },
          required: ['hex', 'name'],
        },
      },
    },
    required: ['colors'],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (!parsed.colors || !Array.isArray(parsed.colors) || parsed.colors.length !== 5) {
      throw new Error('AI returned an invalid data format. Expected 5 colors.');
    }

    const colors: Color[] = parsed.colors.map((c: any) => {
        if (typeof c.hex === 'string' && /^#[0-9a-fA-F]{6}$/.test(c.hex) && typeof c.name === 'string') {
            return { hex: c.hex, name: c.name };
        }
        throw new Error(`Invalid color object format received: ${JSON.stringify(c)}`);
    });

    return {
      id: `${new Date().getTime()}-${colors.map(c => c.hex).join('-')}`,
      prompt: description,
      colors,
    };
  } catch (error) {
    console.error("Error generating palette from Gemini:", error);
    if (error instanceof Error && error.message.includes('429')) {
       throw new Error("API rate limit exceeded. Please wait and try again.");
    }
    throw new Error("Failed to generate palette from AI. The model may be unavailable or the request was blocked.");
  }
};

export const generateVariations = async (basePalette: Palette, theme: 'light' | 'dark'): Promise<Palette[]> => {
    const model = 'gemini-2.5-flash';
    const originalColors = basePalette.colors.map(c => `${c.name}: ${c.hex}`).join(', ');

    const prompt = `You are an expert color palette generator. I have a color palette for the theme "${basePalette.prompt}". The original colors are: ${originalColors}.

Please generate 4 subtle, beautiful variations of this palette. Each variation should maintain the original theme's essence but offer slightly different shades or accent colors suitable for a ${theme} theme.

Each variation must consist of exactly 5 colors, each with a semantic name and hex code.

Provide the response in the specified JSON format. Ensure the hex codes are valid and start with '#'.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            palettes: {
                type: Type.ARRAY,
                description: 'An array of 4 palette variations.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        colors: {
                            type: Type.ARRAY,
                            description: 'An array of 5 color objects, each with a hex code and name.',
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    hex: {
                                        type: Type.STRING,
                                        description: 'The hex code of the color, e.g., "#RRGGBB".',
                                    },
                                    name: {
                                        type: Type.STRING,
                                        description: 'A semantic name for the color.'
                                    }
                                },
                                required: ['hex', 'name'],
                            },
                        },
                    },
                    required: ['colors'],
                },
            },
        },
        required: ['palettes'],
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.9,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (!parsed.palettes || !Array.isArray(parsed.palettes)) {
            throw new Error('AI returned an invalid data format for variations.');
        }

        const variations: Palette[] = parsed.palettes.map((p: any, index: number) => {
            if (!p.colors || !Array.isArray(p.colors) || p.colors.length !== 5) {
                throw new Error(`Variation ${index + 1} has an invalid color format.`);
            }
            const colors: Color[] = p.colors.map((c: any) => {
                if (typeof c.hex === 'string' && /^#[0-9a-fA-F]{6}$/.test(c.hex) && typeof c.name === 'string') {
                    return { hex: c.hex, name: c.name };
                }
                throw new Error(`Invalid hex code format received in variation: ${JSON.stringify(c)}`);
            });
            return {
                id: `${new Date().getTime()}-${index}-${colors.map(c => c.hex).join('-')}`,
                prompt: basePalette.prompt,
                colors,
            };
        });

        return variations;

    } catch (error) {
        console.error("Error generating variations from Gemini:", error);
        if (error instanceof Error && error.message.includes('429')) {
           throw new Error("API rate limit exceeded. Please wait and try again.");
        }
        throw new Error("Failed to generate palette variations from AI.");
    }
};