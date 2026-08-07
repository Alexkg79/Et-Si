import { StyleSheet, Text, View } from 'react-native';

import { colors, typeScale, spacing } from '../../theme';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accueil</Text>
      <Text style={styles.body}>Le relevé de tes fuites d'argent arrive ici.</Text>
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
