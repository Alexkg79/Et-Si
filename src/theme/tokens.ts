// Design tokens — source unique de vérité pour couleurs, typographie et
// échelle de tailles. Ne jamais coder de valeurs de couleur/police en dur
// ailleurs dans l'app : toujours importer depuis ce fichier.
// Référence : CLAUDE.md section 4.

import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono';

export const colors = {
  ink: '#12231C',
  inkSoft: '#3E5A4E',
  paper: '#E7E2D2',
  paperDim: '#DCD6C1',
  mint: '#5FEFA8',
  mintDeep: '#1E7A54',
  coral: '#FF6B54',
  amber: '#FFB84D',
} as const;

export type ColorToken = keyof typeof colors;

// Poids Space Grotesk exposés par @expo-google-fonts/space-grotesk.
export const fontFamilies = {
  ui: {
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    semiBold: 'SpaceGrotesk_600SemiBold',
    bold: 'SpaceGrotesk_700Bold',
  },
  mono: {
    regular: 'IBMPlexMono_400Regular',
    medium: 'IBMPlexMono_500Medium',
    semiBold: 'IBMPlexMono_600SemiBold',
    bold: 'IBMPlexMono_700Bold',
  },
} as const;

// Liste à passer telle quelle à useFonts() — voir src/theme/useAppFonts.ts.
export const fontAssets = {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} as const;

// Échelle de tailles de base. `ui` pour les titres/labels/texte courant
// (Space Grotesk), `mono` pour tout montant, pourcentage ou durée
// (IBM Plex Mono), conformément à CLAUDE.md section 4.
export const typeScale = {
  display: { fontSize: 40, lineHeight: 44, fontFamily: fontFamilies.ui.bold },
  h1: { fontSize: 28, lineHeight: 34, fontFamily: fontFamilies.ui.bold },
  h2: { fontSize: 22, lineHeight: 28, fontFamily: fontFamilies.ui.semiBold },
  body: { fontSize: 16, lineHeight: 22, fontFamily: fontFamilies.ui.regular },
  bodyMedium: { fontSize: 16, lineHeight: 22, fontFamily: fontFamilies.ui.medium },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: fontFamilies.ui.regular },
  label: { fontSize: 13, lineHeight: 16, fontFamily: fontFamilies.ui.semiBold },
  amountLarge: { fontSize: 36, lineHeight: 40, fontFamily: fontFamilies.mono.semiBold },
  amount: { fontSize: 20, lineHeight: 26, fontFamily: fontFamilies.mono.medium },
  amountSmall: { fontSize: 14, lineHeight: 18, fontFamily: fontFamilies.mono.regular },
} as const;

export type TypeScaleToken = keyof typeof typeScale;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const theme = {
  colors,
  fontFamilies,
  typeScale,
  spacing,
  radii,
} as const;

export default theme;
