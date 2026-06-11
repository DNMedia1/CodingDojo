import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { getLesson, courses } from '../data/courses';
import { useProgress } from '../store/ProgressContext';
import { isLessonCompleted } from '../utils/learning';

export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId ?? '');
  const course = courses.find((item) => item.modules.some((module) => module.lessons.some((candidate) => candidate.id === lesson?.id)));
  const { complete, progress } = useProgress();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const completed = lesson && course ? isLessonCompleted(progress, course.id, lesson.id) : false;

  const quizComplete = useMemo(() => lesson?.quiz.every((question) => answers[question.id]) ?? false, [answers, lesson]);
  if (!lesson || !course) return <Header title="Lektion nicht gefunden" subtitle="Gehe zu einem Kurs und wähle eine andere Lektion." />;

  const finish = () => {
    complete(course.id, lesson.id, lesson.xp);
    navigate(`/courses/${course.id}`);
  };

  return (
    <div>
      <Header title={lesson.title} subtitle={`${course.title} · ${lesson.estimatedMinutes} min · ${lesson.xp} XP`} />
      <div className="mb-4 grid grid-cols-4 gap-2">
        {['Theorie', 'Code', 'Quiz', 'Aufgabe'].map((label, index) => (
          <button key={label} onClick={() => setStep(index)} className={`h-10 rounded-xl text-xs font-extrabold ${step === index ? 'bg-text text-ink' : 'bg-panel text-muted'}`}>
            {label}
          </button>
        ))}
      </div>

      <section className="rounded-3xl border border-white/10 bg-panel p-5 shadow-glow">
        {step === 0 ? (
          <div>
            <h2 className="text-xl font-black">Verstehe die Idee</h2>
            <p className="mt-4 text-base leading-8 text-slate-200">{lesson.theory}</p>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h2 className="text-xl font-black">Lies den Code</h2>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-ink p-4 text-sm leading-6 text-sky-100"><code>{lesson.codeExample.code}</code></pre>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            {lesson.quiz.map((question) => {
              const selected = answers[question.id];
              return (
                <div key={question.id}>
                  <h2 className="font-extrabold">{question.prompt}</h2>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option) => {
                      const isSelected = selected === option.id;
                      const isCorrect = selected && option.id === question.correctOptionId;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                          className={`w-full rounded-2xl border p-3 text-left text-sm font-bold leading-6 transition ${
                            isCorrect ? 'border-emerald-300/60 bg-emerald-300/10 text-emerald-100' : isSelected ? 'border-red-300/60 bg-red-300/10 text-red-100' : 'border-white/10 bg-white/5 text-slate-200'
                          }`}
                        >
                          {option.text}
                        </button>
                      );
                    })}
                  </div>
                  {selected ? <p className="mt-3 text-sm leading-6 text-muted">{question.explanation}</p> : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h2 className="text-xl font-black">Praxisaufgabe</h2>
            <p className="mt-3 text-base leading-7 text-slate-200">{lesson.practice.prompt}</p>
            <ul className="mt-4 space-y-2">
              {lesson.practice.checklist.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted"><Check size={17} className="mt-0.5 shrink-0 text-emerald-300" /> {item}</li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-sky-100">Hinweis: {lesson.practice.hint}</p>
          </div>
        ) : null}
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-panel font-extrabold disabled:opacity-40">
          <ChevronLeft size={18} /> Zurück
        </button>
        {step < 3 ? (
          <button onClick={() => setStep((current) => Math.min(3, current + 1))} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-text font-extrabold text-ink">
            Weiter <ChevronRight size={18} />
          </button>
        ) : (
          <button disabled={!quizComplete && !completed} onClick={finish} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-300 font-extrabold text-ink disabled:opacity-40">
            {completed ? 'Erledigt' : 'Abschliessen'}
          </button>
        )}
      </div>
      <Link to={`/courses/${course.id}`} className="mt-4 block text-center text-sm font-bold text-muted">Zurück zu {course.title}</Link>
    </div>
  );
}
