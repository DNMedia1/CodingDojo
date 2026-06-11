import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '../store/ProgressContext';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { levelInfo, progress } = useProgress();

  return (
    <header className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Level {levelInfo.level} · {progress.streak} Tage Streak</p>
        <h1 className="mt-1 text-3xl font-black leading-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-muted">{subtitle}</p> : null}
      </div>
      <Link to="/settings" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-panelSoft text-muted">
        <Settings size={20} />
      </Link>
    </header>
  );
}
