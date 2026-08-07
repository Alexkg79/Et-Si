import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

import { EmptyState } from '../dashboard';
import { formatEuro } from '../../lib/format';
import { getEquivalence } from '../../lib/equivalences';
import { computeFutureValue } from '../../lib/simulation';
import { DEFAULT_USER_SETTINGS, Habit, UserSettings } from '../../lib/models';
import { habitRepository, settingsRepository } from '../../lib/storage';
import { colors, radii, spacing, typeScale } from '../../theme';
import type { RootTabParamList } from '../../navigation/RootNavigator';
import SimulationChip from './SimulationChip';

const MIN_YEARS = 5;
const MAX_YEARS = 40;
const ALL_KEY = 'all';

export default function SimulationScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [selectedKey, setSelectedKey] = useState<string>(ALL_KEY);
  const [years, setYears] = useState(DEFAULT_USER_SETTINGS.simulationYears);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([habitRepository.getAll(), settingsRepository.get()]).then(([habitsData, settingsData]) => {
        if (cancelled) return;
        setHabits(habitsData);
        setSettings(settingsData);
        setYears(settingsData.simulationYears);
        setSelectedKey((current) => {
          if (current === ALL_KEY) return current;
          const stillExists = habitsData.some((habit) => habit.id === current && habit.active);
          return stillExists ? current : ALL_KEY;
        });
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleYearsCommit = async (value: number) => {
    const rounded = Math.round(value);
    const updated: UserSettings = { ...settings, simulationYears: rounded };
    setSettings(updated);
    await settingsRepository.save(updated);
  };

  const handleToggleGuiltMode = async (value: boolean) => {
    const updated: UserSettings = { ...settings, guiltModeEnabled: value };
    setSettings(updated);
    await settingsRepository.save(updated);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.mintDeep} />
      </View>
    );
  }

  const activeHabits = habits.filter((habit) => habit.active);

  if (activeHabits.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          emoji="🔮"
          title="Rien à simuler pour l'instant"
          body="Ajoute au moins une fuite pour voir ce qu'elle aurait pu valoir."
          buttonLabel="Ajouter une fuite"
          onPress={() => navigation.navigate('Ajouter')}
        />
      </View>
    );
  }

  const selectedHabits = selectedKey === ALL_KEY ? activeHabits : activeHabits.filter((habit) => habit.id === selectedKey);
  const projectedValue = computeFutureValue(selectedHabits, settings.simulationReturnRate, years);
  const returnRatePercent = Math.round(settings.simulationReturnRate * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Et si...?</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        <SimulationChip label="Tout cumulé" selected={selectedKey === ALL_KEY} onPress={() => setSelectedKey(ALL_KEY)} />
        {activeHabits.map((habit) => (
          <SimulationChip
            key={habit.id}
            label={`${habit.emoji} ${habit.name}`}
            selected={selectedKey === habit.id}
            onPress={() => setSelectedKey(habit.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.resultCard}>
        <Text style={styles.resultSubtitle}>Sur {years} ans, ça donnerait</Text>
        <Text style={styles.resultAmount}>{formatEuro(projectedValue)}</Text>
        <Text style={styles.equivalence}>Soit à peu près : {getEquivalence(projectedValue)}</Text>
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>{MIN_YEARS} ans</Text>
          <Text style={styles.sliderYears}>{years} ans</Text>
          <Text style={styles.sliderLabel}>{MAX_YEARS} ans</Text>
        </View>
        <Slider
          minimumValue={MIN_YEARS}
          maximumValue={MAX_YEARS}
          step={1}
          value={years}
          onValueChange={(value) => setYears(Math.round(value))}
          onSlidingComplete={handleYearsCommit}
          minimumTrackTintColor={colors.mint}
          maximumTrackTintColor={colors.paperDim}
          thumbTintColor={colors.mintDeep}
        />
      </View>

      <View style={styles.guiltRow}>
        <View style={styles.guiltTextColumn}>
          <Text style={styles.guiltLabel}>Mode culpabilité</Text>
          <Text style={styles.guiltHint}>Active des notifications ironiques sur l'écran Accueil.</Text>
        </View>
        <Switch
          value={settings.guiltModeEnabled}
          onValueChange={handleToggleGuiltMode}
          trackColor={{ false: colors.paperDim, true: colors.mint }}
          thumbColor={colors.paper}
        />
      </View>

      <Text style={styles.disclaimer}>
        Simulation basée sur un rendement de {returnRatePercent} %/an. À visée humoristique, pas un conseil
        financier.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  chipsRow: {
    marginBottom: spacing.lg,
  },
  resultCard: {
    backgroundColor: colors.ink,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  resultSubtitle: {
    ...typeScale.label,
    color: colors.mint,
    marginBottom: spacing.xs,
  },
  resultAmount: {
    ...typeScale.amountLarge,
    color: colors.mint,
    marginBottom: spacing.sm,
  },
  equivalence: {
    ...typeScale.body,
    color: colors.paperDim,
  },
  sliderSection: {
    marginBottom: spacing.lg,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sliderLabel: {
    ...typeScale.caption,
    color: colors.inkSoft,
  },
  sliderYears: {
    ...typeScale.amountSmall,
    color: colors.ink,
  },
  guiltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paperDim,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  guiltTextColumn: {
    flex: 1,
  },
  guiltLabel: {
    ...typeScale.bodyMedium,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  guiltHint: {
    ...typeScale.caption,
    color: colors.inkSoft,
  },
  disclaimer: {
    ...typeScale.caption,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});
