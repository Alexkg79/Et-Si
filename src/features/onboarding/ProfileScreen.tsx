import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

import { FRIENDLY_ERROR_MESSAGE } from '../../lib/errors';
import { DEFAULT_USER_SETTINGS, LocalProfile, UserSettings } from '../../lib/models';
import { profileRepository, settingsRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';
import { AvatarGrid, NameInput } from '../profile';

const MIN_YEARS = 5;
const MAX_YEARS = 40;
const MIN_RETURN_RATE = 0.01;
const MAX_RETURN_RATE = 0.15;
const RETURN_RATE_STEP = 0.01;

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftAvatar, setDraftAvatar] = useState('');
  const [draftGuiltMode, setDraftGuiltMode] = useState(false);
  const [draftYears, setDraftYears] = useState(DEFAULT_USER_SETTINGS.simulationYears);
  const [draftReturnRate, setDraftReturnRate] = useState(DEFAULT_USER_SETTINGS.simulationReturnRate);

  useFocusEffect(
    useCallback(() => {
      Promise.all([profileRepository.get(), settingsRepository.get()])
        .then(([profileData, settingsData]) => {
          setProfile(profileData);
          setSettings(settingsData);
          setError(null);
        })
        .catch(() => setError(FRIENDLY_ERROR_MESSAGE))
        .finally(() => setLoading(false));
    }, [])
  );

  const handleEditPress = () => {
    if (!profile) return;
    setDraftName(profile.firstName);
    setDraftAvatar(profile.avatar);
    setDraftGuiltMode(settings.guiltModeEnabled);
    setDraftYears(settings.simulationYears);
    setDraftReturnRate(settings.simulationReturnRate);
    setSaveError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setSaveError(null);
    setEditing(false);
  };

  const trimmedDraftName = draftName.trim();
  const canSave = trimmedDraftName.length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave || !profile) return;
    setSaveError(null);
    setSaving(true);
    try {
      const updatedProfile: LocalProfile = {
        firstName: trimmedDraftName,
        avatar: draftAvatar,
        createdAt: profile.createdAt,
      };
      const updatedSettings: UserSettings = {
        guiltModeEnabled: draftGuiltMode,
        simulationYears: draftYears,
        simulationReturnRate: draftReturnRate,
      };
      await Promise.all([profileRepository.save(updatedProfile), settingsRepository.save(updatedSettings)]);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      setEditing(false);
    } catch {
      setSaveError(FRIENDLY_ERROR_MESSAGE);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.mintDeep} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{error ?? FRIENDLY_ERROR_MESSAGE}</Text>
      </View>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profil</Text>
        {!editing ? (
          <Pressable onPress={handleEditPress} hitSlop={12}>
            <Text style={styles.editLink}>Modifier</Text>
          </Pressable>
        ) : null}
      </View>

      {editing ? (
        <>
          <View style={styles.field}>
            <NameInput label="Comment on t'appelle ?" value={draftName} onChangeText={setDraftName} />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Choisis ton avatar</Text>
            <AvatarGrid value={draftAvatar} onChange={setDraftAvatar} />
          </View>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.avatar}>{profile.avatar}</Text>
          <Text style={styles.name}>{profile.firstName}</Text>
          <Text style={styles.memberSince}>Membre depuis le {memberSince}</Text>
        </View>
      )}

      <View style={styles.settingsList}>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Mode culpabilité</Text>
          {editing ? (
            <Switch
              value={draftGuiltMode}
              onValueChange={setDraftGuiltMode}
              trackColor={{ false: colors.paperDim, true: colors.mint }}
              thumbColor={colors.paper}
            />
          ) : (
            <Text style={styles.settingsValue}>{settings.guiltModeEnabled ? 'Activé' : 'Désactivé'}</Text>
          )}
        </View>

        {editing ? (
          <View style={styles.sliderBlock}>
            <View style={styles.sliderHeader}>
              <Text style={styles.settingsLabel}>Durée de simulation par défaut</Text>
              <Text style={styles.settingsValue}>{draftYears} ans</Text>
            </View>
            <Slider
              minimumValue={MIN_YEARS}
              maximumValue={MAX_YEARS}
              step={1}
              value={draftYears}
              onValueChange={(value) => setDraftYears(Math.round(value))}
              minimumTrackTintColor={colors.mint}
              maximumTrackTintColor={colors.paper}
              thumbTintColor={colors.mintDeep}
            />
          </View>
        ) : (
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Durée de simulation par défaut</Text>
            <Text style={styles.settingsValue}>{settings.simulationYears} ans</Text>
          </View>
        )}

        {editing ? (
          <View style={styles.sliderBlockLast}>
            <View style={styles.sliderHeader}>
              <Text style={styles.settingsLabel}>Rendement simulé</Text>
              <Text style={styles.settingsValue}>{Math.round(draftReturnRate * 100)} %/an</Text>
            </View>
            <Slider
              minimumValue={MIN_RETURN_RATE}
              maximumValue={MAX_RETURN_RATE}
              step={RETURN_RATE_STEP}
              value={draftReturnRate}
              onValueChange={setDraftReturnRate}
              minimumTrackTintColor={colors.mint}
              maximumTrackTintColor={colors.paper}
              thumbTintColor={colors.mintDeep}
            />
          </View>
        ) : (
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Rendement simulé</Text>
            <Text style={styles.settingsValue}>{Math.round(settings.simulationReturnRate * 100)} %/an</Text>
          </View>
        )}
      </View>

      {editing ? (
        <>
          {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
          <View style={styles.actionsRow}>
            <Pressable onPress={handleCancel} disabled={saving} style={styles.cancelButton}>
              <Text style={styles.cancelLabel}>Annuler</Text>
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
        </>
      ) : (
        <Text style={styles.hint}>Ces réglages se modifient aussi depuis l'onglet Simuler.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: spacing.lg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    padding: spacing.lg,
  },
  errorText: {
    ...typeScale.body,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
  },
  editLink: {
    ...typeScale.bodyMedium,
    color: colors.mintDeep,
  },
  field: {
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    ...typeScale.label,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.ink,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  name: {
    ...typeScale.h2,
    color: colors.mint,
    marginBottom: spacing.xs,
  },
  memberSince: {
    ...typeScale.caption,
    color: colors.paperDim,
  },
  settingsList: {
    backgroundColor: colors.paperDim,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: colors.paper,
  },
  sliderBlock: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: colors.paper,
  },
  sliderBlockLast: {
    paddingTop: spacing.sm,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  settingsLabel: {
    ...typeScale.body,
    color: colors.ink,
  },
  settingsValue: {
    ...typeScale.amountSmall,
    color: colors.ink,
  },
  hint: {
    ...typeScale.caption,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  actionsRow: {
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
});
