/**
 * Tests unitarios para DescargadorBase
 * @module __tests__/domain/abstract/descargadorBase.test
 */
import { describe, it, expect } from 'vitest';
import { DescargadorBase } from '../../../domain/abstract/descargadorBase';
import { ErrorMaxReintentos, ErrorTimeout } from '../../../domain/errors';

class DescargadorTest extends DescargadorBase {
  async descargar(url: string): Promise<Buffer> {
    return this.ejecutarConReintento(async () => {
      this.progreso = 50;
      return Buffer.from('test');
    });
  }
}

class DescargadorFalla extends DescargadorBase {
  async descargar(url: string): Promise<Buffer> {
    return this.ejecutarConReintento(async () => {
      throw new Error('Fallo simulado');
    }, 2);
  }
}

describe('DescargadorBase', () => {
  it('debe inicializar con progreso 0', () => {
    const d = new DescargadorTest();
    expect(d.getProgreso()).toBe(0);
  });

  it('debe cancelar la descarga', () => {
    const d = new DescargadorTest();
    d.cancelar();
    expect(() => d.cancelar()).not.toThrow();
  });

  it('debe ejecutar descarga exitosa', async () => {
    const d = new DescargadorTest();
    const resultado = await d.descargar('https://example.com');
    expect(resultado).toBeInstanceOf(Buffer);
    expect(d.getProgreso()).toBe(50);
  });

  it('debe lanzar ErrorMaxReintentos tras fallos', async () => {
    const d = new DescargadorFalla();
    await expect(d.descargar('https://fail.com')).rejects.toThrow(ErrorMaxReintentos);
  });

  it('debe validar URL correctamente', () => {
    const d = new DescargadorTest();
    // @ts-ignore
    expect(d.validarUrl('https://example.com')).toBe(true);
    // @ts-ignore
    expect(d.validarUrl('no-url')).toBe(false);
  });
});
