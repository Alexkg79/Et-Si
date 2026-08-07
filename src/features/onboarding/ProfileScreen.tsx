import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FRIENDLY_ERROR_MESSAGE } from '../../lib/errors';
import { DEFAULT_USER_SETTINGS, LocalProfile, UserSettings } from '../../lib/models';
import { profileRepository, settingsRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';

// Onglet Profil : affichage en lecture seule pour l'instant (le profil
// est déjà créé via CreateProfileScreen avant même d'arriver ici — voir
// RootGate). L'édition du profil et des réglages n'est pas prévue au
// MVP (CLAUDE.md section 8), donc pas de formulaire ici, juste un
// rappel honnête de ce qui est enregistré.
export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);

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
      <Text style={styles.title}>Profil</Text>

      <View style={styles.card}>
        <Text style={styles.avatar}>{profile.avatar}</Text>
        <Text style={styles.name}>{profile.firstName}</Text>
        <Text style={styles.memberSince}>Membre depuis le {memberSince}</Text>
      </View>

      <View style={styles.settingsList}>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Mode culpabilité</Text>
          <Text style={styles.settingsValue}>{settings.guiltModeEnabled ? 'Activé' : 'Désactivé'}</Text>
        </View>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Durée de simulation par défaut</Text>
          <Text style={styles.settingsValue}>{settings.simulationYears} ans</Text>
        </View>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>Rendement simulé</Text>
          <Text style={styles.settingsValue}>{Math.round(settings.simulationReturnRate * 100)} %/an</Text>
        </View>
      </View>

      <Text style={styles.hint}>
        Ces réglages se modifient depuis l'onglet Simuler. L'édition du profil arrivera dans une prochaine
        version.
      </Text>
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
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
    marginBottom: spacing.lg,
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
});
