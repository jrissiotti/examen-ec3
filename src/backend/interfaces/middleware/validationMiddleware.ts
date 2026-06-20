import { Request, Response, NextFunction } from 'express';

/**
 * Validates body structure for creating a download
 */
export const validarCreacionDescarga = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { url, tipo, maxReintentos } = req.body;

if (!url || typeof url !== 'string') {
  res.status(400).json({ error: 'URL requerida y debe ser string' });
  return;
}

// Validar formato de URL
try {
  new URL(url);
} catch {
  res.status(400).json({ error: 'URL inválida' });
  return;
}

  if (!tipo || !['http', 'ftp', 'mock'].includes(tipo)) {
    res.status(400).json({
      error: 'tipo requerido, debe ser: http, ftp o mock'
    });
    return;
  }

  // Validar maxReintentos
  if (maxReintentos !== undefined && (maxReintentos < 0 || maxReintentos > 5)) {
    res.status(400).json({
      error: 'maxReintentos debe estar entre 0 y 5'
    });
    return;
  }

  next();
};