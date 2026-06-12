import { describe, expect, it } from 'vitest';
import { projects } from '../data/projects';
import { getProjectIdeConfig, getProjectLanguageCompletionSource } from './projectIdeService';

describe('project IDE configuration', () => {
  it('provides a language-specific IDE config for every practice project', () => {
    for (const project of projects) {
      const config = getProjectIdeConfig(project);

      expect(config.displayLanguage.length).toBeGreaterThan(1);
      expect(config.fileName).toContain('.');
      expect(config.starterCode.length).toBeGreaterThan(10);
      expect(config.completions.length).toBeGreaterThanOrEqual(6);
    }
  });

  it('keeps autocomplete suggestions scoped to the project language', () => {
    const sqlProject = projects.find((project) => project.courseId === 'sql')!;
    const reactProject = projects.find((project) => project.courseId === 'react')!;

    const sqlLabels = getProjectLanguageCompletionSource(sqlProject).map((completion) => completion.label);
    const reactLabels = getProjectLanguageCompletionSource(reactProject).map((completion) => completion.label);

    expect(sqlLabels).toContain('select');
    expect(sqlLabels).not.toContain('useState');
    expect(reactLabels).toContain('useState');
    expect(reactLabels).not.toContain('select');
  });
});
