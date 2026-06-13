import type { Exercise, ReviewRating } from '../../models/learning';
import type { ExerciseResult } from '../../services/exerciseEvaluationService';
import { CodeCompletionExercise } from './CodeCompletionExercise';
import { FillBlankExercise } from './FillBlankExercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { OrderingExercise } from './OrderingExercise';

export type ExerciseRendererProps = {
  exercise: Exercise;
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};

// Ordering exercises encode the correct sequence in the correct option's text,
// separated by " -> ". With two or more steps we can present a tap-to-order task.
function getOrderingSteps(exercise: Exercise): string[] {
  if (exercise.type !== 'ordering') return [];
  const correct = exercise.options?.find((option) => option.isCorrect);
  const steps = correct?.text.split('->').map((step) => step.trim()).filter(Boolean) ?? [];
  return steps.length >= 2 ? steps : [];
}

export function ExerciseRenderer({ exercise, onAnswered }: ExerciseRendererProps) {
  if (exercise.type === 'code_completion' && exercise.tokens?.length && exercise.codeSlots?.length) {
    return <CodeCompletionExercise exercise={exercise} onAnswered={onAnswered} />;
  }

  const orderingSteps = getOrderingSteps(exercise);
  if (orderingSteps.length >= 2) {
    return <OrderingExercise exercise={exercise} steps={orderingSteps} onAnswered={onAnswered} />;
  }

  if ((exercise.type === 'fill_blank' || exercise.type === 'short_answer') && exercise.expectedAnswer) {
    return <FillBlankExercise exercise={exercise} onAnswered={onAnswered} />;
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
