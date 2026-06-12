import { autocompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { Code2, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PracticeProject } from '../models/learning';
import { getProjectIdeConfig, type IdeLanguageId, type ProjectIdeCompletion } from '../services/projectIdeService';

interface ProjectIdeProps {
  project: PracticeProject;
}

export function ProjectIde({ project }: ProjectIdeProps) {
  const config = useMemo(() => getProjectIdeConfig(project), [project]);
  const storageKey = `devpath-project-code:${project.id}`;
  const [code, setCode] = useState(() => loadProjectCode(storageKey) || config.starterCode);

  useEffect(() => {
    setCode(loadProjectCode(storageKey) || config.starterCode);
  }, [config.starterCode, storageKey]);

  useEffect(() => {
    saveProjectCode(storageKey, code);
  }, [code, storageKey]);

  return (
    <section className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#08111d]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] p-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-sky-100">
            <Code2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">{config.displayLanguage}</p>
            <h3 className="truncate text-sm font-black text-text">{config.fileName}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCode(config.starterCode)}
          className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-xs font-black text-slate-200 transition hover:bg-white/10"
        >
          <RotateCcw size={16} />
          Zurücksetzen
        </button>
      </div>

      <CodeMirrorEditor code={code} language={config.language} completions={config.completions} onChange={setCode} />

      <div className="flex flex-wrap items-start gap-2 border-t border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-muted">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-sky-200" />
        <span>
          Autocomplete ist auf {config.displayLanguage} begrenzt. Drücke <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-slate-200">Ctrl</kbd> +{' '}
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-slate-200">Space</kbd> oder beginne zu tippen.
        </span>
      </div>
    </section>
  );
}

function CodeMirrorEditor({
  code,
  language,
  completions,
  onChange
}: {
  code: string;
  language: IdeLanguageId;
  completions: ProjectIdeCompletion[];
  onChange: (code: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const codeRef = useRef(code);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      doc: codeRef.current,
      parent: containerRef.current,
      extensions: [
        basicSetup,
        editorTheme,
        EditorView.lineWrapping,
        ...languageExtensions(language),
        autocompletion({ override: [buildCompletionSource(completions)] }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChangeRef.current(update.state.doc.toString());
        })
      ]
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [completions, language]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const current = view.state.doc.toString();
    if (current === code) return;

    view.dispatch({
      changes: { from: 0, to: current.length, insert: code }
    });
  }, [code]);

  return <div ref={containerRef} className="project-ide-editor" />;
}

function buildCompletionSource(completions: ProjectIdeCompletion[]) {
  return (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/[\w.-]+/);
    if (!context.explicit && (!word || word.from === word.to)) return null;

    return {
      from: word?.from ?? context.pos,
      options: completions.map((completion) => ({
        label: completion.label,
        type: completion.type,
        detail: completion.detail,
        apply: completion.apply ?? completion.label
      }))
    };
  };
}

function languageExtensions(language: IdeLanguageId): Extension[] {
  if (language === 'python') return [python()];
  if (language === 'java') return [java()];
  if (language === 'html') return [html()];
  if (language === 'css') return [css()];
  if (language === 'sql') return [sql()];
  if (language === 'javascript') return [javascript()];
  if (language === 'typescript') return [javascript({ typescript: true })];
  if (language === 'tsx') return [javascript({ jsx: true, typescript: true })];
  return [];
}

function loadProjectCode(storageKey: string) {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(storageKey) ?? '';
}

function saveProjectCode(storageKey: string, code: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(storageKey, code);
}

const editorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#08111d',
      color: '#e7eefb',
      fontSize: '14px'
    },
    '.cm-scroller': {
      fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
      minHeight: '260px'
    },
    '.cm-content': {
      padding: '16px',
      caretColor: '#93c5fd'
    },
    '.cm-line': {
      lineHeight: '1.7'
    },
    '.cm-gutters': {
      backgroundColor: '#0b1624',
      color: '#64748b',
      border: 'none'
    },
    '.cm-activeLineGutter, .cm-activeLine': {
      backgroundColor: 'rgba(148, 163, 184, 0.08)'
    },
    '.cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'rgba(96, 165, 250, 0.32) !important'
    },
    '.cm-tooltip': {
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#101a27',
      color: '#e7eefb',
      boxShadow: '0 20px 70px rgba(0, 0, 0, 0.35)'
    },
    '.cm-tooltip-autocomplete ul': {
      fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif'
    },
    '.cm-tooltip-autocomplete ul li[aria-selected]': {
      backgroundColor: 'rgba(96, 165, 250, 0.2)',
      color: '#ffffff'
    }
  },
  { dark: true }
);
