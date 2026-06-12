# Active Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** DevPath von einer lokalen Kurs-/Quiz-PWA zu einer aktiven Lernplattform erweitern, die Aufgaben, Skill-Schwächen, Fehlerbuch, Wiederholungen, Tagesempfehlungen und Modul-Boss-Fights lokal steuert.

**Architecture:** Bestehende Lesson-/Quiz-Daten bleiben kompatibel. Neue Exercise-Typen werden additiv eingeführt und die aktuellen `quiz`, `fillBlank` und `codingChallenge` Daten werden zuerst per Adapter in das neue Modell gespiegelt. Lernanalyse und Spaced Repetition liegen in separaten Services mit eigenem localStorage-Repository, damit `progressService` schlank bleibt.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind, React Router, localStorage, Vitest.

---

## Analyse

- `src/models/learning.ts` enthält aktuell `QuizQuestion`, `FillBlankTask`, `CodingChallenge`, `Lesson`, `CourseModule`, `Course`, `UserProgress` und `QuizAnswer`. Es gibt noch kein generisches Exercise-Modell, keine Skill-Tags, kein Antwortfeedback pro Option und keine Review-Metadaten.
- `src/data/courses.ts` generiert Kurse deterministisch aus Seeds. Jede Lektion hat Theorie, `knowledge`, Codebeispiel, Fill-Blank, vier Quizfragen, Praxisaufgabe und Coding-Challenge. Das ist ein guter Adapter-Einstieg: bestehende Inhalte bleiben erhalten und werden in `Exercise[]` übersetzt.
- `src/services/progressService.ts` verwaltet XP, Level, Streak, Daily Quests, abgeschlossene Lektionen und `quizMistakes` als einfache Question-ID-Liste. Fehlerbuch und Review-Zustand sollten nicht hier hineinwachsen.
- `src/services/codeFeedbackService.ts` prüft lokale Code-Challenges mit Syntax- und Pattern-Checks. Dieser Service kann später für `debugging` und `code_completion` genutzt werden, sollte aber nicht die allgemeine Exercise-Bewertung übernehmen.
- `src/services/badgeService.ts` leitet Badges aus `UserProgress` ab. Neue Badges für Review-Streaks oder Boss-Fights können später aus `LearningActivityState` abgeleitet werden.
- `src/store/ProgressContext.tsx` kapselt Fortschritt und Actions. Für Review/Fehlerbuch wird ein zusätzlicher `LearningActivityContext` empfohlen, damit bestehende Progress-Consumers nicht brechen.
- `src/pages/LessonPage.tsx` ist aktuell sehr groß und rendert Theorie, Fill-Blank, Quiz, Coding, KI-Hilfe und Abschlusslogik direkt. Neue Exercise-Typen sollten über kleine Renderer-Komponenten laufen.
- `src/pages/QuizPage.tsx` nutzt alle Lesson-Quizfragen direkt. Künftig sollte es aus `Exercise[]` filtern und falsche Antworten an den Review-Service melden.
- `src/pages/DashboardPage.tsx` empfiehlt nur die nächste offene Lektion und Daily Quests. Das neue Heute-lernen-Dashboard kann additiv als neue Startkarte oberhalb oder neben der bestehenden Weiterlernen-Karte eingefügt werden.
- `src/pages/CourseDetailPage.tsx` und `src/pages/ModulePage.tsx` kennen nur Lektionen. Boss-Fights passen als `module.bossFight` oder als generierte Abschluss-Challenge nach den Lektionen.
- `src/components/AppShell.tsx` hat fünf mobile Nav-Slots. Für "Meine Fehler" besser zunächst als Link auf Dashboard/Profile einführen; eine sechste Bottom-Nav würde mobil enger werden.

## Architekturvorschlag

### Datenmodell

Neue Typen in `src/models/learning.ts`:

```ts
export type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'code_output'
  | 'debugging'
  | 'ordering'
  | 'code_completion'
  | 'short_answer'
  | 'scenario'
  | 'mini_project_step';

export type SkillTag =
  | 'variables'
  | 'functions'
  | 'arrays'
  | 'objects'
  | 'async'
  | 'http'
  | 'react-state'
  | 'react-effects'
  | 'sql-joins'
  | 'git-branches'
  | 'debugging'
  | 'clean-code'
  | 'api-design'
  | 'automation-webhooks';

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  skillTags: SkillTag[];
  difficulty: Difficulty;
  options?: ExerciseOption[];
  expectedAnswer?: string;
  acceptedAnswers?: string[];
  code?: string;
  solution?: string;
  explanation: string;
}

export interface ReviewCard {
  exerciseId: string;
  nextReviewAt: string;
  intervalDays: number;
  easeFactor: number;
  wrongCount: number;
  correctStreak: number;
  lastAnsweredAt: string;
}

export interface MistakeEntry {
  exerciseId: string;
  lessonId: string;
  courseId: LanguageId;
  skillTags: SkillTag[];
  selectedAnswer: string;
  correctAnswer: string;
  feedback: string;
  answeredAt: string;
  count: number;
}
```

### Service-Grenzen

- `exerciseAdapterService.ts`: Übersetzt bestehende `Lesson`-Daten in `Exercise[]`.
- `exerciseEvaluationService.ts`: Bewertet alle Exercise-Typen einheitlich und liefert Feedback.
- `learningActivityService.ts`: Berechnet Fehlerbuch-Daten, Skill-Schwächen, Empfehlungen und aggregierte Statistiken.
- `reviewService.ts`: Spaced-Repetition-Regeln mit `nextReviewAt`, `intervalDays`, `easeFactor`, `wrongCount`, `correctStreak`.
- `learningActivityRepository.ts`: localStorage für ReviewCards und MistakeEntries.
- `LearningActivityContext.tsx`: React-Context für `recordExerciseResult`, `dueReviews`, `mistakes`, `weakSkillTags`.

### UI-Erweiterungen

- `ExerciseRenderer.tsx`: Router-Komponente für Exercise-Typen.
- `exercise-renderers/MultipleChoiceExercise.tsx`, `TrueFalseExercise.tsx`, `FillBlankExercise.tsx`, `OrderingExercise.tsx`, `ShortAnswerExercise.tsx`, `CodeExercise.tsx`.
- `MistakesPage.tsx`: "Meine Fehler" mit falschen Antworten, Skill-Schwächen und Wiederholungs-CTA.
- `TodayLearningCard.tsx`: Startkarte mit fälligen Wiederholungen, nächster Lektion, Mini-Code-Challenge, Tagesziel.
- `BossFightPage.tsx` oder `ModuleBossFightCard.tsx`: Abschluss-Challenge pro Modul.

## Umsetzungsschritte

### Task 1: Exercise-Modell additiv einführen

**Files:**
- Modify: `src/models/learning.ts`
- Modify: `src/data/courses.test.ts`

- [ ] **Step 1: Failing Test schreiben**

```ts
it('exposes generated exercises for every lesson with skill tags and feedback', () => {
  for (const course of courses) {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(lesson.quiz.length + 2);
        for (const exercise of lesson.exercises) {
          expect(exercise.skillTags.length).toBeGreaterThan(0);
          expect(exercise.explanation.length).toBeGreaterThan(20);
          for (const option of exercise.options ?? []) {
            expect(option.feedback.length).toBeGreaterThan(20);
          }
        }
      }
    }
  }
});
```

- [ ] **Step 2: Test rot laufen lassen**

Run: `npm test -- src/data/courses.test.ts`
Expected: FAIL wegen fehlendem `lesson.exercises`.

- [ ] **Step 3: Typen ergänzen**

Add in `src/models/learning.ts`:

```ts
export type ExerciseType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'code_output' | 'debugging' | 'ordering' | 'code_completion' | 'short_answer' | 'scenario' | 'mini_project_step';
export type SkillTag = 'variables' | 'functions' | 'arrays' | 'objects' | 'async' | 'http' | 'react-state' | 'react-effects' | 'sql-joins' | 'git-branches' | 'debugging' | 'clean-code' | 'api-design' | 'automation-webhooks';

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  skillTags: SkillTag[];
  difficulty: Difficulty;
  options?: ExerciseOption[];
  expectedAnswer?: string;
  acceptedAnswers?: string[];
  code?: string;
  solution?: string;
  explanation: string;
}
```

Then add to `Lesson`:

```ts
exercises: Exercise[];
```

- [ ] **Step 4: Adapter minimal in `courses.ts` einhängen**

Implement helpers:

```ts
function inferSkillTags(courseSeed: CourseSeed, lessonSeed: LessonSeed): SkillTag[] {
  const text = `${courseSeed.id} ${lessonSeed.title} ${lessonSeed.theory} ${lessonSeed.code}`.toLowerCase();
  const tags: SkillTag[] = [];
  if (text.includes('function') || text.includes('def ') || text.includes('method')) tags.push('functions');
  if (text.includes('list') || text.includes('array')) tags.push('arrays');
  if (text.includes('object') || text.includes('dictionary') || text.includes('interface')) tags.push('objects');
  if (text.includes('async') || text.includes('await') || text.includes('promise')) tags.push('async');
  if (text.includes('fetch') || text.includes('api') || text.includes('http')) tags.push('http');
  if (courseSeed.id === 'react' && text.includes('state')) tags.push('react-state');
  if (courseSeed.id === 'react' && text.includes('effect')) tags.push('react-effects');
  if (courseSeed.id === 'sql' && text.includes('join')) tags.push('sql-joins');
  if (courseSeed.id === 'git' && text.includes('branch')) tags.push('git-branches');
  if (text.includes('debug') || text.includes('fehler')) tags.push('debugging');
  if (text.includes('clean') || text.includes('struktur') || text.includes('review')) tags.push('clean-code');
  if (courseSeed.id === 'backend') tags.push('api-design');
  if (courseSeed.id === 'automation' && text.includes('webhook')) tags.push('automation-webhooks');
  return tags.length > 0 ? tags : ['clean-code'];
}
```

- [ ] **Step 5: Test grün laufen lassen**

Run: `npm test -- src/data/courses.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/models/learning.ts src/data/courses.ts src/data/courses.test.ts
git commit -m "feat: add exercise model to lessons"
```

### Task 2: Exercise-Bewertung und Antwortfeedback

**Files:**
- Create: `src/services/exerciseEvaluationService.ts`
- Create: `src/services/exerciseEvaluationService.test.ts`

- [ ] **Step 1: Failing Tests schreiben**

```ts
it('returns option feedback for a wrong multiple choice answer', () => {
  const exercise: Exercise = {
    id: 'x1',
    type: 'multiple_choice',
    prompt: 'Was ist korrekt?',
    skillTags: ['functions'],
    difficulty: 'basic',
    explanation: 'Funktionen geben Werte zurück.',
    options: [
      { id: 'a', text: 'return', isCorrect: true, feedback: 'Richtig: return gibt ein Ergebnis zurück.' },
      { id: 'b', text: 'print only', isCorrect: false, feedback: 'Nicht ganz: print zeigt nur etwas an.' }
    ]
  };

  expect(evaluateExerciseAnswer(exercise, 'b')).toMatchObject({
    correct: false,
    feedback: 'Nicht ganz: print zeigt nur etwas an.',
    correctAnswer: 'return'
  });
});
```

- [ ] **Step 2: Test rot laufen lassen**

Run: `npm test -- src/services/exerciseEvaluationService.test.ts`
Expected: FAIL wegen fehlendem Service.

- [ ] **Step 3: Service implementieren**

```ts
export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  feedback: string;
  skillTags: SkillTag[];
}

export function evaluateExerciseAnswer(exercise: Exercise, answer: string): ExerciseResult {
  if (exercise.options?.length) {
    const selected = exercise.options.find((option) => option.id === answer || option.text === answer);
    const correct = exercise.options.find((option) => option.isCorrect);
    return {
      exerciseId: exercise.id,
      correct: Boolean(selected?.isCorrect),
      selectedAnswer: selected?.text ?? answer,
      correctAnswer: correct?.text ?? exercise.expectedAnswer ?? '',
      feedback: selected?.feedback ?? exercise.explanation,
      skillTags: exercise.skillTags
    };
  }

  const normalized = answer.trim().toLowerCase();
  const accepted = [exercise.expectedAnswer ?? '', ...(exercise.acceptedAnswers ?? [])].map((item) => item.trim().toLowerCase());
  const correct = accepted.includes(normalized);
  return {
    exerciseId: exercise.id,
    correct,
    selectedAnswer: answer,
    correctAnswer: exercise.expectedAnswer ?? '',
    feedback: correct ? exercise.explanation : `Noch nicht. Erwartet war: ${exercise.expectedAnswer ?? 'eine passende Antwort'}.`,
    skillTags: exercise.skillTags
  };
}
```

- [ ] **Step 4: Tests grün laufen lassen**

Run: `npm test -- src/services/exerciseEvaluationService.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/exerciseEvaluationService.ts src/services/exerciseEvaluationService.test.ts
git commit -m "feat: evaluate exercise answers"
```

### Task 3: Review-Service mit Spaced Repetition

**Files:**
- Create: `src/services/reviewService.ts`
- Create: `src/services/reviewService.test.ts`
- Modify: `src/models/learning.ts`

- [ ] **Step 1: Tests für Zeitregeln schreiben**

```ts
it.each([
  ['wrong', 10 * 60 * 1000, 0, 1],
  ['hard', 1 * 86_400_000, 1, 0],
  ['correct', 3 * 86_400_000, 3, 0],
  ['easy', 7 * 86_400_000, 7, 0]
] as const)('schedules %s answers correctly', (rating, offsetMs, intervalDays, wrongIncrement) => {
  const now = '2026-06-12T10:00:00.000Z';
  const card = updateReviewCard(createReviewCard('exercise-1', now), rating, now);
  expect(new Date(card.nextReviewAt).getTime()).toBe(new Date(now).getTime() + offsetMs);
  expect(card.intervalDays).toBe(intervalDays);
  expect(card.wrongCount).toBe(wrongIncrement);
});
```

- [ ] **Step 2: Test rot laufen lassen**

Run: `npm test -- src/services/reviewService.test.ts`
Expected: FAIL wegen fehlendem Service.

- [ ] **Step 3: Types und Service implementieren**

```ts
export type ReviewRating = 'wrong' | 'hard' | 'correct' | 'easy';

export interface ReviewCard {
  exerciseId: string;
  nextReviewAt: string;
  intervalDays: number;
  easeFactor: number;
  wrongCount: number;
  correctStreak: number;
  lastAnsweredAt: string;
}
```

```ts
export function createReviewCard(exerciseId: string, now = new Date().toISOString()): ReviewCard {
  return { exerciseId, nextReviewAt: now, intervalDays: 0, easeFactor: 2.5, wrongCount: 0, correctStreak: 0, lastAnsweredAt: now };
}

export function updateReviewCard(card: ReviewCard, rating: ReviewRating, now = new Date().toISOString()): ReviewCard {
  const base = new Date(now).getTime();
  const schedule = {
    wrong: { intervalDays: 0, offsetMs: 10 * 60 * 1000, easeDelta: -0.2 },
    hard: { intervalDays: 1, offsetMs: 86_400_000, easeDelta: -0.05 },
    correct: { intervalDays: 3, offsetMs: 3 * 86_400_000, easeDelta: 0 },
    easy: { intervalDays: 7, offsetMs: 7 * 86_400_000, easeDelta: 0.15 }
  }[rating];

  return {
    ...card,
    nextReviewAt: new Date(base + schedule.offsetMs).toISOString(),
    intervalDays: schedule.intervalDays,
    easeFactor: Math.max(1.3, Number((card.easeFactor + schedule.easeDelta).toFixed(2))),
    wrongCount: rating === 'wrong' ? card.wrongCount + 1 : card.wrongCount,
    correctStreak: rating === 'wrong' ? 0 : card.correctStreak + 1,
    lastAnsweredAt: now
  };
}
```

- [ ] **Step 4: Tests grün laufen lassen**

Run: `npm test -- src/services/reviewService.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/models/learning.ts src/services/reviewService.ts src/services/reviewService.test.ts
git commit -m "feat: add local review scheduler"
```

### Task 4: Fehlerbuch-Daten lokal speichern

**Files:**
- Create: `src/services/learningActivityRepository.ts`
- Create: `src/services/learningActivityService.ts`
- Create: `src/services/learningActivityService.test.ts`
- Modify: `src/models/learning.ts`

- [ ] **Step 1: Tests für Fehleraggregation schreiben**

```ts
it('aggregates weak skill tags from mistakes', () => {
  const mistakes: MistakeEntry[] = [
    mistake('a', ['functions']),
    mistake('b', ['functions', 'debugging']),
    mistake('c', ['debugging'])
  ];
  expect(getWeakSkillTags(mistakes)).toEqual([
    { skillTag: 'debugging', count: 2 },
    { skillTag: 'functions', count: 2 }
  ]);
});
```

- [ ] **Step 2: Test rot laufen lassen**

Run: `npm test -- src/services/learningActivityService.test.ts`
Expected: FAIL wegen fehlendem Service.

- [ ] **Step 3: `MistakeEntry` und Aggregation implementieren**

```ts
export interface MistakeEntry {
  exerciseId: string;
  lessonId: string;
  courseId: LanguageId;
  skillTags: SkillTag[];
  selectedAnswer: string;
  correctAnswer: string;
  feedback: string;
  answeredAt: string;
  count: number;
}
```

```ts
export function getWeakSkillTags(mistakes: MistakeEntry[]) {
  const counts = new Map<SkillTag, number>();
  for (const mistake of mistakes) {
    for (const tag of mistake.skillTags) counts.set(tag, (counts.get(tag) ?? 0) + mistake.count);
  }
  return [...counts.entries()]
    .map(([skillTag, count]) => ({ skillTag, count }))
    .sort((a, b) => b.count - a.count || a.skillTag.localeCompare(b.skillTag));
}
```

- [ ] **Step 4: Repository implementieren**

Use key: `devpath-learning-activity-v1`.

```ts
export interface LearningActivityState {
  mistakes: MistakeEntry[];
  reviewCards: ReviewCard[];
}

export const defaultLearningActivityState: LearningActivityState = {
  mistakes: [],
  reviewCards: []
};
```

- [ ] **Step 5: Tests grün laufen lassen**

Run: `npm test -- src/services/learningActivityService.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/models/learning.ts src/services/learningActivityRepository.ts src/services/learningActivityService.ts src/services/learningActivityService.test.ts
git commit -m "feat: track mistakes by skill"
```

### Task 5: LearningActivityContext an Quiz anschließen

**Files:**
- Create: `src/store/LearningActivityContext.tsx`
- Modify: `src/App.tsx` or `src/main.tsx`
- Modify: `src/pages/QuizPage.tsx`
- Test: `src/services/learningActivityService.test.ts`

- [ ] **Step 1: Context mit Actions implementieren**

Expose:

```ts
type LearningActivityContextValue = {
  activity: LearningActivityState;
  dueReviews: ReviewCard[];
  weakSkillTags: Array<{ skillTag: SkillTag; count: number }>;
  recordExerciseResult: (input: {
    result: ExerciseResult;
    exercise: Exercise;
    lessonId: string;
    courseId: LanguageId;
    rating: ReviewRating;
  }) => void;
  resetLearningActivity: () => void;
};
```

- [ ] **Step 2: Provider um App legen**

In `src/main.tsx`, nest inside existing providers:

```tsx
<ProgressProvider>
  <LearningActivityProvider>
    <App />
  </LearningActivityProvider>
</ProgressProvider>
```

- [ ] **Step 3: QuizPage Ergebnis melden**

Change QuizPage to evaluate `Exercise` records instead of raw `QuizQuestion` records once Task 6 adds the adapter. Until then, map current quiz IDs to generated exercises by ID and call `recordExerciseResult` for wrong and correct answers.

- [ ] **Step 4: Tests laufen lassen**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/store/LearningActivityContext.tsx src/main.tsx src/pages/QuizPage.tsx
git commit -m "feat: record quiz learning activity"
```

### Task 6: ExerciseRenderer in LessonPage einziehen

**Files:**
- Create: `src/components/exercises/ExerciseRenderer.tsx`
- Create: `src/components/exercises/MultipleChoiceExercise.tsx`
- Create: `src/components/exercises/FillBlankExercise.tsx`
- Create: `src/components/exercises/CodeExercise.tsx`
- Modify: `src/pages/LessonPage.tsx`

- [ ] **Step 1: Renderer für bestehende Exercise-Typen bauen**

Implement zuerst:
- `multiple_choice`
- `true_false`
- `fill_blank`
- `code_completion`
- `debugging`

Component API:

```ts
export type ExerciseRendererProps = {
  exercise: Exercise;
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};
```

- [ ] **Step 2: LessonPage Quiz-Step auf Renderer umstellen**

Replace direct `lesson.quiz.map` with:

```tsx
{lesson.exercises.filter((exercise) => exercise.type === 'multiple_choice' || exercise.type === 'true_false').map((exercise) => (
  <ExerciseRenderer key={exercise.id} exercise={exercise} onAnswered={handleExerciseAnswered} />
))}
```

- [ ] **Step 3: Existing completion gates erhalten**

`quizComplete` muss alle Quiz-/Exercise-Fragen prüfen. `blankComplete` und `codingComplete` bleiben zunächst separat, bis Fill-Blank und Coding komplett über Exercises laufen.

- [ ] **Step 4: Tests und Build laufen lassen**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/exercises src/pages/LessonPage.tsx
git commit -m "feat: render lesson exercises"
```

### Task 7: Meine-Fehler-Seite

**Files:**
- Create: `src/pages/MistakesPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/AppShell.tsx` or `src/pages/ProfilePage.tsx`
- Test: add component smoke test only if testing setup supports routing; otherwise service tests cover logic.

- [ ] **Step 1: Page bauen**

Sections:
- "Häufige Skill-Schwächen"
- "Falsche Antworten"
- "Fällige Wiederholungen"
- CTA: "Wiederholen"

UI text stays German.

- [ ] **Step 2: Route ergänzen**

```tsx
<Route path="/mistakes" element={<MistakesPage />} />
```

- [ ] **Step 3: Einstieg verlinken**

Add Profile link:

```tsx
<Link to="/mistakes" className="profile-link"><Flame size={20} /> Meine Fehler</Link>
```

Keep bottom nav unchanged for mobile density.

- [ ] **Step 4: Checks**

Run:

```bash
npm test
npm run lint
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/MistakesPage.tsx src/App.tsx src/pages/ProfilePage.tsx
git commit -m "feat: add mistakes review page"
```

### Task 8: Heute-lernen-Dashboard

**Files:**
- Create: `src/services/recommendationService.ts`
- Create: `src/services/recommendationService.test.ts`
- Create: `src/components/TodayLearningCard.tsx`
- Modify: `src/pages/DashboardPage.tsx`

- [x] **Step 1: Recommendation tests schreiben**

```ts
it('prefers due reviews before the next lesson', () => {
  const recommendation = getTodayLearningRecommendation({
    courses,
    progress: defaultProgress,
    dueReviews: [createReviewCard('python-variablen-und-typen-q1', '2026-06-12T10:00:00.000Z')],
    now: '2026-06-12T10:05:00.000Z'
  });
  expect(recommendation.dueReviewCount).toBe(1);
  expect(recommendation.primaryAction).toBe('review');
});
```

- [x] **Step 2: Recommendation service implementieren**

Return shape:

```ts
export interface TodayLearningRecommendation {
  dueReviewCount: number;
  nextLessonId: string;
  nextLessonTitle: string;
  miniChallengeExerciseId: string;
  primaryAction: 'review' | 'lesson' | 'challenge';
}
```

- [x] **Step 3: Dashboard-Karte einbauen**

Add `TodayLearningCard` above existing Weiterlernen card. Keep existing card visible; do not replace it yet.

- [x] **Step 4: Checks und Commit**

```bash
npm test
npm run lint
npm run build
git add src/services/recommendationService.ts src/services/recommendationService.test.ts src/components/TodayLearningCard.tsx src/pages/DashboardPage.tsx
git commit -m "feat: add today learning dashboard"
```

### Task 9: Boss-Fights pro Modul

**Files:**
- Modify: `src/models/learning.ts`
- Modify: `src/data/courses.ts`
- Create: `src/services/bossFightService.ts`
- Create: `src/services/bossFightService.test.ts`
- Modify: `src/pages/ModulePage.tsx`
- Create: `src/pages/BossFightPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Boss-Fight model ergänzen**

```ts
export interface BossFight {
  id: string;
  title: string;
  description: string;
  skillTags: SkillTag[];
  exercises: Exercise[];
  xp: number;
}
```

Add to `CourseModule`:

```ts
bossFight: BossFight;
```

- [ ] **Step 2: Test schreiben**

```ts
it('generates a boss fight for every module with combined skills', () => {
  for (const course of courses) {
    for (const module of course.modules) {
      expect(module.bossFight.exercises.length).toBeGreaterThanOrEqual(3);
      expect(new Set(module.bossFight.skillTags).size).toBeGreaterThanOrEqual(2);
    }
  }
});
```

- [ ] **Step 3: Generator implementieren**

Boss-Fight nimmt pro Modul:
- eine Konzeptfrage
- eine Debugging-Frage
- eine Mini-Projekt-Step-Frage

SkillTags werden aus den Modul-Lektionen zusammengeführt.

- [ ] **Step 4: ModulePage Card ergänzen**

Show after lesson cards:

```tsx
<Link to={`/courses/${course.id}/modules/${module.id}/boss-fight`} className="block rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-4">
  <h2 className="text-lg font-black">Boss-Fight: {module.bossFight.title}</h2>
  <p className="mt-2 text-sm leading-6 text-muted">{module.bossFight.description}</p>
</Link>
```

- [ ] **Step 5: BossFightPage mit ExerciseRenderer bauen**

Reuse `ExerciseRenderer`, record results in `LearningActivityContext`, award XP only when all exercises answered.

- [ ] **Step 6: Checks und Commit**

```bash
npm test
npm run lint
npm run build
git add src/models/learning.ts src/data/courses.ts src/services/bossFightService.ts src/services/bossFightService.test.ts src/pages/ModulePage.tsx src/pages/BossFightPage.tsx src/App.tsx
git commit -m "feat: add module boss fights"
```

## Empfohlene Reihenfolge

1. Exercise-Modell + Adapter.
2. Evaluation-Service mit Feedback pro Antwort.
3. Review-Service.
4. Fehlerbuch-State und LearningActivityContext.
5. LessonPage über ExerciseRenderer entlasten.
6. Meine-Fehler-Seite.
7. Heute-lernen-Dashboard.
8. Boss-Fights.

## Risiken und Schutzmaßnahmen

- Bestehende Inhalte können brechen, wenn `Lesson` hart umgebaut wird. Schutz: `quiz`, `fillBlank`, `codingChallenge` bleiben zunächst erhalten und `exercises` wird zusätzlich generiert.
- `LessonPage.tsx` kann weiter wachsen. Schutz: Exercise-Renderer früh extrahieren.
- localStorage-Migration kann alte Nutzerstände verlieren. Schutz: neue Keys verwenden und `load`-Funktionen mit Defaults normalisieren.
- Bottom Navigation kann mobil zu eng werden. Schutz: "Meine Fehler" zunächst über Profil und Dashboard verlinken.
- Skill-Tags können zu grob werden. Schutz: Tests prüfen Mindestabdeckung, später Seeds manuell präzisieren.

## Definition of Done

- Alle neuen Typen sind strikt typisiert.
- Bestehende Kurse und Lektionen funktionieren ohne Datenverlust weiter.
- `npm test`, `npm run lint`, `npm run build` laufen grün.
- Falsche Antworten speichern individuelles Feedback.
- Spaced-Repetition-Regeln decken falsch, schwer, richtig und leicht ab.
- Dashboard zeigt fällige Wiederholungen, nächste Lektion, Mini-Code-Challenge und Tagesziel.
- "Meine Fehler" zeigt Skill-Schwächen und empfohlene Wiederholungen.
- Jedes Modul hat einen Boss-Fight mit mehreren SkillTags.
