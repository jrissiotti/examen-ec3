/**
 * Tests unitarios para Descarga (Entity)
 * @module __tests__/domain/entities/descarga.test
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { Descarga } from '../../../domain/entities/descarga';
import { EstadoDescarga } from '../../../shared/enums';

describe('Descarga - Entity', () => {
  let descarga: Descarga;

  beforeEach(() => {
    descarga = new Descarga('test-id-123', 'https://example.com/file.pdf', 'mock');
  });

  it('debe crearse con estado PENDIENTE por defecto', () => {
    expect(descarga.estado).toBe(EstadoDescarga.PENDIENTE);
    expect(descarga.progreso).toBe(0);
    expect(descarga.intentos).toBe(0);
  });

  it('debe tener un ID generado', () => {
    expect(descarga.id).toBe('test-id-123');
  });

  it('debe tener URL y tipo correctos', () => {
    expect(descarga.url).toBe('https://example.com/file.pdf');
    expect(descarga.tipo).toBe('mock');
  });

  it('debe cambiar a estado EN_PROGRESO al iniciar', () => {
    descarga.iniciar();
    expect(descarga.estado).toBe(EstadoDescarga.EN_PROGRESO);
  });

  it('debe actualizar progreso correctamente', () => {
    descarga.actualizarProgreso(50);
    expect(descarga.progreso).toBe(50);
  });

  it('debe completarse con estado COMPLETADA y progreso 100', () => {
    const data = Buffer.from('test data');
    descarga.completar(data);
    expect(descarga.estado).toBe(EstadoDescarga.COMPLETADA);
    expect(descarga.progreso).toBe(100);
    expect(descarga.data).toBe(data);
    expect(descarga.tiempoFin).toBeDefined();
  });

  it('debe fallar con estado FALLIDA y guardar error', () => {
    descarga.fallar('Error de conexión');
    expect(descarga.estado).toBe(EstadoDescarga.FALLIDA);
    expect(descarga.error).toBe('Error de conexión');
    expect(descarga.tiempoFin).toBeDefined();
  });

  it('debe generar reporte correctamente', () => {
    descarga.iniciar();
    descarga.actualizarProgreso(50);
    const reporte = descarga.generarReporte();
    expect(reporte.id).toBe('test-id-123');
    expect(reporte.estado).toBe(EstadoDescarga.EN_PROGRESO);
    expect(reporte.intentos).toBe(0);
    expect(reporte.tiempoTotal).toBeGreaterThanOrEqual(0);
  });

  it('debe generar ID único', () => {
    const id1 = Descarga.generarId();
    const id2 = Descarga.generarId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });
});
