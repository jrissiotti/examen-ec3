/**
 * Handlers de MSW para simular API en tests E2E
 * @module mocks/handlers
 */

import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/descargas', async ({ request }) => {
    const body = (await request.json()) as { url: string; tipo: string };
    return HttpResponse.json(
      {
        id: `mock-${Date.now()}`,
        url: body.url,
        tipo: body.tipo,
        estado: 'PENDIENTE',
        mensaje: 'Descarga encolada',
      },
      { status: 201 }
    );
  }),

  http.get('/api/descargas/:id/estado', ({ params }) => {
    return HttpResponse.json({
      id: params.id as string,
      url: 'https://example.com/file.pdf',
      tipo: 'mock',
      estado: 'EN_PROGRESO',
      progreso: 50,
      intentos: 1,
    });
  }),

  http.get('/api/descargas', () => {
    return HttpResponse.json({
      descargas: [
        {
          id: 'mock-1',
          url: 'https://example.com/file1.pdf',
          tipo: 'mock',
          estado: 'COMPLETADA',
          progreso: 100,
          intentos: 1,
        },
        {
          id: 'mock-2',
          url: 'https://example.com/file2.pdf',
          tipo: 'http',
          estado: 'EN_PROGRESO',
          progreso: 45,
          intentos: 1,
        },
      ],
      total: 2,
      completadas: 1,
      pendientes: 1,
      fallidas: 0,
    });
  }),

  http.post('/api/descargas/:id/reintentar', ({ params }) => {
    return HttpResponse.json({
      id: params.id as string,
      estado: 'PENDIENTE',
      mensaje: 'Descarga reencolada',
    });
  }),
];
