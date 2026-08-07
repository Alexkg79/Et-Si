import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radii, spacing, typeScale } from '../../theme';

interface NameInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function NameInput({ label, value, onChangeText }: NameInputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="Ton prénom"
        placeholderTextColor={colors.inkSoft}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typeScale.label,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  input: {
    ...typeScale.body,
    color: colors.ink,
    backgroundColor: colors.paperDim,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
