import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatEuro } from '../../lib/format';
import { computeAnnualCost } from '../../lib/simulation';
import { Habit } from '../../lib/models';
import { colors, spacing, typeScale } from '../../theme';

interface HabitReceiptRowProps {
  habit: Habit;
  onPress?: () => void;
}

const FREQUENCY_SUFFIX: Record<Habit['frequency'], string> = {
  daily: '/ jour',
  weekly: '/ semaine',
  monthly: '/ mois',
};

export default function HabitReceiptRow({ habit, onPress }: HabitReceiptRowProps) {
  const annualCost = computeAnnualCost(habit);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Text style={styles.name} numberOfLines={1}>
        {habit.emoji} {habit.name}
      </Text>
      <View style={styles.amountColumn}>
        <Text style={styles.amount}>{formatEuro(annualCost)}/an</Text>
        <Text style={styles.rawAmount}>
          {formatEuro(habit.amount, 2)} {FREQUENCY_SUFFIX[habit.frequency]}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: colors.paperDim,
    gap: spacing.sm,
  },
  rowPressed: {
    opacity: 0.6,
  },
  name: {
    ...typeScale.body,
    color: colors.ink,
    flex: 1,
  },
  amountColumn: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typeScale.amount,
    color: colors.ink,
  },
  rawAmount: {
    ...typeScale.caption,
    color: colors.inkSoft,
    marginTop: spacing.xs,
  },
});
