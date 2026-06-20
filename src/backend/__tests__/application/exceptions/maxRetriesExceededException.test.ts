/**
 * Tests unitarios para MaxRetriesExceededException
 * @module __tests__/application/exceptions/maxRetriesExceededException.test
 */
import { describe, it, expect } from 'vitest';
import { MaxRetriesExceededException } from '../../../application/exceptions/maxRetriesExceededException';

describe('MaxRetriesExceededException', () => {
  it('debe crear excepción con mensaje correcto', () => {
    const ex = new MaxRetriesExceededException('Máximo de reintentos alcanzado');
    expect(ex.message).toBe('Máximo de reintentos alcanzado');
    expect(ex.name).toBe('MaxRetriesExceededException');
  });

  it('debe ser instancia de Error', () => {
    const ex = new MaxRetriesExceededException('test');
    expect(ex).toBeInstanceOf(Error);
  });
});
