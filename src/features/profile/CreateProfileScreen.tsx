import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FRIENDLY_ERROR_MESSAGE } from '../../lib/errors';
import { profileRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';
import AvatarGrid, { AVATAR_OPTIONS } from './AvatarGrid';
import NameInput from './NameInput';

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

      <View style={styles.field}>
        <NameInput label="Comment on t'appelle ?" value={firstName} onChangeText={setFirstName} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Choisis ton avatar</Text>
        <AvatarGrid value={avatar} onChange={setAvatar} />
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
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typeScale.label,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
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
