import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typeScale } from '../../theme';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  body: string;
  buttonLabel: string;
  onPress: () => void;
}

// Générique pour rester réutilisable entre l'écran Accueil (CTA vers
// l'onboarding) et l'écran Simulation (CTA vers l'onglet Ajouter).
export default function EmptyState({ emoji = '🕵️', title, body, buttonLabel, onPress }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.buttonLabel}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emoji: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  title: {
    ...typeScale.h2,
    color: colors.ink,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  body: {
    ...typeScale.body,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.mint,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  buttonLabel: {
    ...typeScale.bodyMedium,
    color: colors.ink,
  },
});
