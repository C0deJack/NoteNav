import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { ColorSwatch } from '@/components/settings/ColorSwatch';
import { SegmentedControl } from '@/components/settings/SegmentedControl';
import { SettingRow } from '@/components/settings/SettingRow';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingToggle } from '@/components/settings/SettingToggle';
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

        {/* Display Section */}
        <SettingsSection
          title="Display"
          expanded={displayExpanded}
          onToggle={() => setDisplayExpanded(!displayExpanded)}
        >
          <SettingToggle
            label="Show as Sheet Music"
            description="Display notes on a treble clef staff instead of text"
            value={settings.noteDisplayMode === 'staff'}
            onToggle={() =>
              updateSettings({
                noteDisplayMode:
                  settings.noteDisplayMode === 'text' ? 'staff' : 'text',
              })
            }
          />
          <SettingToggle
            label="White Key Labels"
            description="Show note letters on white piano keys"
            value={settings.showWhiteKeyLabels}
            onToggle={() =>
              updateSettings({
                showWhiteKeyLabels: !settings.showWhiteKeyLabels,
              })
            }
          />
          <SettingToggle
            label="Black Key Labels"
            description="Show note letters on black piano keys"
            value={settings.showBlackKeyLabels}
            onToggle={() =>
              updateSettings({
                showBlackKeyLabels: !settings.showBlackKeyLabels,
              })
            }
          />
          <SettingToggle
            label="Show Timer"
            description="Display the elapsed time during gameplay"
            value={settings.showTimer}
            onToggle={() => updateSettings({ showTimer: !settings.showTimer })}
          />
          <SettingToggle
            label="Second Octave Keyboard"
            description="Show additional keys for notes above middle B"
            value={settings.showSecondOctave}
            onToggle={() =>
              updateSettings({ showSecondOctave: !settings.showSecondOctave })
            }
          />
        </SettingsSection>

        {/* Feedback Section */}
        <SettingsSection
          title="Feedback"
          expanded={feedbackExpanded}
          onToggle={() => setFeedbackExpanded(!feedbackExpanded)}
        >
          <SettingToggle
            label="Play Sound in Silent Mode"
            description="Play sounds even when device is on silent"
            value={settings.playSoundInSilentMode}
            onToggle={() =>
              updateSettings({
                playSoundInSilentMode: !settings.playSoundInSilentMode,
              })
            }
          />
          <SettingToggle
            label="Show Incorrect Position"
            description="Highlight the staff line where an incorrect note was played"
            value={settings.showIncorrectFeedback}
            onToggle={() =>
              updateSettings({
                showIncorrectFeedback: !settings.showIncorrectFeedback,
              })
            }
          />
          <SettingToggle
            label="Haptic Feedback"
            description="Vibrate on correct and incorrect key presses"
            value={settings.enableHapticFeedback}
            onToggle={() =>
              updateSettings({
                enableHapticFeedback: !settings.enableHapticFeedback,
              })
            }
          />
          <SettingToggle
            label="Correct Note Animation"
            description="Show animation when a correct note is played"
            value={settings.showCorrectAnimation}
            onToggle={() =>
              updateSettings({
                showCorrectAnimation: !settings.showCorrectAnimation,
              })
            }
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection
          title="Appearance"
          expanded={appearanceExpanded}
          onToggle={() => setAppearanceExpanded(!appearanceExpanded)}
        >
          <SettingRow
            label="Color Scheme"
            description="Choose light, dark, or follow system settings"
          />
          <SegmentedControl
            options={colorSchemeOptions}
            selectedValue={preference}
            onValueChange={onPreferenceChange}
          />

          {/* Custom Colors - nested section */}
          <SettingsSection
            title="Custom Colours"
            titleType="default"
            expanded={customColorsExpanded}
            onToggle={() => setCustomColorsExpanded(!customColorsExpanded)}
          >
            {customColorOptions.map((option) => (
              <SettingRow
                key={option.key}
                label={option.label}
                description={option.description}
                onPress={() => handleOpenColorPicker(option.key)}
                rightElement={<ColorSwatch color={getColorValue(option.key)} />}
              />
            ))}

            <Pressable
              style={[styles.resetButton, { borderColor: colors.border }]}
              onPress={resetCustomColors}
            >
              <ThemedText style={styles.resetButtonText}>
                Reset to Defaults
              </ThemedText>
            </Pressable>
          </SettingsSection>
        </SettingsSection>
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
