import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Text } from '../../../components/Themed';
import { useLearningContext } from '@/components/LearningContext';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useSettings } from '@/contexts/SettingsContext';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function LearningScreen() {
  const {
    autoPlayAudio,
    pronunciationSpeed,
    showTransliteration,
    setAutoPlayAudio,
    setPronunciationSpeed,
    setShowTransliteration,
  } = useLearningContext();
  const { fontSize } = useSettings();
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Learning Settings' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.settingContainer}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>Auto-play audio</Text>
          <Switch value={autoPlayAudio} onValueChange={setAutoPlayAudio} />
        </View>
        <View style={styles.settingContainer}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>Show Transliteration</Text>
          <Switch
            value={showTransliteration}
            onValueChange={setShowTransliteration}
          />
        </View>
        <View style={styles.settingContainer}>
          <Text style={[styles.label, { color: colors.text, fontSize: fontSize }]}>Pronunciation Speed</Text>
          <SegmentedControl
            options={[{ label: 'Normal', value: 'normal' }, { label: 'Slow', value: 'slow' }]}
            selectedValue={pronunciationSpeed}
            onValueChange={(value) =>
              setPronunciationSpeed(value as 'normal' | 'slow')
            }
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 12,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontWeight: '500',
  },
});