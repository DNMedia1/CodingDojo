import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CodeBlock({ code, language, className = '' }: { code: string; language?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard can be blocked; the button then simply does nothing visible
    }
  };

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-ink ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-200">{language ?? 'Code'}</span>
        <button type="button" onClick={copy} className="flex items-center gap-1.5 text-xs font-bold text-muted">
          {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
          {copied ? 'Kopiert' : 'Kopieren'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-7 text-sky-100"><code>{code}</code></pre>
    </div>
  );
}
