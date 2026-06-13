import { CheckCircle2, XCircle } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { Exercise, ReviewRating } from '../../models/learning';
import { evaluateExerciseAnswer, type ExerciseResult } from '../../services/exerciseEvaluationService';

type FillBlankExerciseProps = {
  exercise: Exercise;
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};

const BLANK = '____';

export function FillBlankExercise({ exercise, onAnswered }: FillBlankExerciseProps) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [attempts, setAttempts] = useState(0);

  const expected = exercise.expectedAnswer ?? '';
  const segments = (exercise.code ?? '').split(BLANK);
  const filled = value.trim().length > 0 ? value.trim() : null;

  const check = () => {
    const answerResult = evaluateExerciseAnswer(exercise, value);
    setResult(answerResult);
    if (!answerResult.correct) setAttempts((current) => current + 1);
    onAnswered(answerResult, answerResult.correct ? 'correct' : 'wrong');
  };

  const reveal = () => {
    setValue(expected);
    const answerResult = evaluateExerciseAnswer(exercise, expected);
    setResult(answerResult);
    onAnswered(answerResult, 'wrong');
  };

  const pickToken = (text: string) => {
    if (result) return;
    setValue(text);
  };

  return (
    <div>
      <h2 className="font-extrabold">{exercise.prompt}</h2>

      {exercise.code ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-ink">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-2" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-7 text-sky-100"><code>
            {segments.map((segment, index) => (
              <Fragment key={index}>
                {segment}
                {index < segments.length - 1 ? (
                  <span className={`mx-0.5 inline-flex min-w-12 items-center justify-center rounded-md border px-2 align-middle font-black ${filled ? 'border-emerald-300/60 bg-emerald-300/15 text-emerald-100' : 'border-sky-300/50 bg-sky-300/10 text-sky-100'}`}>
                    {filled ?? BLANK}
                  </span>
                ) : null}
              </Fragment>
            ))}
          </code></pre>
        </div>
      ) : null}

      <input
        value={value}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        placeholder="Deine Ergänzung"
        disabled={Boolean(result?.correct)}
        onChange={(event) => {
          setValue(event.target.value);
          if (result && !result.correct) setResult(null);
        }}
        className={`mt-4 min-h-12 w-full rounded-2xl border bg-ink px-4 font-mono text-sm outline-none ${
          result?.correct ? 'border-emerald-300/60' : result ? 'border-red-300/60' : 'border-white/10 focus:border-sky-300'
        }`}
      />

      {(exercise.tokens?.length ?? 0) > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {(exercise.tokens ?? []).map((token) => (
            <button
              key={token.id}
              type="button"
              disabled={Boolean(result?.correct)}
              onClick={() => pickToken(token.text)}
              className="min-h-10 rounded-xl border border-white/15 bg-panel px-3 font-mono text-sm font-black text-slate-100 disabled:opacity-45"
            >
              {token.text}
            </button>
          ))}
        </div>
      ) : null}

      {!result?.correct ? (
        <button
          type="button"
          onClick={check}
          disabled={value.trim().length === 0}
          className="mt-4 min-h-12 w-full rounded-2xl bg-text font-extrabold text-ink disabled:opacity-40"
        >
          Überprüfen
        </button>
      ) : null}

      {result ? (
        <div className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${result.correct ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-yellow-300/40 bg-yellow-300/10 text-yellow-100'}`}>
          <div className="mt-0.5 shrink-0">{result.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</div>
          <div>
            <p className="font-black">{result.correct ? 'Richtig!' : 'Noch nicht ganz'}</p>
            <p className="mt-1">{result.feedback}</p>
            {!result.correct && attempts >= 2 ? (
              <button type="button" onClick={reveal} className="mt-3 min-h-10 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-extrabold">
                Lösung anzeigen
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
