# Technical Plan: Settings UI Refactor

This document outlines the technical steps required to refactor the settings section of the application based on user feedback.

---

## 1. Navigation & Header Refactoring

The core of this refactor is to move from a shared header for all settings screens to individual headers for each screen. This will resolve the "framed" navigation and blurred header issues.

### 1.1. Eliminate the Shared Header

The current implementation in `app/(settings)/_layout.tsx` uses a single `<Stack>` to wrap all the settings screens, which creates the shared header. This will be changed to a layout that allows individual screen options.

**File to Modify:** `app/(settings)/_layout.tsx`

**Changes:**

- Remove the `SettingsLayout` component.
- Export a `Stack` component directly from `expo-router`.
- Configure the `Stack` with default `screenOptions` to set the `headerBackTitle` to "Settings". This ensures consistent back-button behavior.

```tsx
import { Stack } from "expo-router";

export default function SettingsStack() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Settings",
      }}
    />
  );
}
```

### 1.2. Configure Individual Screen Headers

Each settings screen will now be responsible for its own header configuration.

**Files to Modify:**

- `app/(settings)/appearance.tsx`
- `app/(settings)/notifications.tsx`
- `app/(settings)/learning.tsx`
- `app/(settings)/support.tsx`
- `app/(settings)/about.tsx`
- `app/(settings)/changelog.tsx`

**Changes:**

For each file, add a `Stack.Screen` component to define the `title`.

**Example for `appearance.tsx`:**

```tsx
import { Stack } from "expo-router";
// ... other imports

export default function AppearanceScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Appearance" }} />
      {/* ... rest of the component */}
    </>
  );
}
```

This will be repeated for all settings screens with their respective titles.

### 1.3. Fix the Main Settings Screen Header

The main "Settings" title will be moved from the page content to the navigation header.

**Files to Modify:**

- `app/(tabs)/settings.tsx`
- `app/(tabs)/_layout.tsx`

**Changes:**

1.  **In `app/(tabs)/settings.tsx`:**

    - Remove the `ListHeaderComponent` prop from the `SectionList`.

2.  **In `app/(tabs)/_layout.tsx`:**
    - Add `options` to the `Tabs.Screen` for the settings tab to set the `title`.

**Example for `app/(tabs)/_layout.tsx`:**

```tsx
// ...
<Tabs.Screen
  name="settings"
  options={{
    title: "Settings", // This will be the header title
    tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
  }}
/>
// ...
```

---

## 2. UI & Content Cleanup

With the navigation refactored, we can now remove redundant UI elements.

### 2.1. Remove Redundant In-Page Titles

The titles within the content of the sub-pages are now redundant because they are in the header.

**Files to Modify:**

- `app/(settings)/changelog.tsx`
- `app/(settings)/support.tsx`
- `app/(settings)/about.tsx`

**Changes:**

- In each file, remove the `<Text>` component that renders the main title of the page. For `about.tsx`, this is the `<Text style={styles.title}>{app.expo.name}</Text>` line.

### 2.2. Remove Redundant "Rate This App" Button

The "Rate This App" button on the support screen is redundant.

**File to Modify:** `app/(settings)/support.tsx`

**Changes:**

- Remove the `TouchableOpacity` component for the "Rate the App" button.

---

## 3. Component Refactoring

### 3.1. Pronunciation Speed Control

**File:** `app/(settings)/learning.tsx`

**Analysis:**

The user feedback indicated that the "Pronunciation Speed" control should be a `SegmentedControl`. Upon inspection, the component is already implemented as a `SegmentedControl`.

**Conclusion:**

No changes are required for this component.

---

This plan addresses all the user's feedback and will result in a cleaner, more intuitive settings section.
