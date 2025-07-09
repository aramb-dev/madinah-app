import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useLearningContext } from '@/components/LearningContext';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useTheme } from '@/components/ThemeContext';
import { Stack } from 'expo-router';

export default function LearningScreen() {
  const {
    autoPlayAudio,
    pronunciationSpeed,
    showTransliteration,
    setAutoPlayAudio,
    setPronunciationSpeed,
    setShowTransliteration,
  } = useLearningContext();
  const { effectiveTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: effectiveTheme === 'dark' ? '#000' : '#fff',
    },
    settingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: effectiveTheme === 'dark' ? '#fff' : '#000',
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Learning Settings' }} />
      <View style={styles.container}>
        <View style={styles.settingContainer}>
          <Text style={styles.label}>Auto-play audio</Text>
          <Switch value={autoPlayAudio} onValueChange={setAutoPlayAudio} />
        </View>
        <View style={styles.settingContainer}>
          <Text style={styles.label}>Show Transliteration</Text>
          <Switch
            value={showTransliteration}
            onValueChange={setShowTransliteration}
          />
        </View>
        <View style={styles.settingContainer}>
          <Text style={styles.label}>Pronunciation Speed</Text>
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