# Technical Implementation Plan: Madinah Arabic App

## 1. Introduction

This document outlines the technical implementation plan for creating a mobile application that serves as a clone of the Madinah Arabic learning website. The application will be built using Expo and React Native, providing a cross-platform solution for both iOS and Android.

The goal is to create a user-friendly and performant mobile application that allows users to study the Madinah Arabic course materials, similar to the functionality of the existing web application.

## 2. High-Level Architecture

The application will be a client-side application that communicates with a backend API to fetch and display educational content. This ensures that the content in the mobile app stays synchronized with the website. The app will also include caching and local data storage to provide offline access to previously viewed content.

-   **Client:** Expo/React Native application.
-   **API:** The existing API built within the `aramb-dev/madinah` Next.js project.
-   **Data Flow:** The mobile app will make HTTP requests to the API to fetch lesson data, vocabulary, and other resources.

## 3. Core Technologies

-   **Framework:** Expo
-   **UI Library:** React Native
-   **Navigation:** React Navigation
-   **Styling:** StyleSheet API (from 'react-native')
-   **State Management:** React Context or Zustand (for managing global state like user progress and authentication)
-   **Data Fetching:** React Query or SWR (for fetching, caching, and managing server state)
-   **Data Persistence:** AsyncStorage or a more robust solution like MMKV (for storing cached data and user settings)

## 4. API Specification

-   **Base URL:** `https://madinah.arabic.aramb.dev/api`
-   **Data Format:** JSON
-   **Authentication:** No authentication is required.

### Endpoints

#### Books
-   **`GET /api/books`**: Get all available books with their lessons.
-   **`GET /api/books/{bookId}`**: Get a specific book by ID (`book1`, `book2`, `book3`).
-   **`GET /api/books/{bookId}/lessons`**: Get all lessons for a specific book.
-   **`GET /api/books/{bookId}/lessons/{lessonId}`**: Get a specific lesson from a book.

#### Lessons
-   **`GET /api/lessons`**: Get all lessons from all books.
-   **`GET /api/lesson-titles`**: Get titles of all lessons across all books.

#### Metadata
-   **`GET /api/metadata`**: Get global metadata about all books and lessons.
-   **`GET /api/books/{bookId}/metadata`**: Get metadata for a specific book.
-   **`GET /api/books/{bookId}/lesson-titles`**: Get titles of all lessons in a specific book.
-   **`GET /api/books/{bookId}/rule-count`**: Get rule statistics for a specific book.

### Data Structures

#### Book
```json
{
  "id": "string",
  "title": {
    "ar": "string",
    "en": "string"
  },
  "description": {
    "arabic": "string",
    "english": "string"
  },
  "lessons": "Array<Lesson>",
  "available": "boolean",
  "comingSoon": "boolean (optional)"
}
```

#### Lesson
```json
{
  "id": "string",
  "title": {
    "ar": "string",
    "en": "string"
  },
  "introduction": {
    "arabic": "string",
    "english": "string"
  },
  "rules": "Array<Rule>"
}
```

#### Rule
```json
{
  "name": "string",
  "arabicText": "string",
  "explanation": "string"
}
```

## 5. Key Features and Implementation

### 5.1. Lesson and Content Display

-   **Description:** The app will display lessons with Arabic text and translations fetched from the API.
-   **Implementation:**
    -   Use `expo-font` to load custom Arabic fonts for proper rendering.
    -   Use React Query to fetch lesson content from the API. The data will be cached to allow for offline viewing.
    -   A `FlashList` from Shopify or a `FlatList` will be used for efficient rendering of long lists of content.

### 5.2. Interactive Exercises

-   **Description:** The app will feature interactive exercises to test the user's knowledge.
-   **Implementation:**
    -   Create custom components for multiple-choice questions, fill-in-the-blanks, and other exercise types.
    -   User's answers and results will be managed by React state and can be submitted to the API to track progress.

### 5.3. Navigation

-   **Description:** The app will have a clear and intuitive navigation structure.
-   **Implementation:**
    -   Use Expo Router for file-based routing.
    -   A Tab Navigator for the main sections (e.g., Lessons, Vocabulary, Settings).
    -   A Stack Navigator for navigating from the lesson list to individual lesson screens.

### 5.4. Data Management & Synchronization

-   **Description:** The app's content will be sourced from the API in the `aramb-dev/madinah` repository to ensure synchronization with the website.
-   **Implementation:**
    -   Define API client functions to interact with the Next.js API endpoints.
    -   Use a data fetching library like React Query to handle API requests, caching, and background synchronization.
    -   Implement a caching strategy to store fetched data locally, allowing for offline access. For example, when a user views a lesson, the content is saved to local storage for future offline use.

## 6. Project Structure

A suggested project structure using Expo Router:

```
/app
  - (tabs)
    - _layout.tsx       # Tab navigator layout
    - index.tsx         # Lessons list screen
    - vocabulary.tsx    # Vocabulary screen
    - settings.tsx      # Settings screen
  - lesson
    - [lessonId].tsx    # Dynamic route for individual lessons
  - _layout.tsx         # Root layout
  - modal.tsx           # Example modal screen
/api
  - client.ts           # API client setup (e.g., Axios instance with base URL)
  - lessons.ts          # Functions for fetching lesson data
/assets
  - fonts/
    - ArabicFont.ttf    # Custom Arabic font
  - images/
/components
  - StyledText.tsx
  - Exercise.tsx
  - LessonListItem.tsx
/constants
  - Colors.ts
  - Styles.ts
/hooks
  - useCachedResources.ts
  - useLessons.ts       # Hook for fetching lesson data with React Query
```

## 7. Development Workflow

-   **Linting:** Use ESLint with plugins for React Native and TypeScript to maintain code quality.
-   **Formatting:** Use Prettier for consistent code formatting.
-   **Version Control:** Use Git and host the repository on GitHub.
-   **API Development:** The API will be developed and maintained as part of the `aramb-dev/madinah` Next.js project.

## 8. Next Steps

1.  **Develop API client:** Create the functions in `/api/client.ts` to communicate with the backend API, using `https://madinah.arabic.aramb.dev/api` as the base URL.
2.  **Develop UI components:** Create the necessary UI components for displaying lessons and exercises.
3.  **Implement navigation:** Set up the navigation structure using Expo Router.
4.  **Integrate data fetching:** Use React Query and the API client to fetch, cache, and display the content from the API.

This document provides a starting point for the development of the Madinah Arabic app. It can be expanded and refined as the project progresses.