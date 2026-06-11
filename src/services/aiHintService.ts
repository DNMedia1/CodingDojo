const OPENROUTER_API_KEY_STORAGE_KEY = 'devpath-openrouter-api-key';
const OPENROUTER_CHAT_COMPLETIONS_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';

export interface CodeHintRequest {
  apiKey: string;
  courseTitle: string;
  lessonTitle: string;
  language: string;
  challengePrompt: string;
  code: string;
  localFeedback: string;
}

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export function loadOpenRouterApiKey() {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(OPENROUTER_API_KEY_STORAGE_KEY) ?? '';
}

export function saveOpenRouterApiKey(apiKey: string) {
  if (typeof localStorage === 'undefined') return;
  const trimmed = apiKey.trim();
  if (trimmed) {
    localStorage.setItem(OPENROUTER_API_KEY_STORAGE_KEY, trimmed);
  }
}

export function clearOpenRouterApiKey() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(OPENROUTER_API_KEY_STORAGE_KEY);
  }
}

export async function requestCodeHint(request: CodeHintRequest): Promise<string> {
  const apiKey = request.apiKey.trim();
  if (!apiKey) throw new Error('OpenRouter API-Key fehlt. Trage deinen Key ein, bevor du KI-Hilfe anforderst.');

  const response = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': getAppOrigin(),
      'X-Title': 'DevPath Mobile Learning'
    },
    body: JSON.stringify({
      model: DEFAULT_OPENROUTER_MODEL,
      temperature: 0.35,
      max_tokens: 180,
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein geduldiger deutscher Coding-Tutor. Gib Hilfe zur nächsten Denkbewegung, aber keine vollständige Lösung, keinen kompletten Codeblock und keine fertige Musterlösung. Antworte mit maximal drei kurzen Hinweisen und einer nächsten Aktion.'
        },
        {
          role: 'user',
          content: [
            `Kurs: ${request.courseTitle}`,
            `Lektion: ${request.lessonTitle}`,
            `Sprache: ${request.language}`,
            `Aufgabe: ${request.challengePrompt}`,
            `Lokales Feedback: ${request.localFeedback || 'Noch kein lokales Feedback.'}`,
            'Aktueller Code:',
            request.code || '(noch leer)',
            'Bitte hilf nur mit Hinweisen. Gib keine komplette Lösung aus.'
          ].join('\n')
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter konnte keine Hilfe laden (${response.status}). Prüfe API-Key, Guthaben oder Modellzugriff.`);
  }

  const payload = (await response.json()) as OpenRouterChatResponse;
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('OpenRouter hat keine verwertbare Hilfestellung zurückgegeben.');
  return content;
}

function getAppOrigin() {
  if (typeof window === 'undefined') return 'https://devpath.local';
  return window.location.origin;
}
