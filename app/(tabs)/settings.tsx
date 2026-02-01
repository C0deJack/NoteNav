import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  type ColorSchemePreference,
  useThemeContext,
} from '@/contexts/ThemeContext';
import { useGameSettings } from '@/hooks/useGameSettings';
import { useTheme } from '@/hooks/useTheme';

const colorSchemeOptions: {
  value: ColorSchemePreference;
  label: string;
}[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

export default function Settings() {
  const { colors } = useTheme();
  const { preference, setPreference } = useThemeContext();
  const { settings, updateSettings } = useGameSettings();
  const insets = useSafeAreaInsets();

  const handleToggleWhiteKeyLabels = () => {
    updateSettings({ showWhiteKeyLabels: !settings.showWhiteKeyLabels });
  };

  const handleToggleBlackKeyLabels = () => {
    updateSettings({ showBlackKeyLabels: !settings.showBlackKeyLabels });
  };

  const handleToggleNoteDisplayMode = () => {
    updateSettings({
      noteDisplayMode: settings.noteDisplayMode === 'text' ? 'staff' : 'text',
    });
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title" style={styles.title}>
        Settings
      </ThemedText>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Note Labels
        </ThemedText>

        <Pressable
          style={[styles.settingRow, { borderColor: colors.border }]}
          onPress={handleToggleWhiteKeyLabels}
        >
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>
              White Key Labels
            </ThemedText>
            <ThemedText type="muted" style={styles.settingDescription}>
              Show note letters on white piano keys
            </ThemedText>
          </View>
          <Switch
            value={settings.showWhiteKeyLabels}
            onValueChange={handleToggleWhiteKeyLabels}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </Pressable>

        <Pressable
          style={[styles.settingRow, { borderColor: colors.border }]}
          onPress={handleToggleBlackKeyLabels}
        >
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>
              Black Key Labels
            </ThemedText>
            <ThemedText type="muted" style={styles.settingDescription}>
              Show note letters on black piano keys
            </ThemedText>
          </View>
          <Switch
            value={settings.showBlackKeyLabels}
            onValueChange={handleToggleBlackKeyLabels}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Note Display
        </ThemedText>

        <Pressable
          style={[styles.settingRow, { borderColor: colors.border }]}
          onPress={handleToggleNoteDisplayMode}
        >
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>
              Show as Sheet Music
            </ThemedText>
            <ThemedText type="muted" style={styles.settingDescription}>
              Display notes on a treble clef staff instead of text
            </ThemedText>
          </View>
          <Switch
            value={settings.noteDisplayMode === 'staff'}
            onValueChange={handleToggleNoteDisplayMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Appearance
        </ThemedText>

        <View style={[styles.settingRow, { borderColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>Color Scheme</ThemedText>
            <ThemedText type="muted" style={styles.settingDescription}>
              Choose light, dark, or follow system settings
            </ThemedText>
          </View>
        </View>

        <View style={styles.segmentedControl}>
          {colorSchemeOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.segmentButton,
                {
                  backgroundColor:
                    preference === option.value
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setPreference(option.value)}
            >
              <ThemedText
                style={[
                  styles.segmentLabel,
                  {
                    color:
                      preference === option.value ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});
