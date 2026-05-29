import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeContext, ThemeMode, lightTheme, darkTheme } from './src/hooks/useTheme';

const THEME_KEY = '@theme_pref';

export default function App() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'dark' || saved === 'light') setMode(saved);
      setLoaded(true);
    });
  }, []);

  const toggleTheme = async () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ mode, theme, isDark: mode === 'dark', toggleTheme }}>
      <PaperProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          <AppNavigator />
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
