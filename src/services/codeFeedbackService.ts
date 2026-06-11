import type { CodingChallenge } from '../models/learning';

export type CodeFeedbackStatus = 'empty' | 'syntax-error' | 'missing-concept' | 'near-miss' | 'correct';

export interface CodeFeedback {
  status: CodeFeedbackStatus;
  title: string;
  message: string;
  hints: string[];
  passedChecks: number;
  totalChecks: number;
  score: number;
}

export function evaluateCode(rawCode: string, challenge: CodingChallenge): CodeFeedback {
  const code = rawCode.trim();
  const totalChecks = challenge.requiredConcepts.length;

  if (!code) {
    return feedback('empty', 'Noch kein Code', 'Schreibe zuerst eine Lösung in den Editor.', ['Starte mit dem Starter-Code und ergänze die fehlenden Zeilen.'], 0, totalChecks);
  }

  const syntaxHint = findSyntaxHint(code);
  if (syntaxHint) {
    return feedback('syntax-error', 'Syntaxproblem gefunden', 'Deine Lösung sieht strukturell noch nicht vollständig aus.', [syntaxHint], 0, totalChecks);
  }

  const normalizedCode = normalizeCode(code);
  const results = challenge.requiredConcepts.map((concept) => ({
    concept,
    passed: normalizedCode.includes(normalizeCode(concept.pattern))
  }));
  const passedChecks = results.filter((result) => result.passed).length;
  const hints = results.filter((result) => !result.passed).map((result) => result.concept.hint);

  if (passedChecks === totalChecks) {
    return feedback('correct', 'Richtig gelöst', 'Deine Lösung erfüllt alle lokalen Checks.', [], passedChecks, totalChecks);
  }

  if (passedChecks >= Math.max(1, totalChecks - 1)) {
    return feedback('near-miss', 'Fast richtig', 'Du bist sehr nah dran. Ein wichtiger Baustein fehlt noch.', hints, passedChecks, totalChecks);
  }

  return feedback('missing-concept', 'Konzept fehlt noch', 'Mehrere erwartete Bausteine fehlen noch in deiner Lösung.', hints, passedChecks, totalChecks);
}

function feedback(status: CodeFeedbackStatus, title: string, message: string, hints: string[], passedChecks: number, totalChecks: number): CodeFeedback {
  return {
    status,
    title,
    message,
    hints,
    passedChecks,
    totalChecks,
    score: totalChecks === 0 ? 0 : Math.round((passedChecks / totalChecks) * 100)
  };
}

function normalizeCode(value: string) {
  return value.toLowerCase().replace(/\s+/g, '').replace(/["'`;]/g, '');
}

function findSyntaxHint(code: string) {
  const pairs = [
    { open: '(', close: ')', label: 'runde Klammer' },
    { open: '{', close: '}', label: 'geschweifte Klammer' },
    { open: '[', close: ']', label: 'eckige Klammer' }
  ];

  for (const pair of pairs) {
    const openCount = countChar(code, pair.open);
    const closeCount = countChar(code, pair.close);
    if (openCount > closeCount) return `Es fehlt wahrscheinlich eine schließende Klammer (${pair.label}).`;
    if (closeCount > openCount) return `Es gibt wahrscheinlich eine zusätzliche schließende Klammer (${pair.label}).`;
  }

  if (countChar(code, '"') % 2 !== 0 || countChar(code, "'") % 2 !== 0 || countChar(code, '`') % 2 !== 0) {
    return 'Ein String ist wahrscheinlich nicht geschlossen. Prüfe Anführungszeichen und Template Strings.';
  }

  return '';
}

function countChar(value: string, char: string) {
  return value.split(char).length - 1;
}
