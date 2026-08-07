import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OnboardingScreen } from '../onboarding';
import { EditHabitScreen } from '../habits';
import { DEFAULT_USER_SETTINGS, Habit, LocalProfile, UserSettings } from '../../lib/models';
import { habitRepository, profileRepository, settingsRepository } from '../../lib/storage';
import { yearsSince, computeFutureValue } from '../../lib/simulation';
import { colors, spacing, typeScale } from '../../theme';
import GhostWalletCard from './GhostWalletCard';
import HabitReceiptRow from './HabitReceiptRow';
import GuiltNotification from './GuiltNotification';
import EmptyState from './EmptyState';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [habits, setHabits] = useState<Habit[]>([]);

  const refresh = useCallback(async () => {
    const [profileData, settingsData, habitsData] = await Promise.all([
      profileRepository.get(),
      settingsRepository.get(),
      habitRepository.getAll(),
    ]);
    setProfile(profileData);
    setSettings(settingsData);
    setHabits(habitsData);
    setLoading(false);
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

  if (loading || !profile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.mintDeep} />
      </View>
    );
  }

  const activeHabits = habits.filter((habit) => habit.active);
  const years = yearsSince(profile.createdAt);
  const totalValue = computeFutureValue(activeHabits, settings.simulationReturnRate, years);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>
        Salut {profile.firstName} {profile.avatar}
      </Text>

      {activeHabits.length === 0 ? (
        <EmptyState onStartOnboarding={() => setShowOnboarding(true)} />
      ) : (
        <>
          <GhostWalletCard totalValue={totalValue} sinceDateISO={profile.createdAt} />

          <View style={styles.receiptList}>
            {activeHabits.map((habit) => (
              <HabitReceiptRow key={habit.id} habit={habit} onPress={() => setEditingHabit(habit)} />
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
