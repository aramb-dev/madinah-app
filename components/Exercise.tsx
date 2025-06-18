import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Assuming ThemedText is a common component

export interface ExerciseProps {
  // Define props for the Exercise component here
  // For example: type, question, options, correctAnswer, etc.
  id: string;
  title: string; // Placeholder
}

const Exercise: React.FC<ExerciseProps> = ({ id, title }) => {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Exercise: {title}</ThemedText>
      <Text>Exercise content will go here.</Text>
      {/* Placeholder for exercise content and interaction */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd', // Light gray border
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Off-white background
  },
});

export default Exercise;