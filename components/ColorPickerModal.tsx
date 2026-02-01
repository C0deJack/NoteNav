import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface ColorPickerModalProps {
  visible: boolean;
  currentColor: string;
  title: string;
  onColorSelected: (color: string) => void;
  onClose: () => void;
}

export function ColorPickerModal({
  visible,
  currentColor,
  title,
  onColorSelected,
  onClose,
}: ColorPickerModalProps) {
  const { colors } = useTheme();
  const [selectedColor, setSelectedColor] = useState(currentColor);

  const handleConfirm = () => {
    onColorSelected(selectedColor);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>

          <View style={styles.pickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChangeComplete={setSelectedColor}
              thumbSize={30}
              sliderSize={30}
              noSnap
              row={false}
            />
          </View>

          <View style={styles.preview}>
            <ThemedText style={styles.previewLabel}>Preview:</ThemedText>
            <View
              style={[styles.previewColor, { backgroundColor: selectedColor }]}
            />
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <ThemedText>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleConfirm}
            >
              <ThemedText style={{ color: '#FFFFFF' }}>Confirm</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    height: 300,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  previewLabel: {
    fontSize: 14,
  },
  previewColor: {
    flex: 1,
    height: 40,
    borderRadius: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  confirmButton: {
    borderWidth: 0,
  },
});
