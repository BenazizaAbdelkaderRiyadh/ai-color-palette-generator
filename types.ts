export interface Color {
  hex: string;
  name: string;
}

export interface Palette {
  id: string;
  prompt: string;
  colors: Color[];
}