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

#### Metadata & App Info
-   **`GET /api/metadata`**: Get global metadata about all books and lessons.
-   **`GET /api/changelog`**: Get a list of changes and version history for the app.
-   **`GET /api/books/{bookId}/metadata`**: Get metadata for a specific book.
-   **`GET /api/books/{bookId}/lesson-titles`**: Get titles of all lessons in a specific book.
-   **`GET /api/books/{bookId}/rule-count`**: Get rule statistics for a specific book.

### Data Structures
_(Data structures for Book, Lesson, and Rule remain the same)_

## 5. Key Features and Implementation

### 5.1. Lesson and Content Display
_(Implementation details remain the same)_

### 5.2. Interactive Exercises
_(Implementation details remain the same)_

### 5.3. Navigation
_(Implementation details remain the same)_

### 5.4. Data Management & Synchronization
_(Implementation details remain the same)_

### 5.5. In-App Changelog
-   **Description:** A dedicated screen within the app to show users what's new in each version.
-   **Implementation:**
    -   Create a new screen, accessible from the "Settings" tab.
    -   The screen will fetch data from the `GET /api/changelog` endpoint.
    -   The changelog data will be displayed in a `ScrollView`, showing version numbers, dates, and a list of changes. This keeps the changelog up-to-date without requiring an app update.

## 6. Project Structure
_(Project structure remains the same)_

## 7. Development Workflow
_(Development workflow remains the same)_

## 8. Next Steps

1.  **Develop API client:** Create the functions in `/api/client.ts` to communicate with the backend API, using `https://madinah.arabic.aramb.dev/api` as the base URL.
2.  **Develop UI components:** Create the necessary UI components for displaying lessons and exercises.
3.  **Implement navigation:** Set up the navigation structure using Expo Router.
4.  **Integrate data fetching:** Use React Query and the API client to fetch, cache, and display the content from the API.
5.  **Implement Changelog:** Create the changelog screen and fetch data from the `/api/changelog` endpoint.

This document provides a starting point for the development of the Madinah Arabic app. It can be expanded and refined as the project progresses.