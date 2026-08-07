import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { parseAmountInput } from '../../lib/amount';
import { HabitFrequency } from '../../lib/models';
import { colors, radii, spacing, typeScale } from '../../theme';
import FrequencyToggle from './FrequencyToggle';

interface CategoryRowProps {
  emoji: string;
  name: string;
  checked: boolean;
  amount: string;
  frequency: HabitFrequency | null;
  isCustom: boolean;
  onToggle: () => void;
  onAmountChange: (text: string) => void;
  onFrequencyChange: (frequency: HabitFrequency) => void;
  onNameChange?: (text: string) => void;
  onRemove?: () => void;
}

export default function CategoryRow({
  emoji,
  name,
  checked,
  amount,
  frequency,
  isCustom,
  onToggle,
  onAmountChange,
  onFrequencyChange,
  onNameChange,
  onRemove,
}: CategoryRowProps) {
  const showFrequencyHint = checked && parseAmountInput(amount) > 0 && frequency === null;

  return (
    <View style={styles.container}>
      <Pressable onPress={onToggle} style={styles.header} hitSlop={12}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.emoji}>{emoji}</Text>
        {isCustom ? (
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={onNameChange}
            placeholder="Nom de la catégorie"
            placeholderTextColor={colors.inkSoft}
          />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}
        {isCustom ? (
          <Pressable onPress={onRemove} hitSlop={12}>
            <Text style={styles.removeLabel}>✕</Text>
          </Pressable>
        ) : null}
      </Pressable>

      {checked ? (
        <View style={styles.expanded}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="0,00 €"
            placeholderTextColor={colors.inkSoft}
            keyboardType="decimal-pad"
          />
          <FrequencyToggle value={frequency} onChange={onFrequencyChange} />
          {showFrequencyHint ? <Text style={styles.hint}>⚠️ Choisis une fréquence pour valider cette fuite.</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.paperDim,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.mint,
    borderColor: colors.mintDeep,
  },
  checkmark: {
    ...typeScale.label,
    color: colors.ink,
  },
  emoji: {
    fontSize: 22,
  },
  name: {
    ...typeScale.bodyMedium,
    color: colors.ink,
    flex: 1,
  },
  nameInput: {
    ...typeScale.bodyMedium,
    color: colors.ink,
    flex: 1,
    paddingVertical: 0,
  },
  removeLabel: {
    ...typeScale.label,
    color: colors.inkSoft,
    paddingHorizontal: spacing.xs,
  },
  expanded: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  amountInput: {
    ...typeScale.amount,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  hint: {
    ...typeScale.caption,
    color: colors.ink,
  },
});
