import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CreateProfileScreen } from '../features/profile';
import { OnboardingScreen } from '../features/onboarding';
import { profileRepository } from '../lib/storage';
import { colors } from '../theme';
import RootNavigator from './RootNavigator';

// Écran de garde au lancement — voir CLAUDE.md section 6 (écran 1) et
// PLAN-DEV.md Phase 1 : si un profil local existe déjà, on saute
// directement vers la navigation principale ; sinon on démarre le flow
// de création de profil puis l'onboarding des dépenses (placeholder en
// attendant la Phase 2).
type GateStep = 'loading' | 'createProfile' | 'onboarding' | 'main';

export default function RootGate() {
  const [step, setStep] = useState<GateStep>('loading');

  useEffect(() => {
    let cancelled = false;
    profileRepository.get().then((profile) => {
      if (cancelled) return;
      setStep(profile ? 'main' : 'createProfile');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (step === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.mintDeep} />
      </View>
    );
  }

  if (step === 'createProfile') {
    return <CreateProfileScreen onCreated={() => setStep('onboarding')} />;
  }

  if (step === 'onboarding') {
    return <OnboardingScreen onDone={() => setStep('main')} />;
  }

  return <RootNavigator />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
});
