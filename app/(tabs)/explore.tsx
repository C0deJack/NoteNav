import { useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DIFFICULTY_LEVELS } from '@/constants/PianoConfig';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import type {
  DifficultyLevel,
  DifficultyStats,
  GameScore,
} from '@/types/piano';
import { formatTime } from '@/utils/formatting';
import { getDifficultyLabel } from '@/utils/game';
import {
  calculateNotesPerMinute,
  calculateScoreFromGame,
} from '@/utils/scoring';

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
  const difficultyLabel = getDifficultyLabel(score.difficultyLevel);

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
          {difficultyLabel} ({score.noteCount} notes)
        </ThemedText>
        <ThemedText type="muted">{formatTime(score.elapsedMs)}</ThemedText>
      </View>
    </View>
  );
}

function StatsCard({ stats, colors }: { stats: DifficultyStats; colors: any }) {
  if (stats.totalGames === 0) {
    return (
      <View style={styles.emptyLevelState}>
        <ThemedText type="muted" style={styles.emptyText}>
          No games played at this level yet.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
        <ThemedText style={styles.statValue}>{stats.bestScore}</ThemedText>
        <ThemedText type="muted" style={styles.statLabel}>
          Best Score
        </ThemedText>
      </View>
      <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
        <ThemedText style={styles.statValue}>
          {stats.averageAccuracy}%
        </ThemedText>
        <ThemedText type="muted" style={styles.statLabel}>
          Avg Accuracy
        </ThemedText>
      </View>
      <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
        <ThemedText style={styles.statValue}>{stats.bestSpeed}</ThemedText>
        <ThemedText type="muted" style={styles.statLabel}>
          Best Speed
        </ThemedText>
      </View>
    </View>
  );
}

function DifficultyTabs({
  selectedLevel,
  onSelectLevel,
  colors,
}: {
  selectedLevel: DifficultyLevel;
  onSelectLevel: (level: DifficultyLevel) => void;
  colors: any;
}) {
  return (
    <View style={styles.tabsContainer}>
      {DIFFICULTY_LEVELS.map(({ value, label }) => (
        <Pressable
          key={value}
          style={[
            styles.tab,
            {
              backgroundColor:
                selectedLevel === value ? colors.primary : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onSelectLevel(value)}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedLevel === value && styles.tabTextSelected,
            ]}
          >
            {label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const CHART_COLORS = {
  score: '#4CAF50', // Green
  accuracy: '#2196F3', // Blue
  speed: '#FF9800', // Orange
};

function ProgressLineChart({
  scores,
  colors,
  isDark,
}: {
  scores: GameScore[];
  colors: any;
  isDark: boolean;
}) {
  const chartData = useMemo(() => {
    // Take the last 10 games and reverse so oldest is first (left to right)
    const recentScores = scores.slice(0, 10).reverse();

    if (recentScores.length < 2) {
      return null;
    }

    const scoreValues = recentScores.map((s) => calculateScoreFromGame(s));
    const accuracyValues = recentScores.map((s) => s.accuracy);
    const speedValues = recentScores.map((s) => {
      const npm = calculateNotesPerMinute(s.noteCount, s.elapsedMs);
      // Normalize speed to 0-100 scale for chart (cap at 60 npm = 100)
      return Math.min(100, Math.round((npm / 60) * 100));
    });

    return {
      labels: recentScores.map((_, i) => String(i + 1)),
      datasets: [
        {
          data: scoreValues,
          color: () => CHART_COLORS.score,
          strokeWidth: 2,
        },
        {
          data: accuracyValues,
          color: () => CHART_COLORS.accuracy,
          strokeWidth: 2,
        },
        {
          data: speedValues,
          color: () => CHART_COLORS.speed,
          strokeWidth: 2,
        },
      ],
      legend: ['Score', 'Accuracy', 'Speed'],
    };
  }, [scores]);

  if (!chartData) {
    return (
      <View style={styles.chartPlaceholder}>
        <ThemedText type="muted" style={styles.emptyText}>
          Play at least 2 games to see your progress chart.
        </ThemedText>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 32;

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={180}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) =>
            isDark
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) =>
            isDark
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 12,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '1',
          },
        }}
        bezier
        style={styles.chart}
        fromZero
        yAxisSuffix=""
        yAxisInterval={1}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: CHART_COLORS.score }]}
          />
          <ThemedText style={styles.legendText}>Score</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: CHART_COLORS.accuracy },
            ]}
          />
          <ThemedText style={styles.legendText}>Accuracy</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: CHART_COLORS.speed }]}
          />
          <ThemedText style={styles.legendText}>Speed</ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const { colors, isDark } = useTheme();
  const { scores, loaded, resetProgress, getStatsByDifficultyLevel } =
    useProgress();
  const insets = useSafeAreaInsets();
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('easy');

  const statsByLevel = getStatsByDifficultyLevel();
  const currentStats = statsByLevel[selectedLevel];
  const filteredScores = scores.filter(
    (s) => s.difficultyLevel === selectedLevel,
  );

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
          <DifficultyTabs
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            colors={colors}
          />

          <StatsCard stats={currentStats} colors={colors} />

          <ProgressLineChart
            scores={filteredScores}
            colors={colors}
            isDark={isDark}
          />

          {filteredScores.length > 0 && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Recent Games
              </ThemedText>

              <ScrollView
                style={styles.scoresList}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              >
                {filteredScores.map((score) => (
                  <ScoreItem key={score.id} score={score} colors={colors} />
                ))}
              </ScrollView>
            </>
          )}

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
  emptyLevelState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextSelected: {
    color: '#fff',
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
  chartContainer: {
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  chartPlaceholder: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  scoresList: {
    flex: 1,
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
