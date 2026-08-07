import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing, typeScale } from '../../theme';

interface SimulationChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function SimulationChip({ label, selected, onPress }: SimulationChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.paperDim,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.mint,
  },
  label: {
    ...typeScale.bodyMedium,
    color: colors.inkSoft,
  },
  labelSelected: {
    color: colors.ink,
  },
});
