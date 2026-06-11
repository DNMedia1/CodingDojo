import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearOpenRouterApiKey, loadOpenRouterApiKey, requestCodeHint, saveOpenRouterApiKey } from './aiHintService';

describe('aiHintService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('stores the OpenRouter API key only in local browser storage', () => {
    saveOpenRouterApiKey('sk-or-test');

    expect(loadOpenRouterApiKey()).toBe('sk-or-test');

    clearOpenRouterApiKey();
    expect(loadOpenRouterApiKey()).toBe('');
  });

  it('requests a hint without asking for a complete solution', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Prüfe zuerst, ob deine Funktion wirklich einen Wert zurückgibt.' } }]
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    const hint = await requestCodeHint({
      apiKey: 'sk-or-test',
      courseTitle: 'Python',
      lessonTitle: 'Funktionen',
      language: 'python',
      challengePrompt: 'Schreibe eine Funktion, die den Durchschnitt zurückgibt.',
      code: 'def average(values):\n    sum(values) / len(values)',
      localFeedback: 'Ein return-Baustein fehlt noch.'
    });

    expect(hint).toContain('Funktion');
    const [, request] = fetchMock.mock.calls[0];
    const body = JSON.parse(request.body);
    expect(request.headers.Authorization).toBe('Bearer sk-or-test');
    expect(body.messages[0].content).toContain('keine vollständige Lösung');
    expect(body.messages[1].content).toContain('Ein return-Baustein fehlt noch.');
    expect(body.max_tokens).toBeLessThanOrEqual(220);
  });

  it('returns a helpful configuration error when no key is available', async () => {
    await expect(
      requestCodeHint({
        apiKey: '',
        courseTitle: 'Python',
        lessonTitle: 'Funktionen',
        language: 'python',
        challengePrompt: 'Schreibe eine Funktion.',
        code: '',
        localFeedback: ''
      })
    ).rejects.toThrow('OpenRouter API-Key fehlt');
  });
});
