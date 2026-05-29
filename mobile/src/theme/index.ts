import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { NoteColor } from '../types';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1a73e8',
    background: '#f1f3f4',
    surface: '#ffffff',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8ab4f8',
    background: '#121212',
    surface: '#1e1e1e',
  },
};

type ColorPair = { light: string; dark: string };

export const noteColors: Record<NoteColor, ColorPair> = {
  default: { light: '#ffffff', dark: '#1e1e1e' },
  red:     { light: '#f28b82', dark: '#93000a' },
  orange:  { light: '#fbbc04', dark: '#e65100' },
  yellow:  { light: '#fff475', dark: '#7c6100' },
  green:   { light: '#ccff90', dark: '#1b5e20' },
  teal:    { light: '#a8f0e6', dark: '#00695c' },
  blue:    { light: '#cbf0f8', dark: '#01579b' },
  purple:  { light: '#d7aefb', dark: '#4a148c' },
};

export const colorPickerOptions: NoteColor[] = [
  'default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple',
];
