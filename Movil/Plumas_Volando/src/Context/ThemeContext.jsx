import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── PALETAS ─────────────────────────────────────────────────────────────────

export const LIGHT_COLORS = {
  background:     '#EEF0F5',
  backgroundCard: '#EEF0F5',
  textPrimary:    '#1A1D2E',
  textSecondary:  '#6B7280',
  textMuted:      '#9CA3AF',
  primary:        '#4B7BEC',
  primaryDark:    '#3A6BE8',
  primaryLighter: '#EEF2FF',
  error:          '#EF4444',
  border:         '#DDE1E9',
  shadowDark:     '#B8BAC8',
  shadowLight:    '#FFFFFF',
};

export const DARK_COLORS = {
  background:     '#1A1C22',
  backgroundCard: '#1F2128',
  textPrimary:    '#F0F2F8',
  textSecondary:  '#9AA3B5',
  textMuted:      '#6B7280',
  primary:        '#6B96F8',
  primaryDark:    '#8AB0FF',
  primaryLighter: '#1E2535',
  error:          '#F87171',
  border:         '#2C2F3A',
  shadowDark:     '#111318',
  shadowLight:    '#2A2D38',
};

const DARK_NEURO = {
  topShadow: {
    shadowColor: '#2A2D38',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomShadow: {
    shadowColor: '#111318',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  combinedShadow: {
    shadowColor: '#111318',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  inset: {
    shadowColor: '#111318',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
};

// ─── CONTEXTO ─────────────────────────────────────────────────────────────────

const ThemeContext = createContext();
export const useTheme     = () => useContext(ThemeContext);
export const useAppColors = () => useContext(ThemeContext).colors;
export const useIsDark    = () => useContext(ThemeContext).isDark;

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme_dark').then(v => {
      if (v === '1') setIsDark(true);
    });
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem('theme_dark', next ? '1' : '0');
      return next;
    });
  };

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors, darkNeuro: DARK_NEURO }}>
      {children}
    </ThemeContext.Provider>
  );
};
