import React from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFont, AVAILABLE_FONTS, FontOption } from '@/components/FontContext';
import { ThemedText } from '@/components/ThemedText';

export default function AppearancesScreen() {
  const colorScheme = useColorScheme();
  const { selectedFont, setSelectedFont, isLoading } = useFont();

  const handleFontSelect = (font: FontOption) => {
    setSelectedFont(font);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Appearances</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Appearances</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arabic Font</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred Arabic font for reading lessons and vocabulary.
          </Text>
          
          <View style={styles.fontList}>
            {AVAILABLE_FONTS.map((font) => (
              <Pressable
                key={font.id}
                style={[
                  styles.fontOption,
                  {
                    backgroundColor: colorScheme === 'dark' 
                      ? 'rgba(255,255,255,0.1)' 
                      : 'rgba(0,0,0,0.05)',
                    borderColor: selectedFont.id === font.id 
                      ? Colors[colorScheme ?? 'light'].tint 
                      : 'transparent',
                    borderWidth: selectedFont.id === font.id ? 2 : 1,
                  }
                ]}
                onPress={() => handleFontSelect(font)}
              >
                <View style={styles.fontOptionContent}>
                  <View style={styles.fontInfo}>
                    <Text style={styles.fontName}>{font.name}</Text>
                    <ThemedText 
                      style={[styles.fontPreview, { fontFamily: font.fontFamily }]}
                    >
                      العربية - مدينة العربية
                    </ThemedText>
                  </View>
                  
                  <View style={styles.radioContainer}>
                    {selectedFont.id === font.id ? (
                      <FontAwesome 
                        name="dot-circle-o" 
                        size={20} 
                        color={Colors[colorScheme ?? 'light'].tint}
                      />
                    ) : (
                      <FontAwesome 
                        name="circle-o" 
                        size={20} 
                        color={Colors[colorScheme ?? 'light'].text}
                      />
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Options</Text>
          <Text style={styles.sectionDescription}>
            Additional appearance settings will be available here in future updates.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 20,
  },
  section: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  fontList: {
    width: '100%',
  },
  fontOption: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  fontOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontInfo: {
    flex: 1,
  },
  fontName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fontPreview: {
    fontSize: 18,
    lineHeight: 28,
    opacity: 0.8,
  },
  radioContainer: {
    marginLeft: 12,
  },
});