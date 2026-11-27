import { loadFont } from '@remotion/google-fonts/Poppins';
import { Easing } from 'remotion';

export const { fontFamily: POPPINS_FONT } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export const COLORS = {
  // Careerku signature warm surfaces
  bgCream: '#f7f8f2',
  bgSage: '#e4e7db',
  bgSubtle: '#f1f2ea',
  bgCard: '#ffffff',
  borderSubtle: '#e2e5d8',
  borderStrong: '#d3d7c8',

  // Typography & primary ink
  charcoal: '#1c1e21',
  slate: '#4b5056',
  muted: '#666c73',

  // Differentiated brand accents (Careerku Emerald + Midnight + Indigo)
  emerald: '#0d4a3a',
  emeraldBright: '#10b981',
  emeraldSoft: '#d1fae5',
  midnight: '#1d1f3a',
  indigo: '#4f54d8',
  indigoBright: '#5860ec',
  indigoLight: '#8e94fa',
  indigoSoft: '#dfe2ff',
  indigoPill: '#a6aaf7',
  rose: '#e11d48',
  roseSoft: '#ffe4e6',
} as const;

export const TEXT_SHADOW_SOFT = '0 4px 14px rgba(28, 30, 33, 0.14)';
export const CARD_SHADOW_ELEVATED =
  '0 28px 64px -12px rgba(28, 30, 33, 0.18), 0 8px 20px -4px rgba(28, 30, 33, 0.08)';
export const CARD_SHADOW_SUBTLE =
  '0 4px 16px -4px rgba(24, 28, 22, 0.06), 0 1px 3px rgba(24, 28, 22, 0.04)';

export const EASE_OUT_EXPO = Easing.bezier(0.2, 0.85, 0.2, 1);
export const EASE_IN_OUT_SMOOTH = Easing.bezier(0.45, 0, 0.15, 1);
