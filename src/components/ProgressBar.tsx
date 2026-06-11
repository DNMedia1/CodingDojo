export function ProgressBar({ value, accent = '#50a7ff' }: { value: number; accent?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, value)}%`, background: accent }} />
    </div>
  );
}
