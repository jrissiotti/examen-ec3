/**
 * Tests unitarios para UrlDescarga (Value Object)
 * @module __tests__/domain/value-objects/urlDescarga.test
 */
import { describe, it, expect } from 'vitest';
import { UrlDescarga } from '../../../domain/value-objects/urlDescarga';

describe('UrlDescarga - Value Object', () => {
  it('debe crear una URL válida con http', () => {
    const url = new UrlDescarga('https://example.com/file.pdf');
    expect(url.valor).toBe('https://example.com/file.pdf');
  });

  it('debe crear una URL válida con ftp', () => {
    const url = new UrlDescarga('ftp://server.com/file.zip');
    expect(url.valor).toBe('ftp://server.com/file.zip');
  });

  it('debe lanzar error con URL inválida', () => {
    expect(() => new UrlDescarga('no-es-url')).toThrow();
  });

  it('debe lanzar error con string vacío', () => {
    expect(() => new UrlDescarga('')).toThrow();
  });

  it('debe comparar igualdad correctamente', () => {
    const url1 = new UrlDescarga('https://example.com/file.pdf');
    const url2 = new UrlDescarga('https://example.com/file.pdf');
    expect(url1.valor).toBe(url2.valor);
  });

  it('debe detectar URLs diferentes', () => {
    const url1 = new UrlDescarga('https://example.com/file1.pdf');
    const url2 = new UrlDescarga('https://example.com/file2.pdf');
    expect(url1.valor).not.toBe(url2.valor);
  });
});
