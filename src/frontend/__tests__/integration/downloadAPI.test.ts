/**
 * Tests de Integración Backend - API Descargas
 * @module integration/downloadAPI.test
 */
import { describe, it, expect } from 'vitest';

const API_URL = 'http://localhost:3000/api';

async function apiPost(path: string, body: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

describe('API Descargas - Integración Backend', () => {
  let createdId: string;

  it('debe crear una nueva descarga correctamente', async () => {
    const { status, data } = await apiPost('/descargas', {
      url: 'https://example.com/file.pdf',
      tipo: 'mock',
      maxReintentos: 3,
    });

    expect(status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('url', 'https://example.com/file.pdf');
    expect(data).toHaveProperty('tipo', 'mock');
    expect(data).toHaveProperty('estado');
    expect(data).toHaveProperty('mensaje', 'Descarga encolada');

    createdId = data.id;
  });

  it('debe obtener el estado de una descarga existente', async () => {
    const { status, data } = await apiGet(`/descargas/${createdId}/estado`);

    expect(status).toBe(200);
    expect(data).toHaveProperty('id', createdId);
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('tipo');
    expect(data).toHaveProperty('estado');
    expect(data).toHaveProperty('progreso');
    expect(data).toHaveProperty('intentos');
  });

  it('debe listar todas las descargas', async () => {
    const { status, data } = await apiGet('/descargas');

    expect(status).toBe(200);
    expect(data).toHaveProperty('descargas');
    expect(Array.isArray(data.descargas)).toBe(true);
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('completadas');
    expect(data).toHaveProperty('pendientes');
    expect(data).toHaveProperty('fallidas');
  });

  it('debe reintentar una descarga fallida', async () => {
    const { data: failData } = await apiPost('/descargas', {
      url: 'https://fail.example.com/file.pdf',
      tipo: 'mock',
      maxReintentos: 3,
    });

    const failId = failData.id;
    await new Promise((resolve) => setTimeout(resolve, 6000));

    const { status, data } = await apiPost(`/descargas/${failId}/reintentar`, {});
    
    expect([200, 400]).toContain(status);
    
    if (status === 200) {
      expect(data).toHaveProperty('mensaje', 'Descarga reencolada');
    } else {
      const hasErrorField = data.error !== undefined || data.message !== undefined;
      expect(hasErrorField).toBe(true);
    }
  }, 15000);

  it('debe manejar errores: URL inválida', async () => {
    const { status, data } = await apiPost('/descargas', {
      url: 'no-es-url-valida',
      tipo: 'http',
    });
    expect(status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('debe manejar errores: tipo inválido', async () => {
    const { status, data } = await apiPost('/descargas', {
      url: 'https://example.com/file.pdf',
      tipo: 'torrent',
    });
    expect(status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('debe manejar errores: descarga inexistente', async () => {
    const { status, data } = await apiGet('/descargas/id-inexistente-12345/estado');
    expect(status).toBe(404);
    const hasErrorField = data.error !== undefined || data.message !== undefined;
    expect(hasErrorField).toBe(true);
  });

  it('debe manejar errores: reintentar descarga no fallida', async () => {
    const { data: createData } = await apiPost('/descargas', {
      url: 'https://example.com/success.pdf',
      tipo: 'mock',
      maxReintentos: 1,
    });

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const { status, data } = await apiPost(`/descargas/${createData.id}/reintentar`, {});
    expect(status).toBeGreaterThanOrEqual(400);
    expect(status).toBeLessThan(500);
  }, 10000);

  it('debe validar reintentos máximos: rechazar más de 5', async () => {
    const { status, data } = await apiPost('/descargas', {
      url: 'https://example.com/file.pdf',
      tipo: 'mock',
      maxReintentos: 10,
    });
    expect(status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('debe aceptar reintentos máximos dentro del límite (5)', async () => {
    const { status, data } = await apiPost('/descargas', {
      url: 'https://example.com/file.pdf',
      tipo: 'mock',
      maxReintentos: 5,
    });
    expect(status).toBe(201);
    expect(data).toHaveProperty('id');
  });
});