import { Cita, EstadoCita } from '../types';
import { api } from './client';

export const citasApi = {
  listar: () => api.get<Cita[]>('/citas'),
  obtener: (id: number) => api.get<Cita>(`/citas/${id}`),
  crear: (data: Omit<Cita, 'id' | 'pacienteNombre'>) => api.post<Cita>('/citas', data),
  cambiarEstado: (id: number, estado: EstadoCita) =>
    api.patch<Cita>(`/citas/${id}/estado?estado=${estado}`),
  eliminar: (id: number) => api.delete<void>(`/citas/${id}`),
};
