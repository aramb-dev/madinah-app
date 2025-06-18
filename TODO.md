# Madinah Arabic App - Development Tasks

This task list is managed by the ExpoDev agent and is based on the `TECHNICAL_IMPLEMENTATION.md` document.

## Phase 1: Project Setup & API Integration

- [x] **Task 1: Develop API Client**
  - Create the API client setup in `/api/client.ts`.
  - Configure the client with the base URL: `https://madinah.arabic.aramb.dev/api`.
  - Implement functions for fetching data from all endpoints specified in the documentation (e.g., `getBooks`, `getLessonById`, `getChangelog`).

## Phase 2: Core UI and Navigation

- [x] **Task 2: Implement Navigation**
  - Set up Expo Router with a tab navigator for the main sections (Lessons, Vocabulary, Settings).
  - Create a stack navigator for drilling down from a lesson list to a specific lesson view.

- [x] **Task 3: Develop UI Components**
  - Create reusable UI components as outlined in the project structure.
  - [x] Start with `LessonListItem.tsx` for displaying lessons in a list.
  - [x] Create basic placeholders for other components like `Exercise.tsx`.

## Phase 3: Data Display and Feature Implementation

- [x] **Task 4: Integrate Data Fetching**
  - [x] Use React Query and the API client to fetch the list of books for the main screen.
  - [x] Fix bug where `books.map` is called on `undefined`.
  - [x] Display the fetched books on the main screen.
  - [x] Fetch and display lessons for a selected book.
  - [x] Implement the detailed lesson view to display content for a selected lesson.

- [x] Implement Changelog: Create the changelog screen and load data from the local `assets/changelog.json` file.

## Phase 4: Finalize and Refine

- [ ] **Task 6: Finalize and Refine**
  - [x] Implement custom Arabic font (Amiri) and `ThemedText` component
  - [x] Ensure custom Arabic fonts are loaded and applied correctly.
  - [x] Implement caching and offline access strategies.
- [x] Refine styling using `StyleSheet` API, ensuring consistency and responsiveness.
  - [ ] Review and test all features.

## Phase 5: Additional Features

- [x] **Task 7: Implement Font Selection Feature**
  - [x] Create FontContext for managing selected font state
  - [x] Load all available Arabic fonts in the app
  - [x] Create Appearances screen with font selection interface
  - [x] Add Appearances section to Settings tab
  - [x] Update `ThemedText` component to use the selected font for Arabic text. (Fixed SyntaxError in `[bookId].tsx`)