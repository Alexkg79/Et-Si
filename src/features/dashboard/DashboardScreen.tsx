import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OnboardingScreen } from '../onboarding';
import { EditHabitScreen } from '../habits';
import { FRIENDLY_ERROR_MESSAGE } from '../../lib/errors';
import { DEFAULT_USER_SETTINGS, Habit, LocalProfile, UserSettings } from '../../lib/models';
import { habitRepository, profileRepository, settingsRepository } from '../../lib/storage';
import { yearsSince, computeAnnualCost, computeFutureValue } from '../../lib/simulation';
import { colors, radii, spacing, typeScale } from '../../theme';
import GhostWalletCard from './GhostWalletCard';
import HabitReceiptRow from './HabitReceiptRow';
import GuiltNotification from './GuiltNotification';
import EmptyState from './EmptyState';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [habits, setHabits] = useState<Habit[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [profileData, settingsData, habitsData] = await Promise.all([
        profileRepository.get(),
        settingsRepository.get(),
        habitRepository.getAll(),
      ]);
      setProfile(profileData);
      setSettings(settingsData);
      setHabits(habitsData);
      setError(null);
    } catch {
      setError(FRIENDLY_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onDone={() => {
          setShowOnboarding(false);
          refresh();
        }}
      />
    );
  }

  if (editingHabit) {
    return (
      <EditHabitScreen
        habit={editingHabit}
        onCancel={() => setEditingHabit(null)}
        onDone={() => {
          setEditingHabit(null);
          refresh();
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.mintDeep} />
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryLabel}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (!profile) return null;

  // Tri par coût annualisé décroissant : la plus grosse fuite en tête,
  // pour le diagnostic (CLAUDE.md §6, écran Accueil).
  const activeHabits = habits
    .filter((habit) => habit.active)
    .sort((a, b) => computeAnnualCost(b) - computeAnnualCost(a));
  const years = yearsSince(profile.createdAt);
  const totalValue = computeFutureValue(activeHabits, settings.simulationReturnRate, years);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>
        Salut {profile.firstName} {profile.avatar}
      </Text>

      {activeHabits.length === 0 ? (
        <EmptyState
          title="Aucune fuite recensée"
          body="Tant que t'as rien coché, ton portefeuille fantôme reste... fantôme."
          buttonLabel="Traquer mes fuites"
          onPress={() => setShowOnboarding(true)}
        />
      ) : (
        <>
          <GhostWalletCard totalValue={totalValue} sinceDateISO={profile.createdAt} />

          <View style={styles.receiptList}>
            {activeHabits.map((habit, index) => (
              <HabitReceiptRow
                key={habit.id}
                habit={habit}
                isTopHabit={index === 0}
                onPress={() => setEditingHabit(habit)}
              />
            ))}
          </View>

          {settings.guiltModeEnabled ? (
            <GuiltNotification
              habits={activeHabits}
              annualReturnRate={settings.simulationReturnRate}
              years={settings.simulationYears}
            />
          ) : null}
        </>
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
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.mint,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  retryLabel: {
    ...typeScale.bodyMedium,
    color: colors.ink,
  },
  greeting: {
    ...typeScale.h2,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  receiptList: {
    marginBottom: spacing.md,
  },
});
