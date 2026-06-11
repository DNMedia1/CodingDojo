import { describe, expect, it } from 'vitest';
import { courses } from './courses';

describe('course content', () => {
  it('contains six complete language tracks', () => {
    expect(courses).toHaveLength(6);

    for (const course of courses) {
      expect(course.modules).toHaveLength(3);
      for (const module of course.modules) {
        expect(module.lessons).toHaveLength(3);
        for (const lesson of module.lessons) {
          expect(lesson.theory.length).toBeGreaterThan(80);
          expect(lesson.codeExample.code.length).toBeGreaterThan(20);
          expect(lesson.quiz).toHaveLength(2);
          expect(lesson.practice.prompt.length).toBeGreaterThan(30);
        }
      }
    }
  });
});
