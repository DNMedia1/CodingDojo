import { RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { allLessons } from '../data/courses';
import { Difficulty } from '../models/learning';
import { useProgress } from '../store/ProgressContext';

const difficulties: Difficulty[] = ['basic', 'intermediate', 'advanced'];

export function QuizPage() {
  const { submitQuiz, progress } = useProgress();
  const [difficulty, setDifficulty] = useState<Difficulty>('basic');
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const questions = useMemo(() => {
    const pool = allLessons.flatMap((lesson) => lesson.quiz).filter((question) => question.difficulty === difficulty || difficulty === 'advanced');
    const missed = pool.filter((question) => progress.quizMistakes.includes(question.id));
    return [...missed, ...pool.filter((question) => !missed.includes(question))].slice(0, 6);
  }, [difficulty, progress.quizMistakes]);

  const submit = () => {
    const graded = submitQuiz(questions.map((question) => ({ questionId: question.id, correctOptionId: question.correctOptionId, selectedOptionId: selected[question.id] ?? '' })));
    setResult({ score: graded.score, total: graded.total, percentage: graded.percentage });
  };

  return (
    <div>
      <Header title="Quizmodus" subtitle="Übe gemischte Fragen oder wiederhole Konzepte, die noch nicht sitzen." />
      <div className="mb-4 grid grid-cols-3 gap-2">
        {difficulties.map((item) => (
          <button key={item} onClick={() => { setDifficulty(item); setSelected({}); setResult(null); }} className={`h-11 rounded-2xl text-xs font-extrabold capitalize ${difficulty === item ? 'bg-text text-ink' : 'bg-panel text-muted'}`}>
            {item === 'basic' ? 'Basis' : item === 'intermediate' ? 'Mittel' : 'Fortgeschritten'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <section key={question.id} className="rounded-3xl border border-white/10 bg-panel p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Frage {index + 1}</p>
            <h2 className="mt-2 font-extrabold leading-7">{question.prompt}</h2>
            <div className="mt-4 space-y-2">
              {question.options.map((option) => {
                const locked = Boolean(result);
                const isCorrect = locked && option.id === question.correctOptionId;
                const isSelected = selected[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    disabled={locked}
                    onClick={() => setSelected((current) => ({ ...current, [question.id]: option.id }))}
                    className={`w-full rounded-2xl border p-3 text-left text-sm font-bold leading-6 ${
                      isCorrect ? 'border-emerald-300/60 bg-emerald-300/10 text-emerald-100' : isSelected ? 'border-sky-300/60 bg-sky-300/10 text-sky-100' : 'border-white/10 bg-white/5 text-slate-200'
                    }`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
            {result ? <p className="mt-3 text-sm leading-6 text-muted">{question.explanation}</p> : null}
          </section>
        ))}
      </div>

      <button disabled={Object.keys(selected).length < questions.length} onClick={submit} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-text font-extrabold text-ink disabled:opacity-40">
        <Sparkles size={18} /> Antworten prüfen
      </button>
      {result ? (
        <div className="mt-4 rounded-3xl border border-white/10 bg-panelSoft p-5 text-center">
          <p className="text-4xl font-black">{result.percentage}%</p>
          <p className="mt-2 text-sm text-muted">{result.score}/{result.total} richtig · XP für richtige Antworten erhalten</p>
          <button onClick={() => { setSelected({}); setResult(null); }} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 px-4 font-bold">
            <RotateCcw size={17} /> Erneut versuchen
          </button>
        </div>
      ) : null}
    </div>
  );
}
