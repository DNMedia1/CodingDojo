# Mobile Learning Platform Design

## Goal

DevPath is a German-language coding learning PWA for junior developers and career changers. The app should feel like a serious learning product, not a static course list: learners continue lessons, write small code snippets, answer quizzes, collect XP, complete daily quests, earn badges, and later sync progress across devices.

Code examples, TypeScript identifiers, filenames, API shapes, and editor content stay in English and must remain syntactically correct. Explanations, UI copy, hints, and learning guidance stay in German.

## Current Product Shape

The app is local-first and runs without a backend. It currently includes:

- Responsive React app shell with mobile bottom navigation and desktop sidebar.
- Dashboard with continue-learning, daily quests, XP, level, and course discovery.
- Seven course tracks: Python, C#, Java, HTML, CSS, JavaScript, and AI Automation.
- Python as the deepest track with 39 lessons across fundamentals, collections, files, modern Python, APIs, data, testing, and automation.
- Every lesson includes theory, a code example, fill-the-blank practice, quiz questions, a code-writing challenge, and a practical task.
- Local code feedback for syntax-like issues and expected concepts.
- Gamification through XP, level, streak, daily activity, daily bonus, and badges.
- Practice projects with requirements, hints, and solution notes.
- Profile, progress, settings, dark/light theme, PWA manifest, and service worker.

## Architecture

The app uses React, TypeScript, Vite, Tailwind CSS, React Router, and Vitest. React Router owns page routing, `AppShell` owns responsive navigation, and `ProgressContext` connects UI actions to the local progress services.

Course and project content live in TypeScript data files for now:

- `src/data/courses.ts`: course seeds and generated lesson tasks.
- `src/data/projects.ts`: practice project briefs.
- `src/models/learning.ts`: domain models shared across data, services, and UI.

Learning behavior is split into services:

- `src/services/progressService.ts`: XP, level, streak, daily quests, localStorage persistence.
- `src/services/codeFeedbackService.ts`: local code challenge feedback.
- `src/services/badgeService.ts`: badge definitions and earned/newly-earned badge checks.

The current persistence boundary is still localStorage. The next backend step should introduce a repository abstraction before adding Supabase so that UI pages do not depend directly on storage details.

## UI Direction

The UI should be responsive and product-like:

- Mobile: bottom navigation, large touch targets, compact lesson steps, clear course/start escape routes.
- Desktop/laptop: sidebar navigation, wider grids, lesson step sidebar, and better use of horizontal space.
- No marketing landing page as the default screen. The app opens directly into the learning experience.
- Text must not overflow buttons/cards at common mobile and desktop widths.
- Visual style should remain dark-first, high-contrast, focused, and learning-oriented.

## Backend Roadmap

Version 2 should prepare cross-device persistence with Supabase:

- Auth and profile storage.
- Lesson completion and quiz attempts.
- Daily activity, streaks, badges, and settings.
- Row-level security for user-owned progress.
- `.env.example` without secrets.
- A local repository implementation kept for offline/demo use.

Possible tables:

- `profiles`
- `lesson_progress`
- `quiz_attempts`
- `daily_activity`
- `user_settings`

Version 3 can add an AI tutor, deeper code analysis, a safe coding sandbox, personalized learning paths, certificates, and job-oriented tracks.

## Verification

Definition of Done for product changes:

- Relevant tests are added or updated.
- `npm test`, `npm run lint`, and `npm run build` pass.
- Visible UI changes are checked on mobile and desktop breakpoints when tooling allows it.
- Larger changes are committed separately with conventional commit messages.
- README or docs are updated when behavior, architecture, or setup changes.
