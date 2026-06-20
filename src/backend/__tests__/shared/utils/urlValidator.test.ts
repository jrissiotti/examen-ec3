/**
 * Tests unitarios para UrlValidator
 * @module __tests__/shared/utils/urlValidator.test
 */
import { describe, it, expect } from 'vitest';
import { UrlValidator } from '../../../shared/utils/urlValidator';

describe('UrlValidator', () => {
  describe('validar', () => {
    it('debe validar URL http correcta', () => {
      expect(UrlValidator.validar('https://example.com')).toBe(true);
    });

    it('debe validar URL ftp correcta', () => {
      expect(UrlValidator.validar('ftp://server.com/file.zip')).toBe(true);
    });

    it('debe rechazar URL inválida', () => {
      expect(UrlValidator.validar('no-es-url')).toBe(false);
    });

    it('debe rechazar string vacío', () => {
      expect(UrlValidator.validar('')).toBe(false);
    });
  });

  describe('normalizar', () => {
    it('debe eliminar hash de URL', () => {
      const result = UrlValidator.normalizar('https://example.com#section');
      expect(result).toBe('https://example.com/');
    });
  });

  describe('obtenerProtocolo', () => {
    it('debe obtener protocolo https', () => {
      expect(UrlValidator.obtenerProtocolo('https://example.com')).toBe('https');
    });

    it('debe obtener protocolo ftp', () => {
      expect(UrlValidator.obtenerProtocolo('ftp://server.com')).toBe('ftp');
    });
  });

  describe('obtenerNombreArchivo', () => {
    it('debe obtener nombre de archivo', () => {
      expect(UrlValidator.obtenerNombreArchivo('https://example.com/file.pdf')).toBe('file.pdf');
    });

    it('debe retornar "descarga" si no hay archivo', () => {
      expect(UrlValidator.obtenerNombreArchivo('https://example.com/')).toBe('descarga');
    });
  });
});
