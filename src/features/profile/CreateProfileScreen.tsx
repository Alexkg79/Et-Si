import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FRIENDLY_ERROR_MESSAGE } from '../../lib/errors';
import { profileRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';

const AVATAR_OPTIONS = ['😎', '🦊', '🐸', '🐙', '🦄', '🐼', '🦁', '🐧', '🐢', '🌵'];

interface CreateProfileScreenProps {
  onCreated: () => void;
}

export default function CreateProfileScreen({ onCreated }: CreateProfileScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = firstName.trim();
  const canSubmit = trimmedName.length > 0 && !saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    try {
      await profileRepository.save({ firstName: trimmedName, avatar, createdAt: new Date().toISOString() });
      onCreated();
    } catch {
      setError(FRIENDLY_ERROR_MESSAGE);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue 👋</Text>

      <Text style={styles.label}>Comment on t'appelle ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ton prénom"
        placeholderTextColor={colors.inkSoft}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={30}
      />

      <Text style={styles.label}>Choisis ton avatar</Text>
      <View style={styles.avatarGrid}>
        {AVATAR_OPTIONS.map((emoji) => {
          const selected = emoji === avatar;
          return (
            <Pressable
              key={emoji}
              onPress={() => setAvatar(emoji)}
              style={[styles.avatarCell, selected && styles.avatarCellSelected]}
            >
              <Text style={styles.avatarEmoji}>{emoji}</Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
      >
        <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
          {saving ? 'Enregistrement...' : "C'est parti"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  label: {
    ...typeScale.label,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  input: {
    ...typeScale.body,
    color: colors.ink,
    backgroundColor: colors.paperDim,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  avatarCell: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.paperDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCellSelected: {
    borderColor: colors.mintDeep,
    backgroundColor: colors.mint,
  },
  avatarEmoji: {
    fontSize: 28,
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
  errorText: {
    ...typeScale.caption,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  submitLabel: {
    ...typeScale.bodyMedium,
    color: colors.ink,
  },
  submitLabelDisabled: {
    color: colors.inkSoft,
  },
});
