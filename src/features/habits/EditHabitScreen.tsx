import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { parseAmountInput } from '../../lib/amount';
import { Habit, HabitFrequency } from '../../lib/models';
import { habitRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';
import { CategoryRow, CUSTOM_CATEGORY_ID } from '../onboarding';

interface EditHabitScreenProps {
  habit: Habit;
  onDone: () => void;
  onCancel: () => void;
}

type ConfirmState = 'idle' | 'confirmingDelete';

export default function EditHabitScreen({ habit, onDone, onCancel }: EditHabitScreenProps) {
  const [name, setName] = useState(habit.name);
  const [amount, setAmount] = useState(String(habit.amount).replace('.', ','));
  const [frequency, setFrequency] = useState<HabitFrequency | null>(habit.frequency);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>('idle');

  const isCustom = habit.category === CUSTOM_CATEGORY_ID;
  const canSave =
    parseAmountInput(amount) > 0 && frequency !== null && (!isCustom || name.trim().length > 0) && !saving;

  const handleSave = async () => {
    if (!canSave || !frequency) return;
    setSaving(true);
    try {
      await habitRepository.update({
        ...habit,
        name: name.trim(),
        amount: parseAmountInput(amount),
        frequency,
      });
      onDone();
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePress = async () => {
    if (confirmState !== 'confirmingDelete') {
      setConfirmState('confirmingDelete');
      return;
    }
    setSaving(true);
    try {
      await habitRepository.remove(habit.id);
      onDone();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={onCancel} hitSlop={8}>
          <Text style={styles.backLabel}>‹ Retour</Text>
        </Pressable>

        <Text style={styles.title}>Modifier la fuite</Text>

        <CategoryRow
          emoji={habit.emoji}
          name={name}
          checked
          amount={amount}
          frequency={frequency}
          isCustom={isCustom}
          onToggle={() => {}}
          onAmountChange={setAmount}
          onFrequencyChange={setFrequency}
          onNameChange={isCustom ? setName : undefined}
        />
      </ScrollView>

      <View style={styles.footer}>
        {confirmState === 'confirmingDelete' ? (
          <View style={styles.confirmRow}>
            <Text style={styles.confirmText}>Confirmer la suppression ?</Text>
            <View style={styles.confirmButtons}>
              <Pressable onPress={() => setConfirmState('idle')} style={styles.cancelButton}>
                <Text style={styles.cancelLabel}>Annuler</Text>
              </Pressable>
              <Pressable onPress={handleDeletePress} disabled={saving} style={styles.deleteConfirmButton}>
                <Text style={styles.deleteConfirmLabel}>{saving ? '...' : 'Supprimer'}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.actionsRow}>
            <Pressable onPress={handleDeletePress} style={styles.deleteButton}>
              <Text style={styles.deleteLabel}>Supprimer</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            >
              <Text style={[styles.saveLabel, !canSave && styles.saveLabelDisabled]}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Text>
            </Pressable>
          </View>
        )}
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
  backLabel: {
    ...typeScale.bodyMedium,
    color: colors.inkSoft,
    marginBottom: spacing.md,
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.paperDim,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  deleteButton: {
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.coral,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteLabel: {
    ...typeScale.bodyMedium,
    color: colors.coral,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.mint,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.paperDim,
  },
  saveLabel: {
    ...typeScale.bodyMedium,
    color: colors.ink,
  },
  saveLabelDisabled: {
    color: colors.inkSoft,
  },
  confirmRow: {
    gap: spacing.sm,
  },
  confirmText: {
    ...typeScale.bodyMedium,
    color: colors.ink,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.paperDim,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelLabel: {
    ...typeScale.bodyMedium,
    color: colors.inkSoft,
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: colors.coral,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  deleteConfirmLabel: {
    ...typeScale.bodyMedium,
    color: colors.ink,
  },
});
