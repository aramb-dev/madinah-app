import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed';

const ComingSoon = () => {
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <FontAwesome name="hourglass-half" size={48} color={textColor} />
      <Text style={[styles.text, { color: textColor }]}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 18,
  },
});

export default ComingSoon;