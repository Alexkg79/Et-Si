import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Respecte la préférence système "Réduire les animations" — utilisé pour
// désactiver les micro-animations (montant du portefeuille fantôme,
// carte résultat de la simulation) plutôt que de les imposer.
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduceMotion(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
