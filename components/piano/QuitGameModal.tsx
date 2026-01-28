import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

interface QuitGameModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function QuitGameModal({
  visible,
  onCancel,
  onConfirm,
}: QuitGameModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      supportedOrientations={['landscape-left', 'landscape-right']}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <ThemedText style={styles.title}>Quit Game?</ThemedText>
          <ThemedText style={styles.message}>
            Your progress will be lost.
          </ThemedText>

          <View style={styles.buttons}>
            <Pressable
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: colors.border },
              ]}
              onPress={onCancel}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onConfirm}
            >
              <ThemedText style={styles.confirmButtonText}>Quit</ThemedText>
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
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
