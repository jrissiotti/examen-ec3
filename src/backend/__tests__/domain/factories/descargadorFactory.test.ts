/**
 * Tests unitarios para DescargadorFactory
 * @module __tests__/domain/factories/descargadorFactory.test
 */
import { describe, it, expect } from 'vitest';
import { DescargadorFactory } from '../../../domain/factories/descargadorFactory';
import { DescargadorHttp } from '../../../infrastructure/descargadores/descargadorHttp';
import { DescargadorFtp } from '../../../infrastructure/descargadores/descargadorFtp';
import { DescargadorMock } from '../../../infrastructure/descargadores/descargadorMock';
import { ErrorTipoInvalido } from '../../../domain/errors';

describe('DescargadorFactory', () => {
  it('debe crear DescargadorHttp para tipo "http"', () => {
    const descargador = DescargadorFactory.crear('http');
    expect(descargador).toBeInstanceOf(DescargadorHttp);
  });

  it('debe crear DescargadorFtp para tipo "ftp"', () => {
    const descargador = DescargadorFactory.crear('ftp');
    expect(descargador).toBeInstanceOf(DescargadorFtp);
  });

  it('debe crear DescargadorMock para tipo "mock"', () => {
    const descargador = DescargadorFactory.crear('mock');
    expect(descargador).toBeInstanceOf(DescargadorMock);
  });

  it('debe ser case-insensitive', () => {
    const d1 = DescargadorFactory.crear('HTTP');
    const d2 = DescargadorFactory.crear('Http');
    expect(d1).toBeInstanceOf(DescargadorHttp);
    expect(d2).toBeInstanceOf(DescargadorHttp);
  });

  it('debe lanzar ErrorTipoInvalido para tipo desconocido', () => {
    expect(() => DescargadorFactory.crear('torrent')).toThrow(ErrorTipoInvalido);
    expect(() => DescargadorFactory.crear('')).toThrow(ErrorTipoInvalido);
  });
});
