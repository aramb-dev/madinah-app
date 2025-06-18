import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View style={styles.settingsItem}>
        <Link href="/appearances" asChild>
          <Pressable style={styles.settingsButton}>
            <FontAwesome 
              name="paint-brush" 
              size={20} 
              color={Colors[colorScheme ?? 'light'].text}
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsText}>Appearances</Text>
            <FontAwesome 
              name="chevron-right" 
              size={16} 
              color={Colors[colorScheme ?? 'light'].text}
            />
          </Pressable>
        </Link>
      </View>
      
      <View style={styles.settingsItem}>
        <Link href="/changelog" asChild>
          <Pressable style={styles.settingsButton}>
            <FontAwesome 
              name="history" 
              size={20} 
              color={Colors[colorScheme ?? 'light'].text}
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsText}>Changelog</Text>
            <FontAwesome 
              name="chevron-right" 
              size={16} 
              color={Colors[colorScheme ?? 'light'].text}
            />
          </Pressable>
        </Link>
      </View>
      
      <View style={styles.settingsItem}>
        <Text style={styles.settingsText}>More settings coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
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
  settingsItem: {
    width: '90%',
    marginVertical: 10,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  settingsIcon: {
    marginRight: 15,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
  },
});