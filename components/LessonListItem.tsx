import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Assuming ThemedText is a common component

export interface LessonListItemProps {
  id: string;
  title: string;
  // Add other relevant lesson properties here, e.g., bookId, lessonNumber
  onPress?: () => void;
}

const LessonListItem: React.FC<LessonListItemProps> = ({ id, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.contentContainer}>
        <ThemedText type="subtitle">{title}</ThemedText>
        {/* You can add more details here, like lesson number or book name */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Light gray border
    backgroundColor: '#fff', // White background
  },
  contentContainer: {
    flexDirection: 'column',
  },
});

export default LessonListItem;