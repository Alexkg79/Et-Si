import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { parseAmountInput } from '../../lib/amount';
import { FRIENDLY_ERROR_MESSAGE } from '../../lib/errors';
import { generateId } from '../../lib/id';
import { Habit, HabitFrequency } from '../../lib/models';
import { habitRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';
import CategoryRow from './CategoryRow';
import {
  buildInitialCategoryLines,
  CategoryLine,
  CUSTOM_CATEGORY_EMOJI,
  CUSTOM_CATEGORY_ID,
} from './categories';

interface OnboardingScreenProps {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [lines, setLines] = useState<CategoryLine[]>(buildInitialCategoryLines);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLine = (key: string, changes: Partial<CategoryLine>) => {
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, ...changes } : line)));
  };

  const toggleLine = (key: string) => {
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, checked: !line.checked } : line)));
  };

  const addCustomCategory = () => {
    setLines((prev) => [
      ...prev,
      {
        key: generateId(),
        categoryId: CUSTOM_CATEGORY_ID,
        emoji: CUSTOM_CATEGORY_EMOJI,
        name: '',
        isCustom: true,
        checked: true,
        amount: '',
        frequency: null,
      },
    ]);
  };

  const removeCustomCategory = (key: string) => {
    setLines((prev) => prev.filter((line) => line.key !== key));
  };

  const validLines = lines.filter(
    (line) =>
      line.checked &&
      parseAmountInput(line.amount) > 0 &&
      line.frequency !== null &&
      (!line.isCustom || line.name.trim().length > 0)
  );
  const canSubmit = validLines.length > 0 && !saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const habitsToCreate: Habit[] = validLines.map((line) => ({
        id: generateId(),
        emoji: line.emoji,
        name: line.name.trim(),
        category: line.categoryId,
        amount: parseAmountInput(line.amount),
        frequency: line.frequency as HabitFrequency,
        createdAt: now,
        active: true,
      }));
      await habitRepository.createMany(habitsToCreate);
      onDone();
    } catch {
      setError(FRIENDLY_ERROR_MESSAGE);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Coche ce qui te parle</Text>
        <Text style={styles.subtitle}>
          Un montant, une fréquence : les tiens, pas une moyenne bidon.
        </Text>

        {lines.map((line) => (
          <CategoryRow
            key={line.key}
            emoji={line.emoji}
            name={line.name}
            checked={line.checked}
            amount={line.amount}
            frequency={line.frequency}
            isCustom={line.isCustom}
            onToggle={() => toggleLine(line.key)}
            onAmountChange={(text) => updateLine(line.key, { amount: text })}
            onFrequencyChange={(frequency) => updateLine(line.key, { frequency })}
            onNameChange={line.isCustom ? (text) => updateLine(line.key, { name: text }) : undefined}
            onRemove={line.isCustom ? () => removeCustomCategory(line.key) : undefined}
          />
        ))}

        <Pressable onPress={addCustomCategory} style={styles.addCustomButton}>
          <Text style={styles.addCustomLabel}>+ Ajouter une catégorie perso</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        >
          <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
            {saving ? 'Enregistrement...' : 'Valider mes fuites'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typeScale.body,
    color: colors.inkSoft,
    marginBottom: spacing.lg,
  },
  addCustomButton: {
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.paperDim,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  addCustomLabel: {
    ...typeScale.bodyMedium,
    color: colors.inkSoft,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.paperDim,
  },
  errorText: {
    ...typeScale.caption,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.mint,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.paperDim,
  },
  submitLabel: {
    ...typeScale.bodyMedium,
    color: colors.ink,
  },
  submitLabelDisabled: {
    color: colors.inkSoft,
  },
});
