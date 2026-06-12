import type { Exercise, ReviewRating } from '../../models/learning';
import type { ExerciseResult } from '../../services/exerciseEvaluationService';
import { CodeCompletionExercise } from './CodeCompletionExercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';

export type ExerciseRendererProps = {
  exercise: Exercise;
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};

export function ExerciseRenderer({ exercise, onAnswered }: ExerciseRendererProps) {
  if (exercise.type === 'code_completion' && exercise.tokens?.length && exercise.codeSlots?.length) {
    return <CodeCompletionExercise exercise={exercise} onAnswered={onAnswered} />;
  }

  if (exercise.options?.length) {
    return <MultipleChoiceExercise exercise={exercise} onAnswered={onAnswered} />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="font-extrabold">{exercise.prompt}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Dieser Aufgabentyp wird im nächsten Schritt interaktiv gerendert.</p>
    </div>
  );
}
