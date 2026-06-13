import { Bono } from '../types';
import { api } from './client';

export const bonosApi = {
  listar: (pacienteId?: number) =>
    api.get<Bono[]>(`/bonos${pacienteId ? `?pacienteId=${pacienteId}` : ''}`),
  crear: (data: Omit<Bono, 'id' | 'pacienteNombre' | 'sesionesRestantes' | 'activo'>) =>
    api.post<Bono>('/bonos', data),
  usarSesion: (id: number) => api.patch<Bono>(`/bonos/${id}/usar-sesion`),
  eliminar: (id: number) => api.delete<void>(`/bonos/${id}`),
};
