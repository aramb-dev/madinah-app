import { Stack } from "expo-router";
import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/components/useColorScheme';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import changelogData from "@/assets/changelog.json";

// Platform-specific colors for consistency
const getBackgroundColors = (isDark: boolean) => ({
  primary: isDark ? '#1c1c1e' : '#f2f2f7',
  secondary: isDark ? '#2c2c2e' : '#ffffff',
  border: isDark ? '#38383a' : '#c6c6c8',
  text: isDark ? '#ffffff' : '#000000',
  secondaryText: isDark ? '#8e8e93' : '#6d6d70',
  accent: '#007AFF',
  success: isDark ? '#34C759' : '#28A745',
  warning: isDark ? '#FF9F0A' : '#FFC107',
  danger: isDark ? '#FF3B30' : '#DC3545',
});

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

// Categorize changes based on keywords
const categorizeChange = (change: string) => {
  const lowerChange = change.toLowerCase();

  if (lowerChange.includes('add') || lowerChange.includes('new') || lowerChange.includes('implement')) {
    return { type: 'feature', icon: 'add-circle', color: 'success' };
  } else if (lowerChange.includes('fix') || lowerChange.includes('resolve') || lowerChange.includes('correct')) {
    return { type: 'bugfix', icon: 'checkmark-circle', color: 'success' };
  } else if (lowerChange.includes('improve') || lowerChange.includes('update') || lowerChange.includes('enhance')) {
    return { type: 'improvement', icon: 'trending-up', color: 'accent' };
  } else if (lowerChange.includes('remove') || lowerChange.includes('delete') || lowerChange.includes('revert')) {
    return { type: 'removal', icon: 'remove-circle', color: 'danger' };
  } else {
    return { type: 'change', icon: 'ellipse', color: 'warning' };
  }
};

export default function ChangelogScreen() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fontSize } = useSettings();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  // Use platform-appropriate colors
  const platformColors = getBackgroundColors(colorScheme === 'dark');

  useEffect(() => {
    const loadChangelog = () => {
      try {
        setLoading(true);
        // Sort changelog by version (newest first)
        const sortedChangelog = [...(changelogData as ChangelogEntry[])].sort((a, b) => {
          const versionA = parseFloat(a.version.replace(/\./g, ''));
          const versionB = parseFloat(b.version.replace(/\./g, ''));
          return versionB - versionA;
        });
        setChangelog(sortedChangelog);
      } catch (err) {
        setError("Failed to load changelog from local file");
        console.error("Error loading changelog:", err);
      } finally {
        setLoading(false);
      }
    };

    loadChangelog();
  }, []);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "What's New" }} />
        <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={platformColors.accent} />
            <Text style={[
              styles.loadingText,
              {
                color: platformColors.text,
                fontSize: fontSize * 1.0,
              }
            ]}>
              Loading changelog...
            </Text>
          </View>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: "What's New" }} />
        <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={platformColors.danger} />
            <Text style={[
              styles.errorText,
              {
                color: platformColors.text,
                fontSize: fontSize * 1.0,
              }
            ]}>
              {error}
            </Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "What's New" }} />
      <View style={[styles.container, { backgroundColor: platformColors.primary }]}>
        {/* iOS-style Section Header - positioned outside main content */}
        {changelog.length > 0 && (
          <View style={styles.sectionHeaderContainer}>
            <Text style={[
              styles.sectionHeader,
              {
                color: platformColors.secondaryText,
                fontSize: fontSize * 0.85,
              }
            ]}>
              VERSION HISTORY
            </Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {changelog.length > 0 ? (
            <>
              {/* Individual Version Cards */}
              {changelog.map((entry, index) => (
                <View key={index} style={styles.section}>
                  <View style={[
                    styles.sectionCard,
                    {
                      backgroundColor: platformColors.secondary,
                      borderColor: platformColors.border,
                    }
                  ]}>
                    <View style={[
                      styles.versionHeader,
                      {
                        borderBottomColor: platformColors.border,
                      }
                    ]}>
                      <View style={styles.versionTitleContainer}>
                        <Text style={[
                          styles.versionText,
                          {
                            color: platformColors.text,
                            fontSize: fontSize * 1.1,
                          }
                        ]}>
                          v{entry.version}
                        </Text>
                        {index === 0 && (
                          <View style={[styles.latestBadge, { backgroundColor: platformColors.accent }]}>
                            <Text style={[styles.latestBadgeText, { fontSize: fontSize * 0.7 }]}>
                              LATEST
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.dateText,
                        {
                          color: platformColors.secondaryText,
                          fontSize: fontSize * 0.85,
                        }
                      ]}>
                        {entry.date}
                      </Text>
                    </View>

                    <View style={styles.changesContainer}>
                      {entry.changes.map((change, changeIndex) => {
                        const category = categorizeChange(change);
                        const iconColor = platformColors[category.color as keyof typeof platformColors] || platformColors.text;

                        return (
                          <View key={changeIndex} style={styles.changeItem}>
                            <View style={styles.changeIconContainer}>
                              <Ionicons
                                name={category.icon as any}
                                size={16}
                                color={iconColor}
                              />
                            </View>
                            <Text style={[
                              styles.changeText,
                              {
                                color: platformColors.text,
                                fontSize: fontSize * 0.9,
                              }
                            ]}>
                              {change}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.section}>
              <View style={[
                styles.sectionCard,
                {
                  backgroundColor: platformColors.secondary,
                  borderColor: platformColors.border,
                }
              ]}>
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="document-text-outline" size={48} color={platformColors.secondaryText} />
                  <Text style={[
                    styles.noDataText,
                    {
                      color: platformColors.text,
                      fontSize: fontSize * 1.0,
                    }
                  ]}>
                    No changelog entries available.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </>
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
    paddingTop: 8,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  versionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontWeight: '600',
  },
  latestBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  latestBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 9,
    letterSpacing: 0.3,
  },
  dateText: {
    fontWeight: '400',
  },
  changesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  changeIconContainer: {
    marginRight: 10,
    marginTop: 1,
  },
  changeText: {
    flex: 1,
    lineHeight: 18,
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
