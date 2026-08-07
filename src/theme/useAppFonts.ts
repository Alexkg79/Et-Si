import { useFonts } from 'expo-font';

import { fontAssets } from './tokens';

// À appeler une seule fois, à la racine de l'app (App.tsx). Tant que
// `fontsLoaded` est false, afficher un écran de chargement / garder le
// splash screen visible plutôt que de rendre l'UI (les tailles Space
// Grotesk / IBM Plex Mono ne sont pas fiables tant que les polices
// n'ont pas fini de charger).
export function useAppFonts() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  return { fontsLoaded, fontError };
}
