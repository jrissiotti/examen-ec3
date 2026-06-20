/**
 * Caso de Uso: Cancelar Descarga
 * @module application/descargas/cancelarDescargaUseCase
 */
import { Descarga } from '../../domain/entities/descarga';
import { descargasRepository } from '../../interfaces/controllers/descargas.controller';
import { EstadoDescarga } from '../../shared/enums/index';
import { NotFoundException } from '../exceptions/notFoundException';
import { InvalidStateException } from '../exceptions/invalidStateException';

export class CancelarDescargaUseCase {
  async ejecutar(id: string): Promise<Descarga> {
    const descarga = descargasRepository.get(id);

    if (!descarga) {
      throw new NotFoundException(`No se encontró la descarga con ID: ${id}`);
    }

    // Solo se pueden cancelar descargas que no estén completadas o ya canceladas
    if (descarga.estado === EstadoDescarga.COMPLETADA || descarga.estado === EstadoDescarga.CANCELADA) {
      throw new InvalidStateException('No se puede cancelar una descarga completada o ya cancelada');
    }

    descarga.estado = EstadoDescarga.CANCELADA;
    descarga.tiempoFin = Date.now();
    descargasRepository.save(descarga);

    return descarga;
  }
}
