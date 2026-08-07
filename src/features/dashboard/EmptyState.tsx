import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typeScale } from '../../theme';

interface EmptyStateProps {
  onStartOnboarding: () => void;
}

export default function EmptyState({ onStartOnboarding }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🕵️</Text>
      <Text style={styles.title}>Aucune fuite recensée</Text>
      <Text style={styles.body}>Tant que t'as rien coché, ton portefeuille fantôme reste... fantôme.</Text>
      <Pressable onPress={onStartOnboarding} style={styles.button}>
        <Text style={styles.buttonLabel}>Traquer mes fuites</Text>
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
