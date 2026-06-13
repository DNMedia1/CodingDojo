import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Exercise, ReviewRating } from '../../models/learning';
import type { ExerciseResult } from '../../services/exerciseEvaluationService';

type OrderingExerciseProps = {
  exercise: Exercise;
  steps: string[];
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};

// Deterministic shuffle so a given exercise always presents the same scramble,
// but never in the already-correct order.
function scramble(steps: string[]): string[] {
  if (steps.length < 2) return steps;
  const rotated = [...steps.slice(1), steps[0]];
  return rotated.every((value, index) => value === steps[index]) ? [...steps].reverse() : rotated;
}

export function OrderingExercise({ exercise, steps, onAnswered }: OrderingExerciseProps) {
  const pool = useMemo(() => scramble(steps), [steps]);
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<ExerciseResult | null>(null);

  const isReady = picked.length === steps.length;
  const orderedTexts = picked.map((poolIndex) => pool[poolIndex]);

  const pick = (poolIndex: number) => {
    if (result || picked.includes(poolIndex)) return;
    setPicked((current) => [...current, poolIndex]);
  };

  const reset = () => {
    setPicked([]);
    setResult(null);
  };

  const check = () => {
    const correct = orderedTexts.every((text, index) => text === steps[index]);
    const answerResult: ExerciseResult = {
      exerciseId: exercise.id,
      correct,
      selectedAnswer: orderedTexts.join(' -> '),
      correctAnswer: steps.join(' -> '),
      feedback: correct ? exercise.explanation : `Noch nicht. Richtige Reihenfolge: ${steps.join(' -> ')}.`,
      skillTags: exercise.skillTags
    };
    setResult(answerResult);
    onAnswered(answerResult, correct ? 'correct' : 'wrong');
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-extrabold">{exercise.prompt}</h2>
        <button type="button" onClick={reset} aria-label="Zurücksetzen" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted">
          <RotateCcw size={16} />
        </button>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">Tippe die Schritte in die richtige Reihenfolge.</p>

      <div className="mt-4 space-y-2">
        {steps.map((_, slotIndex) => {
          const text = orderedTexts[slotIndex];
          return (
            <div key={slotIndex} className={`flex items-center gap-3 rounded-2xl border p-3 ${text ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-dashed border-white/15 bg-white/[0.03]'}`}>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-black">{slotIndex + 1}</span>
              <span className="text-sm font-bold leading-6 text-slate-100">{text ?? 'Nächsten Schritt wählen …'}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((text, poolIndex) => {
          const used = picked.includes(poolIndex);
          return (
            <button
              key={poolIndex}
              type="button"
              disabled={Boolean(result) || used}
              onClick={() => pick(poolIndex)}
              className={`min-h-11 rounded-xl border px-3 text-left text-sm font-bold leading-6 transition ${used ? 'border-white/10 bg-white/5 text-muted opacity-50' : 'border-white/15 bg-panel text-slate-100'}`}
            >
              {text}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!isReady || Boolean(result)}
        onClick={check}
        className="mt-4 min-h-12 w-full rounded-2xl bg-text font-extrabold text-ink disabled:opacity-40"
      >
        Überprüfen
      </button>

      {result ? (
        <div className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${result.correct ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-yellow-300/40 bg-yellow-300/10 text-yellow-100'}`}>
          <div className="mt-0.5 shrink-0">{result.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</div>
          <div>
            <p className="font-black">{result.correct ? 'Klasse!' : 'Noch nicht ganz'}</p>
            <p className="mt-1">{result.feedback}</p>
            {!result.correct ? (
              <button type="button" onClick={reset} className="mt-3 min-h-10 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-extrabold">
                Nochmal versuchen
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
