import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { parseAmountInput } from '../../lib/amount';
import { generateId } from '../../lib/id';
import { Habit, HabitFrequency } from '../../lib/models';
import { habitRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';
import {
  buildInitialCategoryLines,
  CategoryLine,
  CategoryRow,
  CUSTOM_CATEGORY_EMOJI,
  CUSTOM_CATEGORY_ID,
} from '../onboarding';

// Formulaire d'ajout d'une habitude à tout moment (pas seulement à
// l'onboarding) — réutilise CategoryRow/FrequencyToggle/categories.ts,
// mais en sélection unique (une seule catégorie à la fois) plutôt qu'en
// checklist multi-sélection comme dans l'onboarding.
export default function AddHabitScreen() {
  const [lines, setLines] = useState<CategoryLine[]>(buildInitialCategoryLines);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const selectLine = (key: string) => {
    setSavedMessage(null);
    setLines((prev) =>
      prev.map((line) => ({
        ...line,
        checked: line.key === key ? !line.checked : false,
      }))
    );
  };

  const updateLine = (key: string, changes: Partial<CategoryLine>) => {
    setSavedMessage(null);
    setLines((prev) => prev.map((line) => (line.key === key ? { ...line, ...changes } : line)));
  };

  const addCustomCategory = () => {
    setSavedMessage(null);
    setLines((prev) => {
      const existingCustom = prev.find((line) => line.isCustom);
      if (existingCustom) {
        return prev.map((line) => ({ ...line, checked: line.key === existingCustom.key }));
      }
      return [
        ...prev.map((line) => ({ ...line, checked: false })),
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
      ];
    });
  };

  const removeCustomCategory = (key: string) => {
    setLines((prev) => prev.filter((line) => line.key !== key));
  };

  const selected = lines.find((line) => line.checked);
  const canSubmit =
    !!selected &&
    parseAmountInput(selected.amount) > 0 &&
    selected.frequency !== null &&
    (!selected.isCustom || selected.name.trim().length > 0) &&
    !saving;

  const handleSubmit = async () => {
    if (!canSubmit || !selected) return;
    setSaving(true);
    try {
      const habit: Habit = {
        id: generateId(),
        emoji: selected.emoji,
        name: selected.name.trim(),
        category: selected.categoryId,
        amount: parseAmountInput(selected.amount),
        frequency: selected.frequency as HabitFrequency,
        createdAt: new Date().toISOString(),
        active: true,
      };
      await habitRepository.create(habit);
      setLines(buildInitialCategoryLines());
      setSavedMessage(`${habit.emoji} ${habit.name} ajoutée — direction l'onglet Accueil pour la voir.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Ajouter une fuite</Text>
        <Text style={styles.subtitle}>Une catégorie, un montant, une fréquence.</Text>

        {lines.map((line) => (
          <CategoryRow
            key={line.key}
            emoji={line.emoji}
            name={line.name}
            checked={line.checked}
            amount={line.amount}
            frequency={line.frequency}
            isCustom={line.isCustom}
            onToggle={() => selectLine(line.key)}
            onAmountChange={(text) => updateLine(line.key, { amount: text })}
            onFrequencyChange={(frequency) => updateLine(line.key, { frequency })}
            onNameChange={line.isCustom ? (text) => updateLine(line.key, { name: text }) : undefined}
            onRemove={line.isCustom ? () => removeCustomCategory(line.key) : undefined}
          />
        ))}

        <Pressable onPress={addCustomCategory} style={styles.addCustomButton}>
          <Text style={styles.addCustomLabel}>+ Ajouter une catégorie perso</Text>
        </Pressable>

        {savedMessage ? <Text style={styles.savedMessage}>{savedMessage}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        >
          <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
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
  savedMessage: {
    ...typeScale.caption,
    color: colors.mintDeep,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.paperDim,
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
