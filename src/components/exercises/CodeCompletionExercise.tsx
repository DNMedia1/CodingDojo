import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { Exercise, ReviewRating } from '../../models/learning';
import { evaluateExerciseAnswer, type ExerciseResult } from '../../services/exerciseEvaluationService';

type CodeCompletionExerciseProps = {
  exercise: Exercise;
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};

export function CodeCompletionExercise({ exercise, onAnswered }: CodeCompletionExerciseProps) {
  const slots = exercise.codeSlots ?? [];
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const selectedTokens = selectedTokenIds.flatMap((id) => {
    const token = exercise.tokens?.find((candidate) => candidate.id === id);
    return token ? [token] : [];
  });
  const selectedAnswers = selectedTokens.map((token) => token.text);
  const isReady = slots.length > 0 && selectedAnswers.length === slots.length;

  const codePreview = slots.reduce((code, slot, index) => {
    const value = selectedAnswers[index] ?? '____';
    return code.replace(slot.placeholder, value);
  }, exercise.code ?? '');

  const chooseToken = (tokenId: string) => {
    if (result || selectedTokenIds.includes(tokenId) || selectedTokenIds.length >= slots.length) return;
    setSelectedTokenIds((current) => [...current, tokenId]);
  };

  const reset = () => {
    setSelectedTokenIds([]);
    setResult(null);
  };

  const checkAnswer = () => {
    const answerResult = evaluateExerciseAnswer(exercise, selectedAnswers.join('\n'));
    setResult(answerResult);
    onAnswered(answerResult, answerResult.correct ? 'correct' : 'wrong');
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-extrabold">{exercise.prompt}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Tippe die Bausteine in der richtigen Reihenfolge an. Jeder Tipp füllt den nächsten freien Slot im Code.</p>
        </div>
        <button
          type="button"
          onClick={reset}
          aria-label="Zurücksetzen"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-ink p-4 text-sm leading-6 text-sky-100"><code>{codePreview}</code></pre>

      <div className="mt-4 flex flex-wrap gap-2">
        {(exercise.tokens ?? []).map((token) => {
          const used = selectedTokenIds.includes(token.id);
          return (
            <button
              key={token.id}
              type="button"
              disabled={Boolean(result) || used || selectedTokenIds.length >= slots.length}
              onClick={() => chooseToken(token.id)}
              className={`min-h-10 rounded-2xl border px-4 font-mono text-sm font-bold transition ${
                used ? 'border-emerald-300/50 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/5 text-slate-100 disabled:opacity-45'
              }`}
            >
              {token.text}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-muted">
          {selectedAnswers.length > 0 ? selectedAnswers.join(' -> ') : 'Noch kein Baustein gewählt.'}
        </div>
        <button
          type="button"
          disabled={!isReady || Boolean(result)}
          onClick={checkAnswer}
          className="min-h-12 rounded-2xl bg-text px-5 font-extrabold text-ink disabled:opacity-50"
        >
          Antwort prüfen
        </button>
      </div>

      {result ? (
        <div className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${result.correct ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-yellow-300/40 bg-yellow-300/10 text-yellow-100'}`}>
          {result.feedback}
        </div>
      ) : null}
    </div>
  );
}
