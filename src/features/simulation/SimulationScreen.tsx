import { StyleSheet, Text, View } from 'react-native';

import { colors, typeScale, spacing } from '../../theme';

export default function SimulationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simuler</Text>
      <Text style={styles.body}>L'écran "Et si...?" arrive ici.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typeScale.h1,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  body: {
    ...typeScale.body,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});
