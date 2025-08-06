# Technical Plan: Fix Notification Scheduling Error

## 1. Introduction

This document outlines the technical plan to resolve a critical error in the Expo app that occurs when scheduling daily reminder notifications. The error, `[Error: Failed to schedule notification, Error Domain=NSInternalInconsistencyException Code=0 "(null)" UserInfo={NSAssertLine=536, NSAssertFile=UNNotificationTrigger.m}]`, indicates an invalid `UNNotificationTrigger` configuration on iOS.

The root cause has been identified as the incorrect use of a `timeInterval` trigger for scheduling daily repeating notifications. This plan details the necessary changes to fix this issue by using the appropriate `CalendarTrigger`.

## 2. Problem Analysis

The investigation of `components/NotificationsContext.tsx` revealed that the `scheduleDailyNotification` function uses `Notifications.scheduleNotificationAsync` with a `trigger` of type `timeInterval`. This trigger is designed for notifications that fire after a specific number of seconds and is not suitable for creating daily reminders that repeat at a specific time of day.

The current implementation calculates the seconds until the next desired time and sets a repeating `timeInterval` trigger. This approach is fragile and is the direct cause of the `NSInternalInconsistencyException` on iOS when the trigger configuration is not valid.

## 3. Proposed Solution

The solution is to replace the `timeInterval` trigger with a `CalendarTrigger`. The `CalendarTrigger` is the correct way to schedule notifications that repeat at a specific time and on a daily basis.

This change will involve the following:

1.  **Modify `scheduleDailyNotification`**: Update the `scheduleNotificationAsync` call in `components/NotificationsContext.tsx` to use a `CalendarTrigger`. The trigger will be configured with the `hour` and `minute` for the daily reminder, and `repeats: true` to ensure it fires every day.
2.  **Remove `getSecondsUntilTime`**: The `getSecondsUntilTime` helper function will no longer be needed, as the `CalendarTrigger` handles the scheduling logic internally. Removing this function will simplify the codebase.

## 4. Implementation Steps

### Step 1: Modify `components/NotificationsContext.tsx`

1.  **Remove the `getSecondsUntilTime` function.** This function is located at the beginning of the file and is no longer required.

2.  **Update the `scheduleDailyNotification` function.** Modify the `trigger` object within the `Notifications.scheduleNotificationAsync` call to use a `CalendarTrigger`.

#### Code Changes:

```typescript
// components/NotificationsContext.tsx

// ... (imports and other code)

// REMOVE THIS FUNCTION
/*
const getSecondsUntilTime = (hours: number, minutes: number): number => {
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return Math.floor((target.getTime() - now.getTime()) / 1000);
};
*/

// ... (storage helper functions)

// ... (context interface)

// ... (notification handler)

// ... (NotificationsProvider component)

// Schedule daily notification
const scheduleDailyNotification = async (time: string) => {
  try {
    // Cancel existing notification if any
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    const [hour, minute] = time.split(":").map(Number);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Learning Reminder 📚",
        body: "Time for your Arabic learning session! Keep up the great progress.",
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    setNotificationId(id);
    await saveToStorage(STORAGE_KEYS.NOTIFICATION_ID, id);
    console.log("Scheduled daily notification:", id);
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

// ... (rest of the component)
```

## 5. Conclusion

By implementing these changes, the notification scheduling will be robust and reliable, eliminating the `NSInternalInconsistencyException` error on iOS. The code will be cleaner and easier to maintain.
