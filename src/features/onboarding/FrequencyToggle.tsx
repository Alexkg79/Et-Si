import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HabitFrequency } from '../../lib/models';
import { colors, radii, spacing, typeScale } from '../../theme';

const OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Jour' },
  { value: 'weekly', label: 'Semaine' },
  { value: 'monthly', label: 'Mois' },
];

interface FrequencyToggleProps {
  value: HabitFrequency | null;
  onChange: (value: HabitFrequency) => void;
}

// Aucune option n'est présélectionnée : voir CLAUDE.md section 2, on ne
// devine rien à la place de l'utilisateur, y compris la fréquence.
export default function FrequencyToggle({ value, onChange }: FrequencyToggleProps) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.pill, selected && styles.pillSelected]}
          >
            <Text style={[styles.pillLabel, selected && styles.pillLabelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.paperDim,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: colors.mint,
  },
  pillLabel: {
    ...typeScale.caption,
    color: colors.inkSoft,
  },
  pillLabelSelected: {
    color: colors.ink,
    fontFamily: typeScale.label.fontFamily,
  },
});
