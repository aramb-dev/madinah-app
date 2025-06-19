# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Refactored "Coming Soon" and implemented screens for consistency.
- Simplified placeholder screens with a reusable `ComingSoon` component.
- Adjusted `ScrollView` insets to prevent content from overlapping with the tab bar.

### Fixed
- Corrected tab navigation to reflect renamed `exercises` screen.

### Added
- Implemented font selection feature, allowing users to choose their preferred Arabic font from settings.
- Implement font selection feature with Appearances screen in Settings tab.
- Add FontContext for managing user's preferred Arabic font selection.
- Load all available Arabic fonts (Amiri, Playpen Sans Arabic, Noto Sans Arabic, IBM Plex Sans Arabic, Noto Kufi Arabic, Baloo Bhaijaan 2, Noto Naskh Arabic).
- Update ThemedText component to use selected font for Arabic text rendering.

### Fixed
- Resolved bug where selected font was not applying in lesson view.
- Fixed SyntaxError in `app/lessons/[bookId].tsx`.

## [0.0.6] - Undated
### Added
- Display book name in book-level screen titles.
- Improve dynamic title logic and fetch book details.
- Add dynamic screen title and restructure lesson detail view.
- Add exercises tab and clarify screen titles.

### Changed
- Revert to using static changelog data from assets.
- Move changelog logic to use git log data.
- Remove unused lesson detail fetching logic and rendering.
- Improve localization handling and content display logic.

## [0.0.5] - Undated
### Added
- Improve introduction section styling and readability.
- Add rules and introduction to lesson detail screen.
- Update getBookById to return ApiResponse<Book>.

### Fixed
- Ensure rules are copied over in lesson adaptation.
- Handle api response structure and error cases.
- Initialize book title with loading message and simplify title logic.
- Handle unexpected response structure in getBookLessons.

### Changed
- Update rule interface and display in lesson view.
- Move useThemeColor calls to top level for better readability.

## [0.0.4] - Undated
### Added
- Update book and lesson types to support localized strings.

### Fixed
- Improve error handling and add debug logging for book lessons.
- Handle edge cases in book lessons fetching and display.
- Improve error handling and response parsing in apiRequest.
- Move React Hooks to top level to prevent rendering errors.
- Correct Amiri-Regular.ttf font path in _layout.tsx.

### Changed
- Improve theme handling and error states in book lessons screen.

## [0.0.3] - Undated
### Added
- Add arabic font families including Amiri, Kufi, IBM, Baloo, Noto and Playpen.
- Add muted, card and border color definitions.

### Fixed
- Resolve useThemeColor module not found error.
- Resolve TS errors in lesson detail screen.
- Correct theme color usage in book lessons screen.
- Resolve TypeScript errors and improve book lessons screen.

### Changed
- Update color variable names and values for consistency.

## [0.0.2] - Undated
### Added
- Improve lesson screens with dynamic theming and styling.
- Implement React Query caching with AsyncStorage.
- Implement ThemedText and add Amiri Arabic font.

### Fixed
- Correct ThemedText import path in BookLessonsScreen.

## [0.0.1] - Undated
### Added
- Implement detailed lesson view and navigation.
- Implement navigation to book lessons screen.
- Create basic Exercise component placeholder.
- Create LessonListItem component.
- Switch to local changelog data from assets.
- Implement tab navigation with lessons, vocabulary, and settings.
- Implement API client for all endpoints.

### Fixed
- Ensure books state is array and update agent prompt for git commits.
- Fix imports.
- Remove duplicate FontAwesome import that was causing SyntaxError during iOS bundling.