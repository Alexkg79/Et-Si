import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatEuro } from '../../lib/format';
import { Habit } from '../../lib/models';
import { computeFutureValue } from '../../lib/simulation';
import { colors, radii, spacing, typeScale } from '../../theme';

interface GuiltNotificationProps {
  habits: Habit[];
  annualReturnRate: number;
  years: number;
}

// Mode "notifications passives-agressives" — CLAUDE.md section 3 :
// toujours optionnel, affiché uniquement si guiltModeEnabled est actif
// (branché sur le toggle dédié en Phase 5). Choisit une habitude au
// hasard pour personnaliser le message, sur le ton ironique de l'app.
export default function GuiltNotification({ habits, annualReturnRate, years }: GuiltNotificationProps) {
  const habit = useMemo(() => habits[Math.floor(Math.random() * habits.length)], [habits]);

  if (!habit) return null;

  const projected = computeFutureValue([habit], annualReturnRate, years);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mode culpabilité</Text>
      <Text style={styles.text}>
        {habit.emoji} {habit.name} ? Dans {years} ans, ça aurait pu valoir {formatEuro(projected)}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.paperDim,
    borderRadius: radii.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.coral,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  label: {
    ...typeScale.label,
    color: colors.coral,
    marginBottom: spacing.xs,
  },
  text: {
    ...typeScale.body,
    color: colors.ink,
  },
});
