import { StyleSheet, Pressable, SectionList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import AppConfig from '../../app.json';

const sections = [
  {
    title: 'Content & Learning',
    data: [
      { title: 'Appearance', icon: 'paint-brush', href: '/appearance' },
      { title: 'Notifications', icon: 'bell', href: '/notifications' },
      { title: 'Learning Settings', icon: 'graduation-cap', href: '/learning' },
    ],
  },
  {
    title: 'Support & Info',
    data: [
      { title: 'Support & Feedback', icon: 'heart', href: '/support' },
      { title: 'Rate This App', icon: 'star', action: 'rate' },
      { title: 'About', icon: 'info-circle', href: '/about' },
      { title: 'Changelog', icon: 'history', href: '/changelog' },
    ],
  },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();

  const renderItem = ({ item }: { item: any }) => (
    <Link href={item.href || '#'} asChild>
      <Pressable style={styles.settingsButton}>
        <FontAwesome
          name={item.icon}
          size={20}
          color={Colors[colorScheme ?? 'light'].text}
          style={styles.settingsIcon}
        />
        <Text style={styles.settingsText}>{item.title}</Text>
        <FontAwesome
          name="chevron-right"
          size={16}
          color={Colors[colorScheme ?? 'light'].text}
        />
      </Pressable>
    </Link>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={<Text style={styles.title}>Settings</Text>}
        ListFooterComponent={
          <Text style={styles.footerText}>
            App Version {AppConfig.expo.version}
          </Text>
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 5,
  },
  settingsIcon: {
    marginRight: 15,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});