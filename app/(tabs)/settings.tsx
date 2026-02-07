import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { defaultBrandColors } from '@/constants/Colors';
import {
  type ColorSchemePreference,
  type CustomColorKey,
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
  { value: 'custom', label: 'Custom' },
];

const chevronIconSize = 35;

const customColorOptions: {
  key: CustomColorKey;
  label: string;
  description: string;
}[] = [
  {
    key: 'highlight',
    label: 'Highlight',
    description: 'Accent color for buttons and notes',
  },
  { key: 'primary', label: 'Primary', description: 'Correct feedback color' },
  {
    key: 'secondary',
    label: 'Secondary',
    description: 'Background color (light mode)',
  },
  { key: 'dark', label: 'Dark', description: 'Dark background color' },
  { key: 'light', label: 'Light', description: 'Light text and elements' },
];

export default function Settings() {
  const { colors } = useTheme();
  const {
    preference,
    setPreference,
    customColors,
    setCustomColor,
    resetCustomColors,
    resolvedScheme,
  } = useThemeContext();
  const { settings, updateSettings } = useGameSettings();
  const insets = useSafeAreaInsets();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [editingColor, setEditingColor] = useState<CustomColorKey | null>(null);
  const [customColorsExpanded, setCustomColorsExpanded] = useState(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState(true);
  const [displayExpanded, setDisplayExpanded] = useState(true);
  const [appearanceExpanded, setAppearanceExpanded] = useState(true);

  const onPreferenceChange = (newPreference: ColorSchemePreference) => {
    if (newPreference === 'custom') {
      setAppearanceExpanded(true);
      setCustomColorsExpanded(true);
    }
    setPreference(newPreference);
  };

  const getColorValue = (key: CustomColorKey) => {
    return customColors[key] ?? defaultBrandColors[resolvedScheme][key];
  };

  const handleOpenColorPicker = (key: CustomColorKey) => {
    setEditingColor(key);
    setColorPickerVisible(true);
  };

  const handleColorSelected = (color: string) => {
    if (editingColor) {
      setCustomColor(editingColor, color);
    }
  };

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

  const handleToggleIncorrectFeedback = () => {
    updateSettings({ showIncorrectFeedback: !settings.showIncorrectFeedback });
  };

  const handleToggleHapticFeedback = () => {
    updateSettings({ enableHapticFeedback: !settings.enableHapticFeedback });
  };

  const handleToggleSilentMode = () => {
    updateSettings({ playSoundInSilentMode: !settings.playSoundInSilentMode });
  };

  const handleToggleTimer = () => {
    updateSettings({ showTimer: !settings.showTimer });
  };

  const handleToggleCorrectAnimation = () => {
    updateSettings({ showCorrectAnimation: !settings.showCorrectAnimation });
  };

  const handleToggleSecondOctave = () => {
    updateSettings({ showSecondOctave: !settings.showSecondOctave });
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>

        {/* Display - expandable section */}
        <View style={styles.section}>
          <Pressable
            style={styles.expandableHeader}
            onPress={() => setDisplayExpanded(!displayExpanded)}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Display
            </ThemedText>
            <Ionicons
              name={displayExpanded ? 'chevron-up' : 'chevron-down'}
              size={chevronIconSize}
              color={colors.settingsChevron}
            />
          </Pressable>

          {displayExpanded && (
            <View style={styles.expandableContent}>
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

              <Pressable
                style={[styles.settingRow, { borderColor: colors.border }]}
                onPress={handleToggleTimer}
              >
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>
                    Show Timer
                  </ThemedText>
                  <ThemedText type="muted" style={styles.settingDescription}>
                    Display the elapsed time during gameplay
                  </ThemedText>
                </View>
                <Switch
                  value={settings.showTimer}
                  onValueChange={handleToggleTimer}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </Pressable>

              <Pressable
                style={[styles.settingRow, { borderColor: colors.border }]}
                onPress={handleToggleSecondOctave}
              >
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>
                    Second Octave Keyboard
                  </ThemedText>
                  <ThemedText type="muted" style={styles.settingDescription}>
                    Show additional keys for notes above middle B
                  </ThemedText>
                </View>
                <Switch
                  value={settings.showSecondOctave}
                  onValueChange={handleToggleSecondOctave}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </Pressable>
            </View>
          )}
        </View>

        {/* Feedback - expandable section */}
        <View style={styles.section}>
          <Pressable
            style={styles.expandableHeader}
            onPress={() => setFeedbackExpanded(!feedbackExpanded)}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Feedback
            </ThemedText>
            <Ionicons
              name={feedbackExpanded ? 'chevron-up' : 'chevron-down'}
              size={chevronIconSize}
              color={colors.settingsChevron}
            />
          </Pressable>

          {feedbackExpanded && (
            <View style={styles.expandableContent}>
              <Pressable
                style={[styles.settingRow, { borderColor: colors.border }]}
                onPress={handleToggleSilentMode}
              >
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>
                    Play Sound in Silent Mode
                  </ThemedText>
                  <ThemedText type="muted" style={styles.settingDescription}>
                    Play sounds even when device is on silent
                  </ThemedText>
                </View>
                <Switch
                  value={settings.playSoundInSilentMode}
                  onValueChange={handleToggleSilentMode}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </Pressable>

              <Pressable
                style={[styles.settingRow, { borderColor: colors.border }]}
                onPress={handleToggleIncorrectFeedback}
              >
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>
                    Show Incorrect Position
                  </ThemedText>
                  <ThemedText type="muted" style={styles.settingDescription}>
                    Highlight the staff line where an incorrect note was played
                  </ThemedText>
                </View>
                <Switch
                  value={settings.showIncorrectFeedback}
                  onValueChange={handleToggleIncorrectFeedback}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </Pressable>

              <Pressable
                style={[styles.settingRow, { borderColor: colors.border }]}
                onPress={handleToggleHapticFeedback}
              >
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>
                    Haptic Feedback
                  </ThemedText>
                  <ThemedText type="muted" style={styles.settingDescription}>
                    Vibrate on correct and incorrect key presses
                  </ThemedText>
                </View>
                <Switch
                  value={settings.enableHapticFeedback}
                  onValueChange={handleToggleHapticFeedback}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </Pressable>

              <Pressable
                style={[styles.settingRow, { borderColor: colors.border }]}
                onPress={handleToggleCorrectAnimation}
              >
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>
                    Correct Note Animation
                  </ThemedText>
                  <ThemedText type="muted" style={styles.settingDescription}>
                    Show animation when a correct note is played
                  </ThemedText>
                </View>
                <Switch
                  value={settings.showCorrectAnimation}
                  onValueChange={handleToggleCorrectAnimation}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </Pressable>
            </View>
          )}
        </View>

        {/* Appearance - expandable section */}
        <View style={styles.section}>
          <Pressable
            style={styles.expandableHeader}
            onPress={() => setAppearanceExpanded(!appearanceExpanded)}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Appearance
            </ThemedText>
            <Ionicons
              name={appearanceExpanded ? 'chevron-up' : 'chevron-down'}
              size={chevronIconSize}
              color={colors.settingsChevron}
            />
          </Pressable>

          {appearanceExpanded && (
            <View style={styles.expandableContent}>
              <View style={[styles.settingRow, { borderColor: colors.border }]}>
                <View style={styles.settingInfo}>
                  <ThemedText style={styles.settingLabel}>
                    Color Scheme
                  </ThemedText>
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
                    onPress={() => onPreferenceChange(option.value)}
                  >
                    <ThemedText
                      style={[
                        styles.segmentLabel,
                        {
                          color:
                            preference === option.value
                              ? '#FFFFFF'
                              : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>

              {/* Custom Colors - nested expandable */}
              <Pressable
                style={styles.expandableHeader}
                onPress={() => setCustomColorsExpanded(!customColorsExpanded)}
              >
                <ThemedText style={styles.settingLabel}>
                  Custom Colours
                </ThemedText>
                <Ionicons
                  name={customColorsExpanded ? 'chevron-up' : 'chevron-down'}
                  size={chevronIconSize}
                  color={colors.settingsChevron}
                />
              </Pressable>

              {customColorsExpanded && (
                <View style={styles.expandableContent}>
                  {customColorOptions.map((option) => (
                    <Pressable
                      key={option.key}
                      style={[
                        styles.settingRow,
                        { borderColor: colors.border },
                      ]}
                      onPress={() => handleOpenColorPicker(option.key)}
                    >
                      <View style={styles.settingInfo}>
                        <ThemedText style={styles.settingLabel}>
                          {option.label}
                        </ThemedText>
                        <ThemedText
                          type="muted"
                          style={styles.settingDescription}
                        >
                          {option.description}
                        </ThemedText>
                      </View>
                      <View
                        style={[
                          styles.colorSwatch,
                          { backgroundColor: getColorValue(option.key) },
                        ]}
                      />
                    </Pressable>
                  ))}

                  <Pressable
                    style={[styles.resetButton, { borderColor: colors.border }]}
                    onPress={resetCustomColors}
                  >
                    <ThemedText style={styles.resetButtonText}>
                      Reset to Defaults
                    </ThemedText>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <ColorPickerModal
        visible={colorPickerVisible}
        currentColor={editingColor ? getColorValue(editingColor) : '#000000'}
        title={`Choose ${editingColor ?? ''} Color`}
        onColorSelected={handleColorSelected}
        onClose={() => setColorPickerVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    marginTop: 16,
    marginBottom: 24,
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  expandableContent: {
    gap: 12,
    marginTop: 12,
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
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 4,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
