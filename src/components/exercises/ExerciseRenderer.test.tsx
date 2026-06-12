import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Exercise } from '../../models/learning';
import { ExerciseRenderer } from './ExerciseRenderer';

describe('ExerciseRenderer', () => {
  it('renders multiple-choice feedback and reports the answer result', () => {
    const exercise: Exercise = {
      id: 'exercise-1',
      type: 'multiple_choice',
      prompt: 'Welche Option nutzt return?',
      skillTags: ['functions'],
      difficulty: 'basic',
      explanation: 'return gibt Werte zurück.',
      options: [
        { id: 'a', text: 'return value', isCorrect: true, feedback: 'Richtig: return gibt den Wert zurück.' },
        { id: 'b', text: 'print value', isCorrect: false, feedback: 'Nicht ganz: print gibt keinen Wert zurück.' }
      ]
    };
    const onAnswered = vi.fn();

    render(<ExerciseRenderer exercise={exercise} onAnswered={onAnswered} />);
    fireEvent.click(screen.getByRole('button', { name: 'print value' }));

    expect(screen.getByText('Nicht ganz: print gibt keinen Wert zurück.')).toBeInTheDocument();
    expect(onAnswered).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: 'exercise-1', correct: false }),
      'wrong'
    );
  });

  it('lets learners tap code tokens into blanks before checking the answer', () => {
    const exercise: Exercise = {
      id: 'exercise-f-string',
      type: 'code_completion',
      prompt: 'Setze die fehlenden Bausteine in den Python-Code ein.',
      skillTags: ['variables'],
      difficulty: 'basic',
      code: 'name = "Mina"\nprint(__slot_1__"{__slot_2__} lernt Python")',
      codeSlots: [
        { id: 'slot-1', placeholder: '__slot_1__', answer: 'f' },
        { id: 'slot-2', placeholder: '__slot_2__', answer: 'name' }
      ],
      tokens: [
        { id: 'token-name', text: 'name', feedback: 'name ist die Variable, deren Wert eingesetzt wird.' },
        { id: 'token-f', text: 'f', feedback: 'Das f vor dem String aktiviert den f-String.' },
        { id: 'token-str', text: 'str', feedback: 'str wandelt Werte um, aktiviert aber keinen f-String.' }
      ],
      expectedAnswer: 'f\nname',
      explanation: 'Das f aktiviert den f-String, und {name} setzt den Wert der Variable ein.'
    };
    const onAnswered = vi.fn();

    render(<ExerciseRenderer exercise={exercise} onAnswered={onAnswered} />);
    fireEvent.click(screen.getByRole('button', { name: 'f' }));
    fireEvent.click(screen.getByRole('button', { name: 'name' }));
    fireEvent.click(screen.getByRole('button', { name: 'Antwort prüfen' }));

    expect(screen.getByText(/Das f aktiviert den f-String/)).toBeInTheDocument();
    expect(onAnswered).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: 'exercise-f-string', correct: true, selectedAnswer: 'f\nname' }),
      'correct'
    );
  });
});
