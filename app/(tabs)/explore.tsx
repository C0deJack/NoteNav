import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DIFFICULTIES } from '@/constants/PianoConfig';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import type { GameScore } from '@/types/piano';
import { formatTime } from '@/utils/formatting';

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ScoreItem({ score, colors }: { score: GameScore; colors: any }) {
  const difficultyLabel =
    DIFFICULTIES.find((d) => d.value === score.difficulty)?.label || 'Unknown';

  return (
    <View style={[styles.scoreItem, { borderColor: colors.border }]}>
      <View style={styles.scoreHeader}>
        <ThemedText style={styles.scoreAccuracy}>{score.accuracy}%</ThemedText>
        <ThemedText type="muted" style={styles.scoreDate}>
          {formatDate(score.timestamp)}
        </ThemedText>
      </View>
      <View style={styles.scoreDetails}>
        <ThemedText type="muted">
          {difficultyLabel} ({score.difficulty} notes)
        </ThemedText>
        <ThemedText type="muted">{formatTime(score.elapsedMs)}</ThemedText>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const { colors } = useTheme();
  const { scores, loaded, resetProgress, getStats } = useProgress();
  const insets = useSafeAreaInsets();
  const [showResetModal, setShowResetModal] = useState(false);

  const stats = getStats();

  const handleResetConfirm = () => {
    resetProgress();
    setShowResetModal(false);
  };

  if (!loaded) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title" style={styles.title}>
        Progress
      </ThemedText>

      {scores.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText type="muted" style={styles.emptyText}>
            No games played yet.
          </ThemedText>
          <ThemedText type="muted" style={styles.emptyText}>
            Complete a game to see your progress here!
          </ThemedText>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <ThemedText style={styles.statValue}>
                {stats.totalGames}
              </ThemedText>
              <ThemedText type="muted" style={styles.statLabel}>
                Games Played
              </ThemedText>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <ThemedText style={styles.statValue}>
                {stats.averageAccuracy}%
              </ThemedText>
              <ThemedText type="muted" style={styles.statLabel}>
                Avg Accuracy
              </ThemedText>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <ThemedText style={styles.statValue}>
                {stats.bestAccuracy}%
              </ThemedText>
              <ThemedText type="muted" style={styles.statLabel}>
                Best Accuracy
              </ThemedText>
            </View>
          </View>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Games
          </ThemedText>

          <FlatList
            data={scores}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ScoreItem score={item} colors={colors} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <Pressable
            style={[styles.resetButton, { borderColor: colors.border }]}
            onPress={() => setShowResetModal(true)}
          >
            <ThemedText style={styles.resetButtonText}>
              Reset Progress
            </ThemedText>
          </Pressable>
        </>
      )}

      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Reset Progress?
            </ThemedText>
            <ThemedText type="muted" style={styles.modalText}>
              This will delete all your game history and statistics. This action
              cannot be undone.
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { borderColor: colors.border }]}
                onPress={() => setShowResetModal(false)}
              >
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.modalButtonDanger,
                  { backgroundColor: '#dc3545' },
                ]}
                onPress={handleResetConfirm}
              >
                <ThemedText style={{ color: '#fff' }}>Reset</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 16,
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
    gap: 8,
  },
  scoreItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreAccuracy: {
    fontSize: 20,
    fontWeight: '600',
  },
  scoreDate: {
    fontSize: 12,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#dc3545',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalButtonDanger: {
    borderWidth: 0,
  },
});
