/**
 * Tests unitarios para DescargadorMock
 * @module __tests__/infrastructure/descargadores/descargadorMock.test
 */
import { describe, it, expect } from 'vitest';
import { DescargadorMock } from '../../../infrastructure/descargadores/descargadorMock';

describe('DescargadorMock', () => {
  it('debe descargar exitosamente', async () => {
    const mock = new DescargadorMock();
    const resultado = await mock.descargar('https://example.com/test.pdf');
    expect(resultado).toBeInstanceOf(Buffer);
    expect(resultado.toString()).toContain('Mock exitoso');
  });

  it('debe actualizar progreso durante descarga', async () => {
    const mock = new DescargadorMock();
    expect(mock.getProgreso()).toBe(0);
    await mock.descargar('https://example.com');
    expect(mock.getProgreso()).toBe(100);
  });

  it('debe poder cancelarse', () => {
    const mock = new DescargadorMock();
    mock.cancelar();
    expect(() => mock.cancelar()).not.toThrow();
  });
});
