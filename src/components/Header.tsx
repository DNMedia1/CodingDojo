import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '../store/ProgressContext';
import { formatDayCount } from '../utils/learning';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { levelInfo, progress } = useProgress();

  return (
    <header className="mb-5 flex items-start justify-between gap-4 lg:mb-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Level {levelInfo.level} · {formatDayCount(progress.streak)} Streak</p>
        <h1 className="mt-1 text-3xl font-black leading-tight lg:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-muted lg:mt-3 lg:text-base">{subtitle}</p> : null}
      </div>
      <Link to="/settings" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-panelSoft text-muted">
        <Settings size={20} />
      </Link>
    </header>
  );
}
