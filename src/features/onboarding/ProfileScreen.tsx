import { StyleSheet, Text, View } from 'react-native';

import { colors, typeScale, spacing } from '../../theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.body}>La création de profil arrive ici (Phase 1).</Text>
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
