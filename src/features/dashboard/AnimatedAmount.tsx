import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import { useReduceMotion } from '../../lib/useReduceMotion';

interface AnimatedAmountProps {
  value: number;
  style?: StyleProp<TextStyle>;
  children: string;
}

// Petit pulse d'opacité quand `value` change (carte portefeuille
// fantôme, carte résultat de la simulation) — transition volontairement
// simple, pas d'animation complexe. Désactivée si l'utilisateur a
// activé "Réduire les animations" au niveau système.
export default function AnimatedAmount({ value, style, children }: AnimatedAmountProps) {
  const reduceMotion = useReduceMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (reduceMotion) return;

    opacity.stopAnimation();
    opacity.setValue(0.4);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, reduceMotion, opacity]);

  return <Animated.Text style={[style, { opacity }]}>{children}</Animated.Text>;
}
