import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../../theme';

export const AVATAR_OPTIONS = ['😎', '🦊', '🐸', '🐙', '🦄', '🐼', '🦁', '🐧', '🐢', '🌵'];

interface AvatarGridProps {
  value: string;
  onChange: (emoji: string) => void;
}

export default function AvatarGrid({ value, onChange }: AvatarGridProps) {
  return (
    <View style={styles.grid}>
      {AVATAR_OPTIONS.map((emoji) => {
        const selected = emoji === value;
        return (
          <Pressable
            key={emoji}
            onPress={() => onChange(emoji)}
            style={[styles.cell, selected && styles.cellSelected]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cell: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.paperDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cellSelected: {
    borderColor: colors.mintDeep,
    backgroundColor: colors.mint,
  },
  emoji: {
    fontSize: 28,
  },
});
