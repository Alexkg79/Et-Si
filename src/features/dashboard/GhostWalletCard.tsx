import { StyleSheet, Text, View } from 'react-native';

import { formatEuro } from '../../lib/format';
import { colors, radii, spacing, typeScale } from '../../theme';
import AnimatedAmount from './AnimatedAmount';

interface GhostWalletCardProps {
  totalValue: number;
  sinceDateISO: string;
}

export default function GhostWalletCard({ totalValue, sinceDateISO }: GhostWalletCardProps) {
  const sinceLabel = new Date(sinceDateISO).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Portefeuille fantôme</Text>
      <AnimatedAmount value={totalValue} style={styles.amount}>
        {formatEuro(totalValue)}
      </AnimatedAmount>
      <Text style={styles.subtitle}>si t'avais tout investi depuis le {sinceLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ink,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    ...typeScale.label,
    color: colors.mint,
    marginBottom: spacing.xs,
  },
  amount: {
    ...typeScale.amountLarge,
    color: colors.mint,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typeScale.caption,
    color: colors.paperDim,
  },
});
