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
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {changelog.length > 0 ? (
            <>
              {/* Latest Version Highlight */}
              {changelog.length > 0 && (
                <View style={styles.section}>
                  <View style={[
                    styles.latestVersionCard,
                    {
                      backgroundColor: platformColors.accent,
                      borderColor: platformColors.accent,
                    }
                  ]}>
                    <View style={styles.latestVersionHeader}>
                      <Ionicons name="star" size={24} color="white" />
                      <Text style={[
                        styles.latestVersionText,
                        {
                          color: 'white',
                          fontSize: fontSize * 1.1,
                        }
                      ]}>
                        Latest Version {changelog[0].version}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* All Versions */}
              <View style={styles.section}>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={[
                    styles.sectionHeader,
                    {
                      color: platformColors.secondaryText,
                      fontSize: fontSize * 0.9,
                    }
                  ]}>
                    VERSION HISTORY
                  </Text>
                </View>
                
                {changelog.map((entry, index) => (
                  <View key={index} style={styles.versionSection}>
                    <View style={[
                      styles.sectionCard,
                      {
                        backgroundColor: platformColors.secondary,
                        borderColor: platformColors.border,
                      }
                    ]}>
                      <View style={styles.versionHeader}>
                        <View style={styles.versionTitleContainer}>
                          <Text style={[
                            styles.versionText,
                            {
                              color: platformColors.text,
                              fontSize: fontSize * 1.2,
                            }
                          ]}>
                            v{entry.version}
                          </Text>
                          {index === 0 && (
                            <View style={[styles.latestBadge, { backgroundColor: platformColors.accent }]}>
                              <Text style={[styles.latestBadgeText, { fontSize: fontSize * 0.75 }]}>
                                LATEST
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={[
                          styles.dateText,
                          {
                            color: platformColors.secondaryText,
                            fontSize: fontSize * 0.9,
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
                                  fontSize: fontSize * 0.95,
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
              </View>
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
}const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  latestVersionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  latestVersionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  latestVersionText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  versionSection: {
    marginBottom: 16,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  latestBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  dateText: {
    fontWeight: '400',
  },
  changesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  changeIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  changeText: {
    flex: 1,
    lineHeight: 20,
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
