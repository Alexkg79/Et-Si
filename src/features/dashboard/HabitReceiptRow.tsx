import { StyleSheet, Text, View } from 'react-native';

import { formatEuro } from '../../lib/format';
import { computeAnnualCost } from '../../lib/simulation';
import { Habit } from '../../lib/models';
import { colors, spacing, typeScale } from '../../theme';

interface HabitReceiptRowProps {
  habit: Habit;
}

export default function HabitReceiptRow({ habit }: HabitReceiptRowProps) {
  const annualCost = computeAnnualCost(habit);

  return (
    <View style={styles.row}>
      <Text style={styles.name} numberOfLines={1}>
        {habit.emoji} {habit.name}
      </Text>
      <Text style={styles.amount}>{formatEuro(annualCost)}/an</Text>
    </View>
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
  name: {
    ...typeScale.body,
    color: colors.ink,
    flex: 1,
  },
  amount: {
    ...typeScale.amount,
    color: colors.ink,
  },
});
