import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface SegmentOption<T> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T> {
  options: SegmentOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
}

export function SegmentedControl<T>({
  options,
  selectedValue,
  onValueChange,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <Pressable
            key={String(option.value)}
            style={[
              styles.button,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <ThemedText
              style={[
                styles.label,
                { color: isSelected ? '#FFFFFF' : colors.text },
              ]}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
});
