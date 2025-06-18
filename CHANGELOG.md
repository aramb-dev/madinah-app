# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Resolved TypeScript errors in `[lessonId].tsx` by correcting API usage, type definitions, and imports.
- Fixed 'Cannot find module @/components/useThemeColor' error by creating `hooks/useThemeColor.ts` and updating import path.
- Resolved multiple TypeScript errors in the book lessons screen (`app/lessons/[bookId].tsx`).
- Corrected usage of `useThemeColor` with valid color names in `app/lessons/[bookId].tsx`.