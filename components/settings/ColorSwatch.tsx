import { StyleSheet, View } from 'react-native';

interface ColorSwatchProps {
  color: string;
}

export function ColorSwatch({ color }: ColorSwatchProps) {
  return <View style={[styles.swatch, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
});
