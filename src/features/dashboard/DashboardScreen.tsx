import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Habit } from '../../lib/models';
import { habitRepository } from '../../lib/storage';
import { colors, spacing, typeScale } from '../../theme';

const FREQUENCY_LABELS: Record<Habit['frequency'], string> = {
  daily: '/jour',
  weekly: '/semaine',
  monthly: '/mois',
};

// TEMPORAIRE (vérification Phase 2) : affichage brut des habitudes
// enregistrées par l'onboarding. À remplacer en Phase 3 par la carte
// "portefeuille fantôme" + la liste type reçu (CLAUDE.md section 6).
export default function DashboardScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      habitRepository.getAll().then((data) => {
        if (!cancelled) setHabits(data);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Accueil</Text>
      <Text style={styles.body}>Le relevé de tes fuites d'argent arrive ici.</Text>

      <View style={styles.debugSection}>
        <Text style={styles.debugLabel}>Debug — habitudes en base ({habits.length})</Text>
        {habits.length === 0 ? (
          <Text style={styles.debugEmpty}>Aucune habitude enregistrée pour l'instant.</Text>
        ) : (
          habits.map((habit) => (
            <Text key={habit.id} style={styles.debugRow}>
              {habit.emoji} {habit.name} — {habit.amount.toFixed(2)} € {FREQUENCY_LABELS[habit.frequency]}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  body: {
    ...typeScale.body,
    color: colors.inkSoft,
  },
  debugSection: {
    marginTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.paperDim,
    paddingTop: spacing.md,
  },
  debugLabel: {
    ...typeScale.label,
    color: colors.coral,
    marginBottom: spacing.sm,
  },
  debugEmpty: {
    ...typeScale.caption,
    color: colors.inkSoft,
  },
  debugRow: {
    ...typeScale.amountSmall,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
});
