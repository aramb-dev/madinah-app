# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Refactored Changelog screen to fetch data from `git log` (currently using placeholder data).
- Removed `ChangelogEntry` interface from `api/client.ts` as it's now locally defined in `app/changelog.tsx`.

### Changed
- Updated `TODO.md` to include refactoring the changelog screen to use `git log`.

### Changed
- Updated book-level screens to display the book name in the header title.

### Fixed
- Resolved diagnostic errors in the book lessons screen (`app/lessons/[bookId].tsx`) related to StyleSheet declaration and JSX structure.

### Changed
- Ensured lesson detail screen title dynamically displays "Book {ID} - Lesson {ID}" or the lesson title.
- Improved logic for dynamic screen titles on lesson detail pages for clarity and robustness.
- Updated lesson detail screen to display book name instead of book ID in the title.

### Fixed
- Corrected React Hook order in LessonsScreen to prevent rendering errors.

### Fixed
- Corrected font path for `Amiri-Regular.ttf` in `app/_layout.tsx` to resolve bundling errors.
- Resolved TypeScript errors in `[lessonId].tsx` by correcting API usage, type definitions, and imports.
- Fixed 'Cannot find module @/components/useThemeColor' error by creating `hooks/useThemeColor.ts` and updating import path.
- Added 'muted', 'card', and 'border' color definitions to `constants/Colors.ts` to resolve `useThemeColor` errors.
- Resolved multiple TypeScript errors in the book lessons screen (`app/lessons/[bookId].tsx`).
- Corrected usage of `useThemeColor` with valid color names in `app/lessons/[bookId].tsx`.