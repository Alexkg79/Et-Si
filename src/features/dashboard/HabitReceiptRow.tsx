import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatEuro, FREQUENCY_SUFFIX } from '../../lib/format';
import { computeAnnualCost } from '../../lib/simulation';
import { Habit } from '../../lib/models';
import { colors, spacing, typeScale } from '../../theme';

interface HabitReceiptRowProps {
  habit: Habit;
  isTopHabit?: boolean;
  onPress?: () => void;
}

export default function HabitReceiptRow({ habit, isTopHabit, onPress }: HabitReceiptRowProps) {
  const annualCost = computeAnnualCost(habit);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.rowPressed]}>
      {isTopHabit ? <Text style={styles.badge}>🏆 Ta plus grosse fuite</Text> : null}
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {habit.emoji} {habit.name}
        </Text>
        <View style={styles.amountColumn}>
          <Text style={styles.amount}>{formatEuro(annualCost)}/an</Text>
          <Text style={styles.rawAmount}>
            {formatEuro(habit.amount, 2)} {FREQUENCY_SUFFIX[habit.frequency]}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: colors.paperDim,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  badge: {
    ...typeScale.label,
    color: colors.mintDeep,
    marginBottom: spacing.xs,
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
