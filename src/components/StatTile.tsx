export function StatTile({ label, value, tone = 'blue' }: { label: string; value: string | number; tone?: 'blue' | 'yellow' | 'green' | 'purple' }) {
  const tones = {
    blue: 'from-sky-400/20 to-sky-500/5 text-sky-200',
    yellow: 'from-yellow-300/20 to-yellow-500/5 text-yellow-100',
    green: 'from-emerald-300/20 to-emerald-500/5 text-emerald-100',
    purple: 'from-violet-300/20 to-violet-500/5 text-violet-100'
  };
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${tones[tone]} p-4`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
    </div>
  );
}
