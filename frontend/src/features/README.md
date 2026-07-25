# Feature-Based Architecture

We use **Feature-Based Architecture** to ensure the project scales cleanly. Each feature folder represents a domain module that is self-contained.

## Feature Folder Structure

Each module inside `src/features/` should be structured as follows:

```
src/features/course-management/
├── components/          # UI components used only inside this feature
├── hooks/               # Custom hooks specific to this feature
├── services/            # API services and mutations for this feature
├── types/               # Type definitions and Zod schemas
└── index.ts             # Public API/Exports for this feature
```

## Import Discipline

- Components outside a feature directory **must only** import from the feature's root `index.ts` file (e.g. `import { CourseCard } from "@/features/course-management"`).
- Features should not import directly from the internal sub-paths of other features.
