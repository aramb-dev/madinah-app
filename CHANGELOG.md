# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Corrected font path for `Amiri-Regular.ttf` in `app/_layout.tsx` to resolve bundling errors.
- Resolved TypeScript errors in `[lessonId].tsx` by correcting API usage, type definitions, and imports.
- Fixed 'Cannot find module @/components/useThemeColor' error by creating `hooks/useThemeColor.ts` and updating import path.
- Added 'muted', 'card', and 'border' color definitions to `constants/Colors.ts` to resolve `useThemeColor` errors.
- Resolved multiple TypeScript errors in the book lessons screen (`app/lessons/[bookId].tsx`).
- Corrected usage of `useThemeColor` with valid color names in `app/lessons/[bookId].tsx`.